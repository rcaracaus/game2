x = 0;
y = 0;
vx = 1;
vy = 1;
click = false;
w = 50;

start = function () {
	x = 0;
	y = 0;
	c = document.getElementById("pane");
	ctx = c.getContext("2d");
	detectMouse();
	return setInterval(animate, 10);
}

drawTarget = function () {
	ctx.strokeRect(x, y, w, w);
}

onTarget = function () {
    if (
    	(mouseX >= x && mouseX <= x + w) 
    	&& (mouseY >= y && mouseY <= y + w)) {
		return true;
	} else { 
		return false; 
	}
}

animate = function () {
    if (x + w < c.width && y + w < c.height) {
		x += vx;
		y += vy;
	}
	clear();
	drawTarget();
	ctx.strokeRect(x, y, w, w);
}

function clear() {
  ctx.clearRect(0, 0, c.width, c.height);
}

detectMouse = function() {
	c.addEventListener("mousemove", function (){
		
		 var x = new Number();
	     var y = new Number();

		if (event.x != undefined && event.y != undefined)
	    {
	      x = event.x;
	      y = event.y;
	    }
	    else // Firefox method to get the position
	    {
	      x = event.clientX + document.body.scrollLeft +
	          document.documentElement.scrollLeft;
	      y = event.clientY + document.body.scrollTop +
	          document.documentElement.scrollTop;
	    }

	    x -= c.offsetLeft;
	    y -= c.offsetTop;

	    mouseX = x;
	    mouseY = y;

	    if (onTarget()) {
		  c.style.cursor = 'pointer';
		} else {
		  c.style.cursor = 'auto';
		}

	}, false);
}

function addPoints(points) {
    localStorage.setItem('points', points);
}

function getPoints() {
    return localStorage.getItem('points');
}



