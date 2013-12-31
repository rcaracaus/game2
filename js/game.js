/* Global Vars */
var refreshIntervalId;

domElements = {
    targets: {
        name: "target",
        amount: 10,
        items: new Array()
    },
    players: {
        name: "player",
        amount: 2,
        items: new Array()
    }
}

fps = 60;
window.points = 0;


function init() {
    windowHeight = $(window).height();
    windowWidth = $(window).width();
    w = windowWidth / 30;

    startTimer();
    clearInterval(refreshIntervalId);

    createElements(domElements);

    // Target's position should reset on init.
    reset();
    setKeys(domElements);
    // Start animation
    animate(function() {
        animateTargets(domElements);
        elementMove(domElements);
        detectCollision();
    });
}

function reset() {
    setLocalHighScore();
    resetScore();
    startTimer();
}

function createElements(object) {
    for(var index in object) {
        for (var i = 0; i < object[index].amount; i++) {
            object[index].items[i] = document.createElement('div');
            object[index].items[i].id = object[index].name + '-' + i;
            object[index].items[i].x = Math.floor(Math.random() * (windowWidth - w));
            object[index].items[i].y = 0 - w;
            object[index].items[i].width = w;
            object[index].items[i].height = w;
            object[index].items[i].vy = Math.random() + 0.5;
            object[index].items[i].isAlive = true;
            object[index].items[i].lowestY = false;
            object[index].items[i].selected = true;
            object[index].items[i].className = object[index].name + ' poo1' + ' ';
            object[index].items[i].style.width = w + "px";
            object[index].items[i].style.height = w + "px";
            object[index].items[i].style.top = -w + "px"; // Positions element offscreen initially
            document.body.appendChild(object[index].items[i]);
        }
    }
}

function elementMove(object) {
    for(var index in object) {
        object[index].items.forEach( function(element, i) {
            element.style.top = element.y + "px";
            element.style.left = element.x + "px";
        });
    }
}


function animateTargets(domElements) {
    domElements.targets.items.forEach( function(element, i) {
        var elems = document.getElementsByClassName('target');

        if (isInWindow(element)) {
            element.y += element.vy;
        } else {
            elems[i].style.display = "block";
            element.isAlive = true;
            element.x = Math.floor(Math.random() * (windowWidth - w));
            element.y = 0 - w;
        }
    });
}

function setKeys(object) {

    object.players.items.forEach( function(element, i) {
        element.y = windowHeight - w;
    });

    // Right Key
    $.fastKey('39', function() {
        console.log('left');
        object.players.items.filter(function(item) {
            return item.selected;
        })[0].x += 2;
    });

    // Left Key
    $.fastKey('37', function() {
        object.players.items.filter(function(item) {
            return item.selected;
        })[0].x -= 2;
    });

    selectedPlayer(object);

}

function selectedPlayer(object) {
    var selected;
    object.players.items[1].selected = false;
    $('#player-0').addClass('active');

    document.body.onkeydown = function(event){
        event = event || window.event;
        var keycode = event.charCode || event.keyCode;
        if(keycode === 9){
            event.preventDefault();
            object.players.items[0].selected = !object.players.items[0].selected;
            object.players.items[1].selected = !object.players.items[1].selected;

            loop(object.players.items, function(i) {
                if (object.players.items[i].selected) {
                    $('#player-' + i).toggleClass('active');
                } else {
                    $('#player-' + i).removeClass('active');
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

function isInWindow(element) {
    return (element.x + w < windowWidth && element.y + w < windowHeight + w);
}

function detectCollision() {
    domElements.targets.items.forEach(function(element) {
        domElements.players.items.forEach(function(player) {
            if(intersects(player, element) && element.isAlive) {
                window.points++;
                document.getElementById("points").innerHTML = window.points;
                element.isAlive = false;
                var elem = document.getElementById(element.id);
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
