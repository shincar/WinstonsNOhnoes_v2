/* @pjs preload="images/cs-winston.png,images/cs-ohnoes.png"; */

Button.prototype.draw = function() {
  fill(this.color);
  stroke(this.stroke_color);
  strokeWeight(this.stroke_weight);
  rect(this.x, this.y, this.w, this.h, this.radius);
  textSize(this.text_size);
  fill(this.text_color);
  textAlign(CENTER, TOP);
  text(this.text, this.x + this.w / 2, this.y);
};

var drawHomeScene = function() {
    background(58,121,52);
    fill(213,251,209);
    textSize(60);
    textAlign(CENTER,CENTER);
    text("Winston & Ohnoes", 0, 0, maxSize + 2 * paddingExtraH, maxSize * 0.75 + 2 * paddingExtraV);

    // Draw start button
    start_button.draw();
    options_button.draw();

    image(player1.image, paddingOfBoard + 50 + paddingExtraH, paddingOfBoard + paddingExtraV, 100, 100);
    image(player2.image, maxSize - paddingOfBoard - 150 + paddingExtraH, paddingOfBoard + paddingExtraV, 100, 100);
};

var gridSize = 160;
var gridCount = 3;
var paddingOfBoard = 120;
var maxSize = gridSize * gridCount + paddingOfBoard * 2;
var paddingExtraH = (window.innerWidth - maxSize) / 2;
var paddingExtraV = (window.innerHeight - maxSize) / 2;

var player1 = new Player(1, "Player 1", color(213,251,209), loadImage("images/cs-winston.png"));
var player2 = new Player(2, "Player 2", color(58,121,52), loadImage("images/cs-ohnoes.png"));

var start_button_x = paddingOfBoard + 30 + paddingExtraH;
var start_button_y = gridSize * 2 + paddingOfBoard + paddingExtraV;
var options_button_x = maxSize + paddingExtraH - (paddingOfBoard + 30) - gridSize;
var options_button_y = gridSize * 2 + paddingOfBoard + paddingExtraV;
var start_button = new Button("Start", start_button_x, start_button_y, gridSize, gridSize * 0.3, gridSize / 10);
var options_button = new Button("Back", options_button_x, options_button_y, gridSize, gridSize * 0.3, gridSize / 10);

void setup()
{
  size(window.innerWidth,window.innerHeight);

  start_button.SetColorTheme(color(93,194,83), color(213,251,209), color(213,251,209));
  options_button.SetColorTheme(color(93,194,83), color(213,251,209), color(213,251,209));

  noLoop();
}

void draw(){
  drawHomeScene();
}
