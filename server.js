var PORT = process.env.PORT || 3000;
var moment = require('moment');
var express = require('express');
var app = express();

// Tells Node to start a new server and to use the Express app as the boilerplate (standard).
// Anything the Express app listens to, the server should also listen too.

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
	console.log('User connected via socket.io!');

	socket.on('message', function (message) {
		console.log('Message received: ' + message.text);

		message.timestamp = moment().valueOf();

		io.emit('message', message);

		// Socket.broadcast emits the message to everybody expect the sender
		// socket.broadcast.emit('message', message);
	})

	// timestamp property - Javascript timestamp (milliseconds)

	socket.emit('message', {
		text: 'Welcome to the chat application!',
		timestamp: moment().valueOf()
	});
});

// Starts the server

http.listen(PORT, function () {
	console.log('Server started');
});