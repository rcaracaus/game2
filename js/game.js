/* Global Vars */
var refreshIntervalId;

targets = 10;
targetArray = new Array();
players = 2;
playerArray = new Array();
fps = 60;
playersCreated = 0;
playerSelected = false;
resetRan = false;
window.points = 0;

function init() {

    startTimer();

    // Better performance to set variables once?
    windowHeight = $(window).height();
    windowWidth = $(window).width();
    w = windowWidth / 30;

    clearInterval(refreshIntervalId);
    createTargets(targets);
    createPlayers(players);

    // Target's position should reset on init.
    reset();
    setKeys();
    
    // Start animation
    animateTargets();
    animatePlayers();
}

function animateTargets() {
    refreshIntervalId = setInterval(function() {

        targetArray.forEach( function(element, i) {
            animateFallTargets(element, i);
            // Prompt each target to fall separately.
            targetMove(i, targetArray[i].x, targetArray[i].y, targetArray[i].vy);
        });

    }, 1000/fps);
}

function animatePlayers() {
    refreshIntervalId = setInterval(function() {
        playerArray.forEach( function(element, i) {
            playerMove(i, playerArray[i].x, playerArray[i].y, playerArray[i].vy);
        });
    });
}


function reset() {
    setLocalHighScore();
    resetScore();
    startTimer();
    resetTargetPosition(targets);
    resetPlayerPosition(players);
}

function createTargets(amount) {
	for (var i = 0; i < amount; i++) {
		targetRowClass = 'target-row-' + i;
		targetId = 'target-' + i;
		var targetDiv = document.createElement( 'div' );
		targetDiv.className = 'target poo1' + ' ' + targetRowClass;
        targetDiv.id = targetId;
		document.body.appendChild(targetDiv);
	}
}

function targetMove(i, x, y, vy) {

    if (x + w < windowWidth && y + w < windowHeight) {
        y += vy;
    }
    targetRowClass = 'target-row-' + i;
    var elems = document.getElementsByClassName(targetRowClass);
    for(var i = 0; i < elems.length; i++) {
        elems[i].style.size = '100px';
        elems[i].style.top = y + "px";
        elems[i].style.left = x + "px";
        elems[i].style.width = w + "px";
        elems[i].style.height = w + "px";
    }
    /*
     var elems = document.getElementsByClassName(targetWaveClass);
     for(var i = 0; i < elems.length; i++) {
     elems[i].style.top = (y - 100) + "px";
     }
     */
}

function resetTargetPosition(amount) {
    // Reset each target's position on each init.
    for (var i = 0; i < amount; i++) {
        targetArray[i] = new Object();
        targetArray[i].id = i;
        targetArray[i].x = Math.floor(Math.random() * (windowWidth - w));
        targetArray[i].y = 0 - w;
        targetArray[i].width = w;
        targetArray[i].height = w;
        targetArray[i].vy = Math.random() + 0.5;
        targetArray[i].isAlive = true;
        targetArray[i].lowestY = false;
    }


     var elems = document.getElementsByClassName('target');
     for(var i = 0; i < elems.length; i++) {
        elems[i].style.display = "block";
     }

}


function createPlayers(amount) {
    for (var i = 0; i < amount; i++) {
        playerIdClass = 'player-' + playersCreated;
        var playerDiv = document.createElement( 'div' );
        playerDiv.className = 'player' + ' ' + playerIdClass;
        document.body.appendChild(playerDiv);
        playersCreated++;
    }
}

function playerMove(i, x, y, vy) {
    playerIdClass = 'player-' + i;
    var elems = document.getElementsByClassName(playerIdClass);
    for(var i = 0; i < elems.length; i++) {
        elems[i].style.size = '100px';
        elems[i].style.top = y + "px";
        elems[i].style.left = x + "px";
        elems[i].style.width = w + "px";
        elems[i].style.height = w + "px";
    }

    /*
     var elems = document.getElementsByClassName(targetWaveClass);
     for(var i = 0; i < elems.length; i++) {
     elems[i].style.top = (y - 100) + "px";
     }
     */
}


function resetPlayerPosition(amount) {
    // Reset each player's position on each init.
    for (var i = 0; i < amount; i++) {
        playerArray[i] = new Object();
        playerArray[i].x = i * 100;
        playerArray[i].y = windowHeight - w;
        playerArray[i].width = w;
        playerArray[i].height = w;
        playerArray[i].selected = false;
    }
}

function animateFallTargets(element, i) {

    var elems = document.getElementsByClassName('target');

    if (element.x + w < $(window).width() && element.y + w < $(window).height() + w) {
        element.y += element.vy;
    }

    if (element.y > windowHeight) {
        elems[i].style.display = "block";
        element.isAlive = true;
        element.x = Math.floor(Math.random() * (windowWidth - w));
        element.y = 0 - w;
    }

    playerArray.forEach(function(player) {
        if(intersects(player, element) && element.isAlive) {
            window.points++;
            document.getElementById("points").innerHTML = window.points;
            element.isAlive = false;

            var elem = document.getElementById('target-' + element.id);
            elem.style.display = "none";
        }
    });
}



function setKeys(element, i) {

    $.fastKey('39', function() {
        for (var i = 0; i < playerArray.length; i++) {
            if(playerArray[i].selected) {
                playerArray[i].x += 2;
            }
        }
    });

    $.fastKey('37', function() {
        for (var i = 0; i < playerArray.length; i++) {
            if(playerArray[i].selected) {
                playerArray[i].x -= 2;
            }
        }
    });

    selectedPlayer();

}

function selectedPlayer() {

    playerArray[0].selected = true;
    $('.player-0').addClass('active');

    document.body.onkeydown = function(event){
        event = event || window.event;
        var keycode = event.charCode || event.keyCode;
        if(keycode === 9){
            event.preventDefault();
            playerSelected = !playerSelected;
            if (playerSelected) { playerArray[0].selected = true; playerArray[1].selected = false; }
            else { playerArray[1].selected = true; playerArray[0].selected = false; }
            loop(playerArray, function(i) {
                if (playerArray[i].selected) {
                    $('.player-' + i).addClass('active');
                } else {
                    $('.player-' + i).removeClass('active');
                }
            });
        }
    }

}

function intersects(player, target) {
    return (player.x <=  target.x + target.width &&
        target.x <=  player.x + player.width &&
        player.y <= target.y + target.height &&
        target.y <= player.y + player.height);
}

function startTimer() {
    var count=60;
    var counter=setInterval(timer, 1000); //1000 will  run it every 1 second
    function timer(){
        count=count-1;
        if (count <= 0)
        {
            clearInterval(counter);
            setLocalHighScore();
            resetScore();
            startTimer();
            return;
        }

        $(".timer").text(count);
    }
}


function setLocalHighScore() {
    if(!localStorage.getItem('highScore')) {
        localStorage.setItem('highScore', window.points);
    } else if ( window.points > localStorage.getItem('highScore')) {
        localStorage.setItem('highScore', window.points);
    }
    $( ".yourHighScore" ).text(function() {
        return localStorage.getItem('highScore');
    });
}

function resetScore() {
  window.points = 0;
}

function loop(array, callback) {
    for (var i = 0; i < array.length; i++) {
        callback(i);
    }
}
