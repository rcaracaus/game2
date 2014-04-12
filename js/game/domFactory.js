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