var Token = function(id, token_index, size, color, image) {
  this.player_id = id;
  this.token_index = token_index;
  this.size = size;
  this.color = color;
  this.image = image;
  this.selected = false;
  this.used = false;
  this.visible = true;
  this.currentX = 0;
  this.currentY = 0;
  this.currentSize = 0;
  this.parentGrid;
};

Token.prototype.setTokenInfo = function(x, y, size) {
  this.currentX = x;
  this.currentY = y;
  this.currentSize = size;
};

Token.prototype.IsContains = function(x, y) {
  return (Math.pow(x - this.currentX, 2) + Math.pow(y - this.currentY, 2)) < Math.pow(this.currentSize / 2, 2);
};
