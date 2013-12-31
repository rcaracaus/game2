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
        detectCollision(domElements);
    });
}

function reset() {
    setLocalHighScore();
    resetScore();
    startTimer();
}


function Element(name, i) {
    this.x = Math.floor(Math.random() * (windowWidth - w));
    this.y = 0 - w;
    this.vy = Math.random() + 0.5;
    this.isAlive = true;
    this.selected = true;
    this.element = document.createElement('div');
    this.element.id = name + '-' + i;
    this.element.className = name + ' poo1' + ' ';
    this.element.style.width = w + "px";
    this.element.style.height = w + "px";
    this.element.style.top = -w + "px"; // Positions element offscreen initially
}

function createElements(object) {
    for(var index in object) {
        for (var i = 0; i < object[index].amount; i++) {
            object[index].items[i] = new Element(object[index].name, i);
            document.body.appendChild(object[index].items[i].element);
        }
    }
}

function animateTargets(domElements) {
    domElements.targets.items.forEach( function(element, i) {

        if (isInWindow(element)) {
            element.y += element.vy;
        } else {
            element.isAlive = true;
            element.x = Math.floor(Math.random() * (windowWidth - w));
            element.y = 0 - w;
        }
    });
}

/*
 * Changes x and y coordinates attached to the dom element into absolute pixel values to avoid parsing.
 */
function elementMove(object) {
    for(var index in object) {
        object[index].items.forEach( function(item, i) {
            item.element.style.top = item.y + "px";
            item.element.style.left = item.x + "px";
            if(item.isAlive == false) {
                item.element.style.display = "none";
            } else {
                item.element.style.display = "block";
            }
        });
    }
}

function setKeys(object) {
    object.players.items.forEach( function(item, i) {
        item.y = windowHeight - w;
    });

    // Right Key
    $.fastKey('39', function() {
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

function isInWindow(item) {
    return (item.x + w < windowWidth && item.y + w < windowHeight + w);
}

function detectCollision(object) {

    function intersects(player, target) {
        return (player.x <=  target.x + w &&
            target.x <=  player.x + w &&
            player.y <= target.y + w &&
            target.y <= player.y + w);
    }

    object.targets.items.forEach(function(item) {
        object.players.items.forEach(function(player) {
            if(intersects(player, item) && item.isAlive) {
                window.points++;
                document.getElementById("points").innerHTML = window.points;
                item.isAlive = false;
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
