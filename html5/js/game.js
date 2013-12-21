var refreshIntervalId;
targetArray = new Array();
w = 100;

for (var i = 0; i < 5; i++) {
	element = 'player-' + i;
	var playerDiv = document.createElement( 'div' );
	playerDiv.className = 'player';
	playerDiv.id = element;
	document.body.appendChild(playerDiv);
}

function fall(i, x, y, vy) {
    
    if (x + w < $(window).width() && y + w < $(window).height()) {
    	y += vy;
    	console.log(vy);
	}

	element = 'player-' + i;
	document.getElementById(element).style.top = y + "px";
	document.getElementById(element).style.left = x + "px";
	document.getElementById(element).style.width = w + "px";
	document.getElementById(element).style.height = w + "px";
	document.getElementById(element).style.background = "red";

}

function startFall() {

	clearInterval(refreshIntervalId);

	for (var i = 0; i < 5; i++) {
		targetArray[i] = new Object();	
		targetArray[i].x = i * 100;
		targetArray[i].y = 0;
		targetArray[i].vy = Math.random() + 0.5;
		
	}

	refreshIntervalId = setInterval(function() {
		for (var i = 0; i < 5; i++) {
			if (
				targetArray[i].x + w < $(window).width()
				&& targetArray[i].y + w < $(window).height() + w // Add width to hide targets
			) {
    			targetArray[i].y += targetArray[i].vy;
    			console.log(targetArray[i].y);
			}
			fall(i, targetArray[i].x, targetArray[i].y, targetArray[i].vy);
		}
	}, 10);
}




