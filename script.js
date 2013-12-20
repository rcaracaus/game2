var c = document.getElementById("pane");
var width = c.width;
var height = c.height;

var ctx = c.getContext("2d");

var ball = new Object();



var mouseX, mouseY, cmTID;

function cursorInBall() {
	if ((mouseX >= ball.x && mouseX <= ball.x + ball.w) && (mouseY >= ball.y && mouseY <= ball.y + ball.w)) {
		return true;
	} else { 
		return false; 
	}
}

function animate() {
	if (ball.x + ball.w < width && ball.y + ball.w < height) {
		ball.x += ball.vx;
		ball.y += ball.vy;
	}
	ctx.clearRect(0, 0, width, height);
	ctx.strokeStyle = "#FF0000";
	ctx.strokeRect(ball.x, ball.y, ball.w, ball.w);
	clearTimeout(cmTID);
	cmTID = setTimeout(animate, 50);
}


function onMouseMove(event) {
	
}


function start() {
	ball.x = 0;
	ball.y = 0;
	ball.vx = 1;
	ball.vy = 1;
	ball.w = 50;
	ball.click = false;
	animate();
}


$(document).mousemove(function(event) {
    mouseX = event.pageX - c.getBoundingClientRect().left;
    mouseY = event.pageY - c.getBoundingClientRect().top;
    console.log(ball.x + '-' + mouseX);
    if (cursorInBall()) {
	  $('canvas').css('cursor', 'pointer');
	} else {
	  $('canvas').css('cursor', 'auto');
	}
 });

$(document).ready(function () {

	$('canvas').click( function() {
		if (cursorInBall()) {
			ball.vy += 0.5;
		}
	});

});

