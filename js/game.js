/* Global Vars */
var refreshIntervalId;

targets = 10;
targetArray = new Array();
players = 2;
playerArray = new Array();
fps = 60;
playersCreated = 0;
resetRan = false;
window.points = 0;

function init() {

    startTimer();

    // Better performance to set variables once?
    windowHeight = $(window).height();
    windowWidth = $(window).width();
    w = windowWidth / 30;

    clearInterval(refreshIntervalId);
    createElements(targets, "target");
    createElements(players, "player");

    // Target's position should reset on init.
    reset();
    setKeys();
    
    // Start animation

    animate( function() {

        targetArray.forEach( function(element, i) {
            animateFallTargets(element, i);
            // Prompt each target to fall separately.
            elementMove("target", i,  element.x, element.y);
        });

        playerArray.forEach( function(element, i) {
            elementMove("player", i,  element.x, element.y);
        });

        detectCollision();

    });
}

function reset() {
    setLocalHighScore();
    resetScore();
    startTimer();
    resetTargetPosition(targets);
    resetPlayerPosition(players);
}

function createElements(amount, name) {
	for (var i = 0; i < amount; i++) {
		div = document.createElement( 'div' );
        div.id = name + '-' + i;
		div.className = name + ' poo1' + ' ' + div.id + " " + div.rowClass;
        div.style.width = w + "px";
        div.style.height = w + "px";
        div.style.top = -w + "px"; // Positions element offscreen initially
		document.body.appendChild(div);
	}
}

function elementMove(name, i, x, y) {
    var elem = document.getElementById(name + '-' + i);
    elem.style.size = '100px';
    elem.style.top = y + "px";
    elem.style.left = x + "px";
}

function resetTargetPosition(amount) {
    // Reset each target's position on each init.
    for (var i = 0; i < amount; i++) {
        targetArray[i] = {
            id: i,
            x: Math.floor(Math.random() * (windowWidth - w)),
            y: 0 - w,
            width: w,
            height: w,
            vy: Math.random() + 0.5,
            isAlive: true,
            lowestY: false
        }
    }


     var elems = document.getElementsByClassName('target');
     for(var i = 0; i < elems.length; i++) {
        elems[i].style.display = "block";
     }

}

function resetPlayerPosition(amount) {
    // Reset each player's position on each init.
    for (var i = 0; i < amount; i++) {
        playerArray[i] = {
            "x": i *100,
            "y": windowHeight - w,
            "width": w,
            "height": w,
            "selected": true
        }
    }
}

function animateFallTargets(element, i) {

    var elems = document.getElementsByClassName('target');

    if (element.x + w < windowWidth && element.y + w < windowHeight + w) {
        element.y += element.vy;
    }

    if (element.y > windowHeight) {
        elems[i].style.display = "block";
        element.isAlive = true;
        element.x = Math.floor(Math.random() * (windowWidth - w));
        element.y = 0 - w;
    }

}

function setKeys(element, i) {

    $.fastKey('39', function() {
        playerArray.filter(function(item) {
            return item.selected;
        })[0].x += 2;
    });

    $.fastKey('37', function() {
        playerArray.filter(function(item) {
            return item.selected;
        })[0].x -= 2;
    });

    selectedPlayer();

}

function selectedPlayer() {

    var selected;
    playerArray[1].selected = false;
    $('.player-0').addClass('active');

    document.body.onkeydown = function(event){
        event = event || window.event;
        var keycode = event.charCode || event.keyCode;
        if(keycode === 9){
            event.preventDefault();
            playerArray[0].selected = !playerArray[0].selected;
            playerArray[1].selected = !playerArray[1].selected;

            loop(playerArray, function(i) {
                if (playerArray[i].selected) {
                    $('.player-' + i).toggleClass('active');
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

function detectCollision() {
    targetArray.forEach(function(element) {
        playerArray.forEach(function(player) {
            if(intersects(player, element) && element.isAlive) {
                window.points++;
                document.getElementById("points").innerHTML = window.points;
                element.isAlive = false;

                var elem = document.getElementById('target-' + element.id);
                elem.style.display = "none";
            }
        });
    });
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

function animate(callback) {
    refreshIntervalId = setInterval(callback, 1000/fps);
}

function loop(array, callback) {
    for (var i = 0; i < array.length; i++) {
        callback(i);
    }
}
