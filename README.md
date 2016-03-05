Simple Socket IO templates and fun
========


1. Make a new directory. Let's call it socketio1.

		mkdir socketio1
		cd socketio1

2. Set up git infrastructure

		git init
		touch .gitignore
		touch README.md


3. Set up node infrastructure

		npm init

4. Do all the steps of saying yes to the NPM infrastructure.


5. Open package.json and modify it if you want.

6. Install Express. It's best to fix the Express version if you're using 4 and up.

		npm install --save express@4.10.2


7. Create your server

		touch server.js

8. Create your client

		touch client.html

9. Open up server.js. Type  in some simple requirements for getting and serving. app is your express framework. when the framework receives a "GET" type request, it responds with the response in res.send (in this case, a heading that says "Enlighted is the cool."). The http server in this case is listening on port 9100 (You can use almost any high-number, non-reserved port, although the default for Node stuff is normally 3000). When a client connects with the browser to localhost:9100/ and sees "Enlighted is the cool.", the server prints to the console on our side "I am here in the shadows."

		'use strict';

		var app = require('express')();
		var http = require('http').Server(app);

		app.get('/', function(req, res){
			// when the client comes looking for the blank endpath with an http request that fits req, return a response that fits res
			res.send('<h1>Enlighted is the cool.</h1>')
		});

		// listen for responses over port 9100
		http.listen(9100, function(){
			console.log("I am here in the shadows");
		});

10. Open client.html and put in the sample HTML code from socket.io's webpage.

		<!doctype html>
		<html>
		  <head>
		    <title>Socket.IO chat</title>
		    <style>
		      * { 
		        margin: 10; 
		        padding: 10; 
		        max-width: 960;
		        box-sizing: border-box; 
		      }
		      body { 
		        font: 13px 'Trebuchet MS'; 
		      }
		      form { 
		        background: #000; 
		        padding: 3px; 
		        position: fixed; 
		        bottom: 0; 
		        width: 100%; 
		      }
		      form input { 
		        border: 0; 
		        padding: 10px; 
		        width: 90%; 
		        margin-right: .5%; 
		      }
		      form button { 
		        width: 9%; 
		        background: rgb(130, 224, 255); 
		        border: none; 
		        padding: 10px; 
		      }
		      #messages { 
		        list-style-type: none; 
		        margin: 0; 
		        padding: 0; }
		      #messages li { 
		        padding: 5px 10px; 
		      }
		      #messages li:nth-child(odd) { 
		        background: #eee; 
		      }
		    </style>
		  </head>
		  <body>
		    <ul id="messages"></ul>
		    <form action="">
		      <input id="m" autocomplete="off" /><button>Send</button>
		    </form>
		  </body>
		</html>


11. Fix server.js to send the file in client.html as a response to any request (remember a request is just going to localhost:9100). The double-underscore "__dirname" means that it is refering to the DIRectory you are currently in. It's a default. Don't mess with it.

		'use strict';

		var app = require('express')();
		var http = require('http').Server(app);

		app.get('/', function(req, res){
			// when the client comes looking for the blank endpath with an http request that fits req, return a response that fits res
			res.sendFile(__dirname + '/client.html')
		});

		// listen for responses over port 9100
		http.listen(9100, function(){
			console.log("I am here in the shadows");
		});

12. Press CTRL + C to stop the server. Mount socket.io in Node by installing it via NPM:

		npm install --save socket.io

13. We need for both server and client to have sockets. Open server.js. Add to it the io object as shown here. The instance of socket.io bridges between the server ('http') to the client, listening for incoming connections. 

		'use strict';

		// the application's name is 'app'; the server's name is 'http', the socket io module is named 'io'
		var app = require('express')();
		var http = require('http').Server(app);
		var io = require('socket.io')(http);

		app.get('/', function(req, res){
			// when the client comes looking for the blank endpath with an http request that fits req, return a response that fits res
			res.sendFile(__dirname + '/client.html')
		});

		io.on('connection', function(socket){
			console.log("A pikachu appeared in the tall grass!")
		});

		// listen for responses over port 9100
		http.listen(9100, function(){
			console.log("I am here in the shadows");
		});

14. Let's refactor because this will get out of hand. Let's go ahead and bring in some new code to server.js. Let's set the port so we can keep it clear and let's set some paths on our server for accessing files and data. We'll also tell the socket we want it to listen specifically to the port served by the server.

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
			socket.on('disconnect', function(){
				console.log('It disappeared!');
			});
		});

15. Of course, we also need to teach the client what to do. Open client.html and just before the </body> tag, add

		<script>
      		var socket = io.connect('http://localhost:9100');
    	</script>

16. Still in client.html, add to the headers

		<script src="/node_modules/socket.io-client/socket.io.js"></script>


17. Exit client.html and press CTRL + C to stop the server if you haven't already. check that indeed the file socket.io.js is in the path written above. Additionally, in server.js, look at the static path, and make sure that if you added the static path to that client's path for socket.io.js, you would get the full path to that file.


18. Now to be less boring, go back to client.html and we enable the chat. First, get the jquery minimized file from a cdn (content distribution site) that allows the chat box to be manipulated by user events. Add that reference (source) to the head right below the reference from 16.

		<script src="https://code.jquery.com/jquery-2.2.1.min.js"></script>


19. Now, still in client.html, change the script section to say:

	<script>
      var socket = io.connect('http://localhost:9100');

      $('form').submit(function(){
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
      });
      
    </script>

20. So the client can send a message and the server needs to receive it. Open server.js and add a function called "socket.on" into the io.on section. When the socket is available, we want to respond to different events. 

		io.on('connection', function(socket){
			console.log("A pikachu appeared in the tall grass!");

			socket.on('chat message', function(msg){
		    	console.log('pika?... ' + msg);
		  	});


			socket.on('disconnect', function(){
				console.log('It disappeared!');
			});
		});

21. All connected users need to see the chat, so we need to use the server to emit back to the client(s) their own messages. Don't go too far from server.js just yet. In that same place you added the socket.on, change the console.log part to:

		socket.on('chat message', function(msg){
		    	io.emit('chat message', msg);
		  	});

io.emit shares with everyone, including the server! Now in client.html, between the script tags, make it so you have:

		var socket = io.connect('http://localhost:9100');

	      // when the form is submitted, the socket sends out the message (the value of id'ed element m)
	      
	      $('form').submit(function(){
	        socket.emit('chat message', $('#m').val());
	        
	        // if there's nothing in "m", then return a false
	        $('#m').val('');
	          return false;
	        });

	        //if a chat message is received, append it to your (each browser instance) list of message
	        socket.on('chat message', function(msg){
	          console.log('huh?')
	        $('#messages').append($('<li>').text(msg));
	    });


Remember that Javascript doesn't care about whitespace.