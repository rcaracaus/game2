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
w = windowWidth * .05;

/*
 * Initialization function.
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