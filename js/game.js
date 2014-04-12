/* Global Vars */
var refreshIntervalId;
var deviceGamma = null;
domElements = {
    targets: new Array(),
    players: new Array()
}
fps = 60;
window.points = 0;
keys = [];
poosMissed = 0;
isPaused = false;
isRunning = false;

windowHeight = document.body.clientHeight;
windowWidth = document.body.clientWidth;
w = windowWidth*.05;

/*
 * init()
 */
function init() {
    if (!isRunning) {
        windowHeight = document.body.clientHeight;
        windowWidth = document.body.clientWidth;
        w = windowWidth / 30;
        startTimer();
        clearInterval(refreshIntervalId);
        createElements();
        classify();
        addListeners();
        isRunning = true;
      reset();
    } else {
        reset();
    }
    
    // Start looping animation etc.

    lastTime = Date.now() / 1000;
    refreshIntervalId = setInterval(update, 1000/fps);
}

function pause() {
    if(isRunning) {
        if(isPaused) {
            lastTime = Date.now() / 1000;
            refreshIntervalId = setInterval(update, 1000/fps);
            isPaused = false;
        } else {
            clearInterval(refreshIntervalId);
            isPaused = true;
        }
    }
}

function update() {
    var now = Date.now() / 1000;
    var dt = now - lastTime;
    lastTime = Date.now() / 1000;
    animateTargets(dt);
    playerInput(dt);
    elementMove();
    detectCollision();
}


function reset() {
    setLocalHighScore();
    resetScore();
    startTimer();
    window.points = 0;
    loop(domElements.targets, function(i) {
        domElements.targets[i].vy = (Math.random()+0.5) * windowHeight/6;
        domElements.targets[i].y = 0 - w;
    });
    isPaused = false;
    clearInterval(refreshIntervalId);
}

function Element(i) {
    this.x = Math.floor(Math.random() * windowWidth);
    this.element = document.createElement('img');
}
Element.prototype.isAlive = true;


function Target(i) {
  Element.call(this);
  this.element.id = 'target-' + i;
};
Target.prototype = new Element();
Target.prototype.constructor = Target;
Target.prototype.element.className = 'target';
Target.prototype.y = 0;

function Player(i) {
  Element.call(this);
  this.element.id = 'player-' + i;
};
Player.prototype = new Element();
Player.prototype.constructor = Player;
Player.prototype.element.className = 'player';
Player.prototype.y = windowHeight-w;


function createElements() {
    for (var i = 0; i < 10; i++) {
      domElements.targets[i] = new Target(i);
      document.body.appendChild(domElements.targets[i].element); // this could also be stored on the object later.
    }
    for (var i = 0; i < 2; i++) {
      domElements.players[i] = new Player(i);
      document.body.appendChild(domElements.players[i].element); // this could also be stored on the object later.
    }
}

function animateTargets(dt) {
  domElements.targets.forEach( function(element, i) {
    if (isInWindow(element)) {
      element.y += element.vy * dt;
    } else {
      element.isAlive = true;
      element.x = Math.floor(Math.random() * (windowWidth - w));
      element.y = 0 - w;
      poosMissed++;
      pooMissed();
    }
  });
}

/*
 * Changes x and y coordinates attached to the dom element into absolute pixel values to avoid parsing.
 */
function elementMove() {
        domElements.players.forEach( function(item, i) {
            item.element.style.top = item.y + "px";
            item.element.style.left = item.x + "px";
            if(item.isAlive == false) {
                item.element.style.display = "none";
            } else {
                item.element.style.display = "block";
            }
        });

        domElements.targets.forEach( function(item, i) {
          item.element.style.top = item.y + "px";
          item.element.style.left = item.x + "px";
          if(item.isAlive == false) {
            item.element.style.display = "none";
          } else {
            item.element.style.display = "block";
          }
        });

}


