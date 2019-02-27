var Button = function(text, x, y, w, h, radius) {
  this.text = text;
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.radius = radius;
  this.stroke_weight = 5;
  this.text_size = 36;
};

Button.prototype.SetColorTheme = function(color, text_color, stroke_color) {
  this.color = color; //color(93,194,83);
  this.text_color = text_color; // color(213,251,209);
  this.stroke_color = stroke_color; //color(213,251,209);
}

Button.prototype.IsContains = function(x, y) {
  return (x > this.x && x < this.x + this.w &&
          y > this.y && y < this.y + this.h);
}
