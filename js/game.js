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
    classify(domElements, 'targets', 'poo1');
    classify(domElements, 'players', 'player');
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
    this.vy = (Math.random() + 0.5) * (windowHeight / 600);
    this.element = document.createElement('img');
    this.element.id = name + '-' + i;
    this.element.className = name;
}
Element.prototype.isAlive = true;

function createElements(domElements) {
    for(var index in domElements) {
        for (var i = 0; i < domElements[index].amount; i++) {
            domElements[index].items[i] = new Element(domElements[index].name, i);
            document.body.appendChild(domElements[index].items[i].element); // this could also be stored on the object later.
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
function elementMove(domElements) {
    for(var index in domElements) {
        domElements[index].items.forEach( function(item, i) {
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

function setKeys(domElements) {

    // Right Key
    $.fastKey('39', function() {
        domElements.players.items.filter(function(item) {
            return item.element.classList.contains('selected');
        })[0].x += 2 * (windowWidth / 1300);
    });

    // Left Key
    $.fastKey('37', function() {
        domElements.players.items.filter(function(item) {
            return item.element.classList.contains('selected');
        })[0].x -= 2 * (windowWidth / 1300);
    });

    selectedPlayer(domElements);

}

function selectedPlayer(domElements) {

  document.getElementById("player-0").classList.add('selected');

  document.body.onkeydown = function(event){
      event = event || window.event;
      var keycode = event.charCode || event.keyCode;
      if(keycode === 9){
          event.preventDefault();

          loop(domElements.players.items, function(i) {
            document.getElementById("player-"+ i).classList.toggle('selected');
          });

      }
  }

  document.addEventListener('touchstart', function(e) {
    e.preventDefault();
    var touch = e.touches[0];

    loop(domElements.players.items, function(i) {
      document.getElementById("player-"+ i).classList.toggle('selected');
    });

  }, false);

}

function isInWindow(item) {
    return (item.x + w < windowWidth && item.y + w < windowHeight + w);
}

function detectCollision(domElements) {

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

    domElements.targets.items.forEach(function(item) {
        domElements.players.items.forEach(function(player) {
            
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

function classify(domElements, type, classification) {
    domElements[type].items.forEach(function (item){
        item.element.classList.add(classification);
        item.width = item.element.offsetWidth;
        item.height = item.element.offsetHeight;
    });
}


window.addEventListener("deviceorientation", function(e) {
    if(e.gamma > 10) {
        domElements.players.items.filter(function(item) {
            return item.element.classList.contains('selected');
        })[0].x += (e.gamma * .2);
    } else if(e.gamma < -10) {
        domElements.players.items.filter(function(item) {
            return item.element.classList.contains('selected');
        })[0].x -= (e.gamma * -.2);
    }
}, true);

window.addEventListener('resize', function() {
    windowHeight = $(window).height();
    windowWidth = $(window).width();
}, true);