function addListeners() {

    document.getElementById("player-0").classList.add('selected');

    document.body.onkeydown = function(event) {
        event = event || window.event;
        var keycode = event.charCode || event.keyCode;
        switch(keycode) {
            case 9:
                event.preventDefault();
                togglePlayer();
                break;
            case 37:
                event.preventDefault();
                keys['left'] = true;
                break;
            case 39:
                event.preventDefault();
                keys['right'] = true;
                break;
        }
    }

    document.body.onkeyup = function(event) {
        event = event || window.event;
        var keycode = event.charCode || event.keyCode;
        switch(keycode) {
            case 37:
                event.preventDefault();
                keys['left'] = false;
                break;
            case 39:
                event.preventDefault();
                keys['right'] = false;
                break;
        }
    }

    document.addEventListener('touchstart', function(e) {
        e.preventDefault();
        togglePlayer();
    }, false);

    window.addEventListener("deviceorientation", function(e) {
        deviceGamma = e.gamma;
    }, true);

    window.addEventListener('resize', function() {
        windowHeight = document.body.clientHeight;
        windowWidth = document.body.clientWidth;
    }, true);

}

function togglePlayer() {
    loop(domElements.players, function(i) {
        document.getElementById("player-"+ i).classList.toggle('selected');
    });
}

function isInWindow(item) {
    return (item.x + w < windowWidth && item.y + w < windowHeight + w);
}

function intersects(player, target) {
        
    y = player.element.getBoundingClientRect().top;

    target.width = target.element.getBoundingClientRect().width;
    target.height = target.element.getBoundingClientRect().height;

    player.width = target.element.getBoundingClientRect().width;
    player.height = target.element.getBoundingClientRect().height;

    return (player.x <=  target.x + target.width &&
        target.x <=  player.x + player.width &&
        y <= target.y + target.height &&
        target.y <= y + player.height);

}

function detectCollision() {
    domElements.targets.forEach(function(target) {
        domElements.players.forEach(function(player) {
            if(intersects(player, target) && target.isAlive) {
                window.points++;
                document.getElementById("points").innerHTML = window.points;
                target.isAlive = false;
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
        document.getElementsByClassName("timer")[0].innerHTML = count;
    }
}


function setLocalHighScore() {

    if(!localStorage.getItem('highScore')) {
        localStorage.setItem('highScore', window.points);
    } else if (window.points > localStorage.getItem('highScore')) {
        localStorage.setItem('highScore', window.points);
    }

    document.getElementsByClassName("timer")[0].innerHTML = localStorage.getItem('highScore');
}

function resetScore() {
  window.points = 0;
}

function pooMissed() {
  $(".poosMissed").css('height', poosMissed);
}

function loop(array, callback) {
    for (var i = 0; i < array.length; i++) {
        callback(i);
    }
}

function classify() {
    domElements.players.forEach(function (item){
        item.element.classList.add("player");
        item.width = item.element.offsetWidth;
        item.height = item.element.offsetHeight;
    });
    domElements.targets.forEach(function (item){
      item.element.classList.add("target");
      item.width = item.element.offsetWidth;
      item.height = item.element.offsetHeight;
    });
}

/*
 *  Get selected player from domElements array.
 */
function getSelected() {
    return domElements.players.filter(function(item) {return item.element.classList.contains('selected');})[0];
}

/*
 * Calculate whether player input should move toilets.
 */
function playerInput(dt) {
    var element = getSelected();
    if (deviceGamma !== null) {
        if (deviceGamma > 10) {
            if (element.x < windowWidth - element.width) {
                element.x += deviceGamma * 10 * (windowWidth / 1300) * dt;
            } else {
                element.x = windowWidth - element.width;
            }
        }
        if (deviceGamma < -10) {
            if (element.x > 0) {
                element.x += deviceGamma * 10 * (windowWidth / 1300) * dt;
            } else {
                element.x = 0;
            }
        } 
    }

    if(keys['right']) {
        if (element.x < windowWidth - element.width) {
          element.x += 200 * (windowWidth / 1300) * dt;
        } else {
          element.x = windowWidth - element.width;
        }
    }

    if(keys['left']) {
        if (element.x > 0) {
          element.x -= 200 * (windowWidth / 1300) * dt;
        } else {
          element.x = 0;
        }
    }
}