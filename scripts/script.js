
// Parameters
let streams = [
	"btcusdt@trade", "btceur@trade",
	"ethusdt@trade", "etheur@trade",
	"dogeusdt@trade", "dogeeur@trade",
	"eurusdt@trade",

	"btcusdt@ticker", "btceur@ticker",
	"ethusdt@ticker", "etheur@ticker",
	"dogeusdt@ticker", "dogeeur@ticker",
];

let trackedStreams = [];
let streamOpen = [];

// Get streams from array
let binanceWS = new WebSocket("wss://stream.binance.com:9443/ws/" + streams.join('/'));

/* // URL for all strams  
let binanceWS = new WebSocket("wss://stream.binance.com:9443/ws/!miniTicker@arr"); // ALL STREAMS
*/

/**
 * Open connection with Binance
 */
binanceWS.onopen = function() {
	console.log("Binance connected...");
};


/**
 * When the websocket gives new information, run it through a parser (parseData)
 * @param {*} evt 
 */
binanceWS.onmessage = function(evt) {
	try {
	let responses = JSON.parse(evt.data);
	if (Array.isArray(responses)) {
		for (let response of responses) {
		parseData(response);
		}
	} else {
		parseData(responses)
	}
	} catch (e) {
		// console.log('Unknown message: ' + evt.data, e);
	}
}


/**
 * Close Connection
 */
binanceWS.onclose = function() {
	console.log("Binance disconnected");
}


/**
 * Turn stream-data into HTML view
 * @param {*} response 
 */
function parseData(response) {	
	if(response.e !== '24hrTicker') {
		
		var stream = response.s;
		
		if (trackedStreams.indexOf(stream) === -1) {
			document.getElementById(stream).innerHTML = '<span id="'+ stream + '" class="stream">' + stream + ':</span> <span id="stream-' + stream + '" class="stream_data"></span><span id="stream-EUR-' + stream + '" class="stream_data"></span>';
			trackedStreams.push(stream);d
			document.getElementById('stream').innerText = trackedStreams.length;
		}

		if(stream.includes("EURUSDT")) {
			document.getElementById('stream-' + stream).innerText = '€ ';
		}else if(stream.includes("USDT")) {
			document.getElementById('stream-' + stream).innerText = '$ ';
		} else if(stream.includes("EUR")) {
			document.getElementById('stream-' + stream).innerText = '€ ';
		} else {
			document.getElementById('stream-' + stream).innerText = '';	
		}
		
		document.getElementById('stream-' + stream).innerText += response.p;
		var EURUSDT = document.getElementById('EURUSDT').children[1].innerText;
		dollarToEuroPrice = response.p / EURUSDT.replace('€','');
		dollarToEuroPrice = parseFloat(dollarToEuroPrice).toFixed(5);

		// Check what the europrice is of the coin (when available)
		if(stream.includes("EURUSDT") && EURUSDT !== '') {
			let dollarPrice = parseFloat(response.p);
			euroPrice = dollarPrice / EURUSDT.replace('€','');
			document.getElementById('stream-EUR-' + stream).innerText = ' | $ ' + dollarToEuroPrice;
		} else if(stream.includes("USDT") && EURUSDT !== '') {
			let dollarPrice = parseFloat(response.p);
			document.getElementById('stream-EUR-' + stream).innerText = ' | € ' + dollarToEuroPrice
		} else if(stream.includes("EUR") && EURUSDT !== '') {
			let euroPrice = parseFloat(response.p);
			document.getElementById('stream-EUR-' + stream).innerText = ' | € ' + euroPrice;
		}

	} else {
		var streamOpen = response.o;
		var stream = response.s;
		
		if(stream.includes('EUR')) {
			valuta = ' € ';
		} else {
			valuta = ' $ ';
		};

		document.getElementById(stream + 'OPEN').innerText = valuta + ' ' + streamOpen;

		var EURUSDT = document.getElementById('EURUSDT').children[1].innerText;
		dollarToEuroPrice = streamOpen / EURUSDT.replace('€','');
		dollarToEuroPrice = parseFloat(dollarToEuroPrice).toFixed(5);

		if(stream.includes('EUR')) {
			var price = document.getElementById(stream + 'OPEN').innerText += ' | € ' + streamOpen;
		} else {
			var price = document.getElementById(stream + 'OPEN').innerText += ' | € ' + dollarToEuroPrice;
		}

		document.getElementById(stream + 'OPEN').innerHTML = '<span id="'+ stream + '" class="stream strong">' + stream + ' OPEN:</span>' ;
		document.getElementById(stream + 'OPEN').innerHTML += '<span> ' + price + '</span>';
	}

}


const showStream = async(element) => {
	
	streams_divs = document.getElementsByClassName('streams')
	Array.prototype.forEach.call(streams_divs, function(el, index, array){
		var classList = document.getElementById(el.id).classList;
		
		if(classList.value.includes('active')){
			document.getElementById(el.id).classList = 'streams';
		}
	});

	document.getElementById(element).classList = 'streams active';
}
