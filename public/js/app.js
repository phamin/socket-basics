var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');;
var socket = io();

console.log(name + ' wants to join ' + room);

jQuery('.room-title').text(room);

// This callback function get fires when the client sucessfully connects to the server
socket.on('connect', function() {
	console.log('Connected to socket.io server!');

	socket.emit('joinRoom', {
		name: name,
		room: room
	});
});

socket.on('message', function (message) {
	var momentTimestamp = moment.utc(message.timestamp);

	// Put . to select all elements who have that class name
	var $messages = jQuery('.messages');
	// Create an element with jQuery
	var $message = jQuery('<li class="list-group-item"></li>');

	console.log('New message: ');
	console.log(message.text);

	// Add two paragraphs to that elements ($message) 
	$message.append('<p><strong>' + message.name + ' ' + momentTimestamp.local().format('h:mm a') + '</strong></p>');
	$message.append('<p>' + message.text + '</p>');

	// Append this new element to website making it visible to the user's browser 
	$messages.append($message);
});

// Handles submitting of new message. Put # to select an ID
var $form = jQuery('#message-form');

// When the user clicks on submit. 'Submit' is a browser built in method.
$form.on('submit', function(event) {
	event.preventDefault();

	var $message = $form.find('input[name=message]')

	// Send a message to the client
	socket.emit('message', {
		name: name,
		text: $message.val()
	})

	// Delete the message in the input field
	$message.val('');

});