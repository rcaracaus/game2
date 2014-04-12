
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