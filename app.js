/*
	Simple Node.js application that takes POSTed JSON objects, filters 
	them, and then responds with the filtered data.
	Uses the Express.js framework, and some functionality from 
	Underscore.js

	Author: Luke Mitchell
	Email: veypor@veypor.net
	Github: https://github.com/auVeypor
	LinkedIn: https://www.linkedin.com/in/auVeypor/
	Last Updated: 2017/03/01
	Comments: Developed for the Nine Digital Coding Challenge.
*/

/*
	Importing Libraries
*/
var express = require("express")
var app = express();
var bodyParser = require("body-parser");
var http = require("http");
var fs = require("fs");
var _ = require("underscore");

/*
	Application setup of port and parsers. DO NOT move the body parsers
	further fown, or develop above this point, bodyParser is very
	temperamental in regards to where it has to be declared.
*/
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
})); 

/*
	Handler for POSTed data.
	WORK IN PROGRESS

	In deployment, req.body will be used to hand off to evaluateJsonData.
	However, for ease of testing, the payload will be, so I can just paste 
	in the provided test case verbatim without worrying about transforming
	it.
*/
app.post('/test', function(req, res) {
	var payload = req.body.payload;
	//var rawJson = req.body;
	//console.log(payload);
	evaluateJsonData(payload, res);
	//console.log(req.body);
	res.end();
});

/*
	Display for a simple HTML page, used for testing puropses.
	Review/Deprecation will be required for final submission.
*/
function displayForm(res) {
	fs.readFile('index.html', function (err, data) {
		res.writeHead(200, {
			'Content-Type': 'text/html',
				'Content-Length': data.length
		});
		res.write(data);
		res.end();
	});
}

/*
	Core business logic for the application.
	As to spec, the POSTed JSON is parsed, filtered and returned, 
	transmitting the shows that are DRM enabled and have one or more 
	episodes.
	WORK IN PROGRESS
*/
function evaluateJsonData(rawJson, res) {
	var responseString = "";
	var parsedJson = JSON.parse(rawJson);
	var filtered = _.where(parsedJson, {drm: true});	
	
	/*
		where() and filter() both share the same purpose here, to 
		locate the desired fields in the POSTed JSON. 
		However filter() is needed below as we are searching for a set 
		that is continuous (episodeCount > 0) whereas where() only takes 
		discrete search criteria. where() is more efficient, as such,
		it goes first.
	*/

	filtered = _.filter(filtered, function(n) {
		return n.episodeCount > 0;
	});

	for (var i = 0; i < filtered.length; i++) {
		responseString += filtered[i].image.showImage;
		responseString += "<br>";
		responseString += filtered[i].slug;
		responseString += "<br>";
		responseString += filtered[i].title;
		responseString += "<br>";
		responseString += "<br>";
	}

	res.send(responseString);
}

/*
	Access point used for frontend testing page..
	Review/Deprecation will be required for final submission.
*/
app.get('/', function(req, res) {
	displayForm(res);
});

/*
	Setup of the HTTP server and binding to port.
*/
http.createServer(app).listen(app.get('port'), function(){
	console.log("Listening on port " + app.get('port'));
});

