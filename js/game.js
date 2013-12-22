var refreshIntervalId;
targetArray = new Array();
w = 100;
itemsCreated = 0;
wave = 0;


function createTargets(amount) {
	for (var i = 0; i < amount; i++) {
		targetRowClass = 'target-row-' + i;
		targetWaveClass = 'target-wave-' + wave;
		targetIdClass = 'target-' + itemsCreated;
		var targetDiv = document.createElement( 'div' );
		targetDiv.className = 'target poo1' + ' ' + targetRowClass + ' ' + targetIdClass+ ' ' + targetWaveClass;
		document.body.appendChild(targetDiv);
		itemsCreated++;
	}
	wave++;
}


function fall(i, x, y, vy) {
    if (x + w < $(window).width() && y + w < $(window).height()) {
    	y += vy;
	}
	targetRowClass = 'target-row-' + i;
	targetWaveClass = 'target-wave-' + i;
	var elems = document.getElementsByClassName(targetRowClass);
	for(var i = 0; i < elems.length; i++) {
    	elems[i].style.size = '100px';
	    elems[i].style.top = y + "px";
		elems[i].style.left = x + "px";
		elems[i].style.width = w + "px";
		elems[i].style.height = w + "px";
	}
	var elems = document.getElementsByClassName(targetWaveClass);
	for(var i = 0; i < elems.length; i++) {
	    elems[i].style.top = (y - 100) + "px";
	}
}

function startFall() {
	clearInterval(refreshIntervalId);
	for (var i = 0; i < 5; i++) {
		targetArray[i] = new Object();	
		targetArray[i].x = i * 100;
		targetArray[i].y = 0;
		targetArray[i].vy = Math.random() + 0.5;
	}

	createTargets(5);

	refreshIntervalId = setInterval(function() {
		for (var i = 0; i < 5; i++) {
			if (
				targetArray[i].x + w < $(window).width()
				&& targetArray[i].y + w < $(window).height() + w // Add width to hide targets
			) {
    			targetArray[i].y += targetArray[i].vy;
			}
			fall(i, targetArray[i].x, targetArray[i].y, targetArray[i].vy);
		}
	}, 10);
}


function noop() {};

