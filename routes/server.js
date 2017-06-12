var connect = require('connect');
var request = require('request');
var serveStatic = require('serve-static');

/*              .
                |
             .-"^"-.
            /_....._\
        .-"`         `"-.
       (  ooo  ooo  ooo  )
        '-.,_________,.-'
            /       \
          _/         \_
         `"`         `"`    */


// var googleMapsServer = connect().use(serveStatic(__dirname)).listen(8000, function(){
// connect().use(serveStatic(__dirname)).listen(8000, function(){});

	////// API KEYS //////
 
	const apiKey = "AIzaSyCw-7myXeFy8Cgkj5rEaeHH0jmFl4qokN8";
	const mapApiKey = "AIzaSyBNq7VB2xLpcXxs5L81XXZHgzeY_E22dX8";



	////// DIRECTIONS API REQUEST - Variables ///////

	const directionsApiBaseUrl = 'https://maps.googleapis.com/maps/api/directions/';

	// Make sure the origin and destination format is correct, else send an error message. 

	// var originInput = "3406+Woodshire+Crossing+Marietta+GA";
	// var destinationInput = "3930+Shallowford+Road+Marietta+GA";
	var originInput;
	var destinationInput;
	var outputFormat = 'json';
	var mode = 'bicycling';
	var alternatives = 'true';

	const directionsUrl = `${directionsApiBaseUrl}${outputFormat}?origin=${originInput}&destination=${destinationInput}&mode=${mode}&alternatives=${alternatives}&key=${apiKey}`

	console.log("=======================================")
	console.log("--- Directions API Request URL ---")
	console.log(directionsUrl);
	console.log("=======================================")
	////// FUNCTION - Elevation API Request //////

	getElevation = function(encodedPolyline) {

		const elevationApiBaseUrl = "https://maps.googleapis.com/maps/api/elevation/";

		// Later, see if you can figure out how to pass an array of paths. Also adjust the sample rate if needed as well.

		var path = encodedPolyline
		var samples = 128;

		const elevationUrl =`${elevationApiBaseUrl}${outputFormat}?path=enc:${path}&samples=${samples}&key=${apiKey}`

		console.log("=======================================");
		console.log("--- Elevation URL ---");
		console.log("=======================================");
		console.log(elevationUrl);

		request.get(elevationUrl,(error,response,elevationData)=>{
			elevationData = JSON.parse(elevationData);
			console.log("=======================================");
			console.log("--- Elevation Data ---");
			console.log("=======================================");
			console.log(elevationData);
		});

	};



	///////// FUNCTION - Static Map API Request /////////

	drawStaticMap = function (encodedPolyline) {
		const mapApiBaseUrl = "https://maps.googleapis.com/maps/api/staticmap?";

		var size = "320x320";
		var mapType = "terrain";
		var path = encodedPolyline;

		const mapApiUrl = `${mapApiBaseUrl}size=${size}&maptype=${mapType}&path=enc:${path}&key=${mapApiKey}`

		console.log("=======================================");
		console.log("--- Map URL ---");
		console.log("=======================================");
		console.log(mapApiUrl);
		return mapApiUrl;
	};


	//////////// MAIN FUNCTION - API REQUESTS ////////////
var googleMapsServer = {
	getData: function(originInput, destinationInput) {

		////// Directions API Request //////
		const directionsUrl = `${directionsApiBaseUrl}${outputFormat}?origin=${originInput}&destination=${destinationInput}&mode=${mode}&alternatives=${alternatives}&key=${apiKey}`

		request.get(directionsUrl,(error,response,directionsData)=>{
			directionsData = JSON.parse(directionsData);

			encodedPolyline = directionsData.routes[0].overview_polyline.points

			for (let i = 0; i < directionsData.routes.length; i++) {
				console.log(directionsData)
				console.log("=======================================")
				console.log("--- Encoded Polyline Route Summary ---")
				console.log("=======================================")
				console.log(encodedPolyline)
			}

			///// Elevation API Request //////

			getElevation(encodedPolyline);


			///// Static Map API Request //////

			return drawStaticMap(encodedPolyline);
		});
	}
}


	//////////// EXECUTE CODE ////////////

	// getData(originInput,destinationInput);

	//////////////////////////////////////

// });

module.exports = googleMapsServer;