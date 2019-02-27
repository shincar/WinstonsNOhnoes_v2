/* @pjs preload="images/cs-winston.png,images/cs-ohnoes.png"; */

var gridSize = 160;
var gridCount = 3;
var paddingOfBoard = 120;
var maxSize = gridSize * gridCount + paddingOfBoard * 2;
var paddingExtraH = (window.innerWidth - maxSize) / 2;
var paddingExtraV = (window.innerHeight - maxSize) / 2;

var gameScene = GAME_SCENE_HOME;
var image_left = paddingExtraH;
var image_step = 0;

setup = function() {
  size(400, 400);
}

// size(window.innerWidth, window.innerHeight);
draw = function() {
  image_step++;
  if( image_step % 60 === 0 ) {
    console.log('draw tick');
  }
  background(255);
  fill(color(93,194,83));
  ellipse(100, 100, 80, 80);
}
