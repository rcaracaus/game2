function Player(i) {
  Element.call(this);
  this.element.id = 'player-' + i;
}
Player.prototype = new Element();
Player.prototype.constructor = Player;
Player.prototype.element.className = 'player';
Player.prototype.y = windowHeight-w;