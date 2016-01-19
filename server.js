var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();

// Tells Node to start a new server and to use the Express app as the boilerplace (standard).
// Anything the Express app listens to, the server should also listen too.

var http = require('http').Server(app);

app.use(express.static(__dirname + '/public'));

// Starts the server

http.listen(PORT, function () {
	console.log('Server started');
})