var c = document.getElementById("pane");
var width = c.width;
var height = c.height;

var ctx = c.getContext("2d");

var ball = new Object();

ball.w = 50;
ball.x = 0;
ball.y = 0;
ball.vy = 1;
ball.vx = 1;

var px, py, cmTID;

document.addEventListener('click', onMouseClick, false);

function onMouseClick(event) {
	px = event.pageX;
	py = event.pageY;
}

function reset() {
	ball.x = 0;
	ball.y = 0;
	ball.vx = 1;
	ball.vy = 1;
	animate();
}

function animate() {

	if (ball.x + ball.w < width && ball.y + ball.w < height) {

		ctx.clearRect(0, 0, width, height);
		ctx.strokeStyle = "#FF0000";
		ctx.strokeRect(ball.x, ball.y, ball.w, ball.w);

		ball.x += ball.vx;
		ball.y += ball.vy;

		clearTimeout(cmTID);
		cmTID = setTimeout(animate, 50);

	}

	var mouseX = px - c.getBoundingClientRect().left;
	var mouseY = py - c.getBoundingClientRect().top;

	if ((mouseX >= ball.x && mouseX <= ball.x + ball.w) && (mouseY >= ball.y && mouseY <= ball.y + ball.w)) {
		ball.vy += 0.5;
	}

	console.log("x: " + mouseX + " y: " + mouseY);

}

