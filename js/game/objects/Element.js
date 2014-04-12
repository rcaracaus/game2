function Element(i) {
  this.x = Math.floor(Math.random() * windowWidth);
  this.element = document.createElement('img');
}
Element.prototype.isAlive = true;