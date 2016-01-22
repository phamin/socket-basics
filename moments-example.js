var moment = require('moment');
var now = moment();

// console.log(now.format());
// now.subtract(1, 'year');
// console.log(now.format());
// console.log(now.format('MMM Do YYYY, h:mma'));

var timestamp = 1444444;
var timestamp = moment.utc(timestamp);

console.log(timestamp.local().format('h:mm a'));



