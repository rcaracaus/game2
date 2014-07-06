function saveHighScore() {

    Parse.initialize("Wzt7lQJYvLRdYBc9D1C2ARbUFEUEd4N8eNP4e1rP", "iX28bQkGJqMq3pa8qDl3xkKDdHcaoQnLvl36BQEf");

    $.getScript('/javascripts/contacts.js');

    var name = localStorage.getItem('name');
    var highScore = localStorage.getItem('highScore');


    var GameScore = Parse.Object.extend("GameScore");
    var gameScore = new GameScore();

    gameScore.set("score", highScore);
    gameScore.set("playerName", name);

    gameScore.save(null, {
        success: function(gameScore) {
            // Execute any logic that should take place after the object is saved.
						var playerName = gameScore.attributes.playerName;
						playerName = playerName[0].toUpperCase() + playerName.slice(1);
            alert( 'Thank you ' + playerName + '! Your score of '  + gameScore.attributes.score + ' has been saved.');
        },
        error: function(gameScore, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and description.
            alert('Failed to create new object, with error code: ' + error.description);
        }
    });

}


function getHighScores() {
    Parse.initialize("Wzt7lQJYvLRdYBc9D1C2ARbUFEUEd4N8eNP4e1rP", "iX28bQkGJqMq3pa8qDl3xkKDdHcaoQnLvl36BQEf");
    var GameScore = Parse.Object.extend("GameScore");
    var query = new Parse.Query(GameScore);
    query.descending("score");
    query.find({
        success: function(results) {

            highscoreHtml = "<ul>";
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                highscoreHtml += '<li>' + object.get('playerName') + ' - ' + object.get('score') + '</li>';
            }
            highscoreHtml += "</ul>";

            document.getElementById('scores').innerHTML = highscoreHtml;
        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });

} 




