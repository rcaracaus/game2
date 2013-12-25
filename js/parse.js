Parse.initialize("Wzt7lQJYvLRdYBc9D1C2ARbUFEUEd4N8eNP4e1rP", "iX28bQkGJqMq3pa8qDl3xkKDdHcaoQnLvl36BQEf");


function saveHighScore() {

    var name = localStorage.getItem('name');
    var highScore = localStorage.getItem('highScore');


    var GameScore = Parse.Object.extend("GameScore");
    var gameScore = new GameScore();

    gameScore.set("score", highScore);
    gameScore.set("playerName", name);

    gameScore.save(null, {
        success: function(gameScore) {
            // Execute any logic that should take place after the object is saved.
            alert('New object created with objectId: ' + gameScore.id);
        },
        error: function(gameScore, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and description.
            alert('Failed to create new object, with error code: ' + error.description);
        }
    });

}


function getHighScores() {
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



