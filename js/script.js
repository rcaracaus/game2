$(document).ready(function () {

	$('#getHighScores').click(function() {
        getHighScores();
	});

    $('.saveHighScore').click(function() {
        saveHighScore();
    });

    $( "#start" ).submit(function( event ) {
        name = document.getElementById("input-name").value;

        localStorage.setItem('name', name);
        init();
        event.preventDefault();
    });

    $( ".addNewPlayer" ).click(function(e) {
        domElements.classify('players', 'toilet1');
        e.preventDefault();
    });

});



