var PORT = process.env.PORT || 3000;
var moment = require('moment');
var express = require('express');
var app = express();

// Tells Node to start a new server and to use the Express app as the boilerplate (standard).
// Anything the Express app listens to, the server should also listen too.

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

// Sends current users to provided users

function sendCurrentUsers(socket) {
	var info = clientInfo[socket.id];
	var users = [];

	if (typeof info === 'undefined') {
		return;
	}

	Object.keys(clientInfo).forEach(function (socketId) {
		var userInfo = clientInfo[socketId];
		if (info.room === userInfo.room) {
			users.push(userInfo.name);
		}
	})

	socket.emit('message', {
		name: 'System',
		text: 'Current users: ' + users.join(', '),
		timestamp: moment().valueOf()
	})
}

io.on('connection', function(socket) {
	console.log('User connected via socket.io!');

	socket.on('disconnect', function() {

		var userData = clientInfo[socket.id];

		if (typeof userData !== 'undefined') {
			socket.leave(userData.room);

			io.to(userData.room).emit('message', {
				name: 'System',
				text: userData.name + ' has left',
				timestamp: moment().valueOf()
			});

			delete clientInfo[socket.id];
		}
	});

	socket.on('joinRoom', function(req) {
		clientInfo[socket.id] = req;

		// Socket.join adds a socket to a specific room. When I emit a joinRoom event from the client, in the server I get added to the room.
		socket.join(req.room)

		// Emits a message to everyone in the room that a new person joins. to() lets us specify the specific room to send the message to.
		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: req.name + ' has joined!',
			timestamp: moment().valueOf()
		})
	});

	socket.on('message', function(message) {
		console.log('Message received: ' + message.text);

		if (message.text === '@currentUsers') {
			sendCurrentUsers(socket);
		} else {
			message.timestamp = moment().valueOf();
			// Only emits the message to people who are in the same room as the current user
			io.to(clientInfo[socket.id].room).emit('message', message);
			// Socket.broadcast emits the message to everybody but the current socket (except the sender)
		}

	})

	// timestamp property - Javascript timestamp (milliseconds)

	socket.emit('message', {
		name: 'System',
		text: 'Welcome to the chat application!',
		timestamp: moment().valueOf()
	});
});

// Starts the server

http.listen(PORT, function() {
	console.log('Server started');
});