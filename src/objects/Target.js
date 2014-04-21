function Target(i) {
  Element.call(this);
  this.element.id = 'target-' + i;
}
Target.prototype = new Element();
Target.prototype.constructor = Target;
Target.prototype.element.className = 'target';
Target.prototype.y = 0;