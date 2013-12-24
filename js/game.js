/* Global Vars */
var refreshIntervalId;

targets = 5;
targetArray = new Array();

players = 2;
playerArray = new Array();

w = 50;
fps = 60;
playersCreated = 0;


points = 0;

var vx;

function init() {

    // Better performance to set variables once?
    windowHeight = $(window).height();
    windowWidth = $(window).width();

    clearInterval(refreshIntervalId);
    createTargets(targets);
    createPlayers(players);

    // Target's position should reset on init.
    resetTargetPosition(targets);
    resetPlayerPosition(players);
    setKeys();
    
    // Start animation
    animate();
}

function animate() {
    refreshIntervalId = setInterval(function() {

        targetArray.forEach( function(element, i) {
            animateFallTargets(element);
            // Prompt each target to fall separately.
            targetMove(i, targetArray[i].x, targetArray[i].y, targetArray[i].vy);
        });


        playerArray.forEach( function(element, i) {
            playerMove(i, playerArray[i].x, playerArray[i].y, playerArray[i].vy);
        });

    }, 1000/fps);
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

function createPlayers(amount) {
    for (var i = 0; i < amount; i++) {
        playerIdClass = 'player-' + playersCreated;
        var playerDiv = document.createElement( 'div' );
        playerDiv.className = 'player' + ' ' + playerIdClass;
        document.body.appendChild(playerDiv);
        playersCreated++;
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

function resetTargetPosition(amount) {
    // Reset each target's position on each init.
    for (var i = 0; i < amount; i++) {
        targetArray[i] = new Object();
        targetArray[i].id = i;
        targetArray[i].x = i * 100;
        targetArray[i].y = 0;
        targetArray[i].width = w;
        targetArray[i].height = w;
        targetArray[i].vy = Math.random() + 0.5;
        targetArray[i].isAlive = true;
    }
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

function animateFallTargets(element) {

    if (
        element.x + w < $(window).width()
            && element.y + w < $(window).height() + w // Add width to hide targets
        ) {
        element.y += element.vy;
    }

    playerArray.forEach(function(player, i) {
        if(intersects(player, element, i) && element.isAlive) {
            points += 1;
            document.getElementById("points").innerHTML = points;
            element.isAlive = false;

            var elem = document.getElementById('target-' + element.id);
            console.log('target-' + element.id);
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

    activeFlag = 0;
    playerArray[0].selected = true;

    document.body.onkeydown = function(event){
        event = event || window.event;
        var keycode = event.charCode || event.keyCode;
        if(keycode === 9){
            event.preventDefault();

            if(activeFlag == -1) {
               playerArray[playerArray.length-1].selected = false;
            } else {
               playerArray[activeFlag].selected = false;
            }

            activeFlag++;
            playerArray[activeFlag].selected = true;
            if(activeFlag == playerArray.length - 1) {
               activeFlag = -1;
            }

        }
    }
}


function intersects(player,target, i) {
    return (player.x <=  target.x + target.width &&
        target.x <=  player.x + player.width &&
        player.y <= target.y + target.height &&
        target.y <= player.y + player.height);
}



/*!
 * jQuery.fastKey.js 0.1 - https://github.com/yckart/fastKey
 * Fire keyevents much faster
 *
 * Copyright (c) 2012 Yannick Albert (http://yckart.com) | @yckart #fastkey
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).
 * 2012/10/07
 */
;(function($, window, document, undefined) {

    $.fastKey = function(key, fun, options) {return $.fn.fastKey(key, fun, options);};
    $.fn.fastKey = function(key, fun, options) {

        o = $.extend({}, $.fn.fastKey.options, options);

        var keys = {},
            iterater = function() {
                for (var code in keys) {
                    if (!keys.hasOwnProperty(code)) {continue;}
                    switch (code) {
                        case key:
                            fun();
                    }
                }
            };

        setInterval(iterater, o.interval);

        $(document).keydown(function(e) {
            keys[e.keyCode] = true;
            if (o.preventDefault && e.keyCode == key) {
                e.preventDefault();
            }
        });

        $(document).keyup(function(e) {
            delete keys[e.keyCode];
        });
    };

    $.fn.fastKey.options = {
        interval: 10,
        preventDefault: true
    };

})(jQuery, window, document);

function noop() {};


