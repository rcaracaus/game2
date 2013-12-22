c = document.getElementById("pane");
ctx = c.getContext("2d");
w = 50;
x = 0;
var mouseX;
var mouseY;
var refreshIntervalId;
mouseDetect();


start = function () {
	clearInterval(refreshIntervalId);
	x = 0;
	y = 0;
	vy = .25;
	vx = .25;
	refreshIntervalId = setInterval(animate, 10);
}

animate = function() {
    if (x + w < c.width && y + w < c.height) {
		x += vx;
		y += vy;
	}
	ctx.clearRect(0, 0, c.width, c.height);
	drawtarget();
	drawTarget();
	ontargetSkin();
}

drawtarget = function() {
	ctx.strokeRect(x, y, w, w);
}

drawTarget = function() {
	ctx.strokeRect(c.width-w, c.height-w, w, w);
}

function addPoints(points) {
    localStorage.setItem('points', points);
}

function getPoints() {
    return localStorage.getItem('points');
}


$('canvas').click( function() {
	if (ontarget()) {
		vy += 0.5;
	}
});

function ontarget() {
    if ((mouseX >= x && mouseX <= x + w) 
    	&& (mouseY >= y && mouseY <= y + w)) {
		return true;
	} else { 
		return false; 
	}
}

function ontargetSkin() {
	if (ontarget()) {
	  if (c.style.cursor != 'pointer') c.style.cursor = 'pointer';
	} else {
	  if (c.style.cursor != 'auto') c.style.cursor = 'auto';
	}
}










