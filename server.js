/* 

Fox Peterson

03-05-2016

working towards socket-based video annotations
socket io simple chat application

*/
'use strict';

// the application's name is 'app'; the server's name is 'http', the socket io module is named 'io'
var fs = require('fs');
var path = require('path');
var express = require('express');
var http = require('http');
var os = require('os');

// declare app object separately
var app = express();

/* local configurations 
- port is 9100, 
- static path is set to the main folder
- app is told to use that folder for finding files
- os.hostname is your computer's name, like 'macbookpro-fox'.
*/

var hostname = os.hostname;

var staticPath = path.resolve(__dirname,'');
app.use(express.static(staticPath));

// set the port and also set it as an env variable
app.set('port',9100);
app.set('httpPort', process.env.PORT || 9100);


// remove HTML headers from old versions of browsers
app.disable('x-powered-by');


// set up your server - the http module creates a server which is listening on the httpPort environment variable
var server = http.createServer(app).listen(app.get('httpPort'), function(){
  console.log("WOULD YOU LIKE TO PLAY A GAME?");
});

// require socket io to listen on the port configured for the server
var io = require('socket.io').listen(server);

app.get('/', function(req, res){
	// when the client comes looking for the blank endpath with an http request that fits req, return a response that fits res
	res.sendFile(__dirname + '/client.html')
});

io.on('connection', function(socket){
	console.log("A pikachu appeared in the tall grass!");

	socket.on('chat message', function(msg){
    	io.emit('chat message', msg);
  	});

	socket.on('disconnect', function(){
		console.log('It disappeared!');
	});
});