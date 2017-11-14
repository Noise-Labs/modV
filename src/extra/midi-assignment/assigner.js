import EventEmitter2 from 'eventemitter2';
import Vue from '@/main';

class MIDIAssigner extends EventEmitter2 {
  constructor(settings) {
    super();

    this.access = null;
    this.inputs = null;
    this.assignments = new Map();
    this.learning = false;
    this.toLearn = '';

    this.get = (key) => {
      this.assignments.get(key);
    };

    if (settings.get) this.get = settings.get;

    this.set = (key, value) => {
      this.assignments.set(key, value);
    };

    if (settings.set) this.set = settings.set;

    this.handleInputBound = this.handleInput.bind(this);
  }

  start() {
    // request MIDI access
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess({
        sysex: false,
      }).then((access) => {
        this.access = access;
        this.inputs = access.inputs;

        this.handleDevices(access.inputs);

        access.addEventListener('statechange', (e) => {
          this.handleDevices(e.currentTarget.inputs);
        });
      }).catch(() => {
        Vue.$notify({
          title: 'MIDI Access Refused',
          text: 'MIDI access was refused. Please check your MIDI permissions for modV and refresh the page',
          type: 'error',
          position: 'top center',
          group: 'custom-template',
          duration: -1,
        });
      });
    } else {
      Vue.$notify({
        title: 'Outdated Browser',
        text: 'Unfortunately your browser does not support WebMIDI, please update to the latest Google Chrome release',
        type: 'error',
        position: 'top center',
        group: 'custom-template',
        duration: -1,
      });
    }
  }

  handleDevices(inputs) {
    // loop over all available inputs and listen for any MIDI input
    for(let input of inputs.values()) { // eslint-disable-line
      // each time there is a midi message call the onMIDIMessage function
      input.removeEventListener('midimessage', this.handleInputBound);
      input.addEventListener('midimessage', this.handleInputBound);
    }
  }

  handleInput(message) {
    const data = message.data;
    const midiChannel = parseInt(data[1], 10);

    if (this.learning) {
      this.set(midiChannel, { variable: this.toLearn, value: null });
      this.learning = false;
      this.toLearn = '';
    }

    const assignment = this.get(midiChannel);
    if (assignment) this.emit('midiAssignmentInput', midiChannel, assignment, message);
  }

  learn(variableName) {
    this.learning = true;
    this.toLearn = variableName;
  }
}

export default MIDIAssigner;
