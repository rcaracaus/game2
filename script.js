$(document).ready(function () {
	$('canvas').click( function() {
		if (onTarget()) {
			vy += 0.5;
		}
	});

	$('button').click( function() {
		start()
	});

	$('.points').text(getPoints());

});

