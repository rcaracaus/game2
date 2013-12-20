var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var x = 0;
var y = 0;
var w = 50;

var width = c.width;
var height = c.height;

var cmTID;

function animate() {

	if (x + w < width && y + w < height) {

		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = "#FF0000";
		ctx.strokeRect(x, y, w, w);

		x++;
		y++;

		clearTimeout(cmTID);
		cmTID = setTimeout(animate, 50);
		
	}

}

animate();
