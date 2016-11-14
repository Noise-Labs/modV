//let socket = new WebSocket("ws://192.168.178.141:1337/NERDDISCO-NerdV");
//let socket = new WebSocket("ws://192.168.178.141:1337");

importScripts('./SweetCandy.js'); // jshint ignore:line
let Candy = new SweetCandy('ws://192.168.0.9:7890'); // jshint ignore:line
console.log(Candy);

onmessage = function(e) { //jshint ignore:line
    let message = e.data;

	switch(message.type) {

		case 'setup':
			let width = message.payload.width;
			let height = message.payload.height;
            let DPR = message.payload.devicePixelRatio;
            Candy.devicePixelRatio = DPR;
            Candy.reset();
			Candy.LEDGrid8x8(0, Math.floor(width/2), Math.floor(height/2), Math.floor(width/12), 0, false, width);
		break;

        case 'data':
            process(message.payload);
        break;
	}
};

function process(pixels) {
    // Convert Uint8Array to Array
    let pixelsArray = Array.from(pixels);
    Candy.drawFrame(null, null, pixelsArray, false);
}

// let socket = new WebSocket("ws://localhost:3132");

// socket.onerror = function(error) {
// 	console.error(error);
// };

// socket.onopen = function() {
// 	console.info('GrabCanvas connected to NERD DISCO');
// };

// socket.onmessage = function(message) {
// 	console.log('GrabCanvas message', message);
// };

// let blockSize = 2;

// let strips = 8;
// let stripSize = 30;

// onmessage = function(e) { //jshint ignore:line
// 	let avCount = 0;
// 	let i = -4;
// 	let rgb = [0, 0, 0];

// 	let canvasWidth = e.data[0];
// 	let canvasHeight = e.data[1];
// 	let data = e.data[2];

// 	let length = data.length;

// 	let width = Math.floor(canvasWidth / strips);
// 	let height = Math.floor(canvasHeight / stripSize);

//	 let count = 0;
// 	let count2 = 0;
	
// 	let count3 = 0;
	
// 	let LEDsArray = [];
	
// 	for(let pixel=0; pixel < length; pixel+=4) {
		
// 		if(count3 === width || count3 === 0) {
// 			count3 = 0;
			
// 			LEDsArray.push(data[pixel]);
// 			LEDsArray.push(data[pixel+1]);
//			 LEDsArray.push(data[pixel+2]);
			
// 			count++;
// 		}
		
// 		if(count === strips) {
// 			count = 0;
// 			pixel = ((canvasWidth * count2) * 4);
// 			pixel += (height * (canvasWidth * count2)) * 4;
// 			count2++;
// 		}
		
// 		count3++;
// 	}

// 	while ( (i += blockSize * 4) < length ) {
// 		++avCount;
// 		rgb[0] += data[i];
// 		rgb[1] += data[i+1];
// 		rgb[2] += data[i+2];
// 	}
	
// 	// ~~ used to floor values
// 	rgb[0] = ~~(rgb[0]/avCount); //jshint ignore:line
// 	rgb[1] = ~~(rgb[1]/avCount); //jshint ignore:line
// 	rgb[2] = ~~(rgb[2]/avCount); //jshint ignore:line

// 	let DMXArray = '[';

// 	for(let i=0; i < (strips * stripSize) * 3; i+=3) {
// 			if(i !== 0) DMXArray += ',';

// 			DMXArray += rgb[0] + ',';
// 			DMXArray += rgb[1] + ',';
// 			DMXArray += rgb[2];
// 	}

// 	DMXArray += ']';

	
// 	try {
// 		socket.send(JSON.stringify(LEDsArray));
//		 //socket.send(JSON.stringify(DMXArray));
// 	} catch(e) {
// 		//socket.close();
// 	}
// };