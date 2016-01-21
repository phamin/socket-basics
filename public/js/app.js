var socket = io();

socket.on('connect', function () {
	console.log('Connected to socket.io server!');
});

socket.on('message', function (message) {
	console.log('New message: ');
	console.log(message.text);
});

// Handles submitting of new message. Put # to select an ID
var $form = jQuery('#message-form');

// When the user clicks on submit. 'Submit' is a browser built in method.

$form.on('submit', function (event) {
	event.preventDefault();

	var $message = $form.find('input[name=message]')

	// send the message to the server

	socket.emit('message', {
		text: $message.val()
	})

	// Delete the message in the input field

	$message.val('');
	
});