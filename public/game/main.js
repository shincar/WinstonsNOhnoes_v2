/* @pjs preload="https://shincar.github.io/games/images/cs-winston.png,https://shincar.github.io/games/images/cs-ohnoes.png"; */

Token.prototype.draw = function(x, y, size) {
  if(this.selected) {
      stroke(244,0,0);
      strokeWeight(2);
  } else {
      noStroke();
  }
  noFill();
  ellipse(this.currentX, this.currentY, this.currentSize, this.currentSize);
  if(this.image) {
      image(this.image, this.currentX - this.currentSize / 2, this.currentY - this.currentSize / 2, this.currentSize, this.currentSize);
  }
};

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

var resetGameData = function() {
  stepCounter = 0;

  // Put all players token back to their pocket
  player1.reset();
  player2.reset();

  playground.reset();
};

var processHomeScene = function() {
    if(gameScene != GAME_SCENE_HOME) return;

    // Check if start button clicked
    if(start_button.IsContains(mouseX, mouseY)) {
        resetGameData();

        gameScene = GAME_SCENE_PLAYGROUND;
    }

     if(options_button.IsContains(mouseX, mouseY)) {
        link("http://shincar.github.io/games/WinstonNOhnoes.html");
    }
};

var drawPlaygroundScene = function() {
    background(93,194,83);
    stroke(213,251,209);
    strokeWeight(5);
    for(var i = 0; i <= gridCount; i++) {
        line(paddingOfBoard + paddingExtraH, i * gridSize + paddingOfBoard + paddingExtraV, gridSize * gridCount + paddingOfBoard + paddingExtraH, i * gridSize + paddingOfBoard + paddingExtraV);
        line(i * gridSize + paddingOfBoard + paddingExtraH, paddingOfBoard + paddingExtraV, i * gridSize + paddingOfBoard + paddingExtraH, gridSize * gridCount + paddingOfBoard + paddingExtraV);
    }

    var currentPlayer = players[stepCounter % 2];
    fill(currentPlayer.color);
    stroke(currentPlayer.color);
    strokeWeight(5);
    textSize(24);
    text(currentPlayer.name, 50 + paddingExtraH, 10 + paddingExtraV);

    // Draw player token here
    var token_adjust = 0;
    var current_token_x = 150 - currentPlayer.tokens[0].size / 2 + paddingExtraH;
    var current_token_y = 50 + paddingExtraV;

    currentPlayer.tokens.forEach(function(token) {
        if(!token.used) {
          current_token_x = current_token_x + token.size / 2;
          token.setTokenInfo(current_token_x, current_token_y, token.size);
          token.draw();
          current_token_x = current_token_x + token.size / 2 +  10;
        }
    });

    // Draw the lastest token in the grid here
    playground.gridList.forEach(function(grid) {
      if(grid.token_list.length > 0) {
          grid.token_list[grid.token_list.length - 1].draw();
      }
    });

    if(playground.winner != 0) {
      fill(2, 73, 19);
      textSize(60);
      textAlign(CENTER, CENTER);
      players.forEach(function(player) {
          if(player.id === playground.winner) {
            text(player.name + " Wins!", 0, 0, maxSize + 2 * paddingExtraH, maxSize * 0.66 + 2 * paddingExtraV);
          }
      });
    }

    noStroke();
    fill(93,194,83);
    rect(paddingExtraH, maxSize - paddingOfBoard + 5 + paddingExtraV, maxSize, maxSize);
    currentPlayer = players[stepCounter % 2];
    image(currentPlayer.image, image_left, maxSize - 80 + paddingExtraV, 80, 80);
    image_left = image_left + image_step;
    if( (image_left + 80) > maxSize + paddingExtraH || image_left < paddingExtraH) {
        image_step = image_step * (-1);
    }
};

var processPlaygroundScene = function() {
    if(gameScene != GAME_SCENE_PLAYGROUND) return;

    var currentPlayer = players[stepCounter % 2];
    if(currentPlayer.DoClickAction(mouseX, mouseY, playground)) {
      stepCounter++;
    }

    if(playground.check()) {
      gameScene = GAME_SCENE_END;
    }
};

var processEndScene = function() {
    if(gameScene != GAME_SCENE_END) return;

    gameScene = GAME_SCENE_HOME;
};

mouseClicked = function() {
  switch (gameScene) {
      case GAME_SCENE_HOME:
          processHomeScene();
          break;

      case GAME_SCENE_PLAYGROUND:
          processPlaygroundScene();
          break;
      case GAME_SCENE_END:
          processEndScene();
          break;
  }
};

var gameScene = GAME_SCENE_HOME;
var image_left = paddingExtraH;
var image_step = 2;
var gridSize = 160;
var gridCount = 3;
var paddingOfBoard = 120;
var maxSize = gridSize * gridCount + paddingOfBoard * 2;
var paddingExtraH = (window.innerWidth - maxSize) / 2;
var paddingExtraV = (window.innerHeight - maxSize) / 2;
var username;

var player1 = new Player(1, "Player 1", color(213,251,209), loadImage("https://shincar.github.io/games/images/cs-winston.png"));
var player2 = new Player(2, "Player 2", color(58,121,52), loadImage("https://shincar.github.io/games/images/cs-ohnoes.png"));

var start_button_x = paddingOfBoard + 30 + paddingExtraH;
var start_button_y = gridSize * 2 + paddingOfBoard + paddingExtraV;
var options_button_x = maxSize + paddingExtraH - (paddingOfBoard + 30) - gridSize;
var options_button_y = gridSize * 2 + paddingOfBoard + paddingExtraV;
var start_button = new Button("Start", start_button_x, start_button_y, gridSize, gridSize * 0.3, gridSize / 10);
var options_button = new Button("Back", options_button_x, options_button_y, gridSize, gridSize * 0.3, gridSize / 10);

var playground = new PlayGround(gridCount, gridSize, paddingOfBoard, paddingExtraH, paddingExtraV);

var stepCounter = 0;
var players = [player1, player2];

void setup()
{
  size(window.innerWidth,window.innerHeight);

  start_button.SetColorTheme(color(93,194,83), color(213,251,209), color(213,251,209));
  options_button.SetColorTheme(color(93,194,83), color(213,251,209), color(213,251,209));

  if(getUsername()) {
    console.log("Got username: " + username);
  }
}

void draw(){

  switch (gameScene) {
      case GAME_SCENE_HOME:
          {
              drawHomeScene();
          }
          break;
      case GAME_SCENE_PLAYGROUND:
          {
              drawPlaygroundScene();
          }
          break;
      case GAME_SCENE_END:
          {
              drawPlaygroundScene();
          }
          break;
  }
}
