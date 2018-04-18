



const EventEmitter = require('events');
const myEmitter = new EventEmitter();
var floor = 0;
var dir = 'up';
var user = 0;


myEmitter.on('down', function(){
	floor--; 
	console.log(floor);
})


myEmitter.on('up', function(){
	floor++; 
	console.log(floor);
})

let people = [{ name: 'Jerry', destination:4 }, { name: 'Kramer', destination: 10 }, { name: 'Newman', destination: 2 }]
  
setInterval (function() {
	let dest = people[user].destination;
	if (floor == 0) {
		dir = "up"
	} else if (floor == dest){
		console.log("Please get out, it's your floor");
		console.log(floor);
		dir = "down";
		user++;
	} myEmitter.emit(dir);	
}, 1000);




// when the elevator gets to the 10th floor switch the direction from up to down
// when the elevator gets to the zero floow switch the direction 
// every time gets to a new floor, console log the floor

