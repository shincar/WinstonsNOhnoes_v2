$(function() {
  var FADE_TIME = 150; // ms

  // Initialize variables
  var $window = $(window);
  var $usernameInput = $('.login.page .usernameInput'); // Input for username
  var $optionUsernameInput = $('.options.page .usernameInput');

  var $loginPage = $('.login.page'); // The login page
  var $gamePage = $('.game.page'); // The game page
  var $optionsPage = $('.options.page'); // The options page
  var $gameCanvas = $('#game-canvas');

  // Prompt for setting a username
  var username;
  var connected = false;

  var socket = io();

  // Prevents input from having injected markup
  const cleanInput = (input) => {
    return $('<div/>').text(input).html();
  }

  const getUsername = () => {
    return username;
  }

  var processingCanvasSketch;
  // Sets the client's username
  const setUsername = () => {
    username = cleanInput($usernameInput.val().trim());

    // If the username is valid
    if (username) {
      console.log('setUsername()');
      var optionUsername = cleanInput($optionUsernameInput.val().trim());
      if( optionUsername ) {
        username = optionUsername;
      }
      $loginPage.fadeOut();
      $optionsPage.fadeOut();
      $gamePage.show();
      $loginPage.off('click');

      if(processingCanvasSketch) {
        processingCanvasSketch.exit();
      }
      processingCanvasSketch = new Processing('game-canvas', sketchProc);
      // Tell the server your username
      // [TODO] Later we will send command to server to tell server we are in with a fight room name
      // socket.emit('add user', username);
    }
  }

  const switchToOptionPage = () => {
    $gamePage.fadeOut();

    if(username) {
      $optionUsernameInput.val(username);
    }
    $optionsPage.fadeIn();
  }

  $window.keydown(event => {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      // $currentInput.focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      setUsername();
    }
  });

  // Simple way to attach js code to the canvas is by using a function
  function sketchProc(processing) {
    /* @pjs preload="https://shincar.github.io/games/images/cs-winston.png,https://shincar.github.io/games/images/cs-ohnoes.png"; */

    Token.prototype.draw = function(x, y, size) {
      if(this.selected) {
          processing.stroke(244,0,0);
          processing.strokeWeight(2);
      } else {
          processing.noStroke();
      }
      processing.noFill();
      processing.ellipse(this.currentX, this.currentY, this.currentSize, this.currentSize);
      if(this.image) {
          processing.image(this.image, this.currentX - this.currentSize / 2, this.currentY - this.currentSize / 2, this.currentSize, this.currentSize);
      }
    };

    Button.prototype.draw = function() {
      processing.fill(this.color);
      processing.stroke(this.stroke_color);
      processing.strokeWeight(this.stroke_weight);
      processing.rect(this.x, this.y, this.w, this.h, this.radius);
      processing.textSize(this.text_size);
      processing.fill(this.text_color);
      processing.textAlign(processing.CENTER, processing.TOP);
      processing.text(this.text, this.x + this.w / 2, this.y);
    };

    var drawHomeScene = function() {
        processing.background(58,121,52);
        processing.fill(213,251,209);
        processing.textSize(60);
        processing.textAlign(processing.CENTER,processing.CENTER);
        processing.text("Winston & Ohnoes", 0, 0, maxSize + 2 * paddingExtraH, maxSize * 0.75 + 2 * paddingExtraV);

        // Draw start button
        start_button.draw();
        options_button.draw();

        processing.image(player1.image, paddingOfBoard + 50 + paddingExtraH, paddingOfBoard + paddingExtraV, 100, 100);
        processing.image(player2.image, maxSize - paddingOfBoard - 150 + paddingExtraH, paddingOfBoard + paddingExtraV, 100, 100);
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
        if(start_button.IsContains(processing.mouseX, processing.mouseY)) {
            resetGameData();

            gameScene = GAME_SCENE_PLAYGROUND;
        }

        if(options_button.IsContains(processing.mouseX, processing.mouseY)) {
            switchToOptionPage();
        }
    };

    var drawPlaygroundScene = function() {
        processing.background(93,194,83);
        processing.stroke(213,251,209);
        processing.strokeWeight(5);
        for(var i = 0; i <= gridCount; i++) {
            processing.line(paddingOfBoard + paddingExtraH, i * gridSize + paddingOfBoard + paddingExtraV, gridSize * gridCount + paddingOfBoard + paddingExtraH, i * gridSize + paddingOfBoard + paddingExtraV);
            processing.line(i * gridSize + paddingOfBoard + paddingExtraH, paddingOfBoard + paddingExtraV, i * gridSize + paddingOfBoard + paddingExtraH, gridSize * gridCount + paddingOfBoard + paddingExtraV);
        }

        var currentPlayer = players[stepCounter % 2];
        processing.fill(currentPlayer.color);
        processing.stroke(currentPlayer.color);
        processing.strokeWeight(5);
        processing.textSize(24);
        processing.text(currentPlayer.name, 50 + paddingExtraH, 10 + paddingExtraV);

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
          processing.fill(2, 73, 19);
          processing.textSize(60);
          processing.textAlign(processing.CENTER, processing.CENTER);
          players.forEach(function(player) {
              if(player.id === playground.winner) {
                processing.text(player.name + " Wins!", 0, 0, maxSize + 2 * paddingExtraH, maxSize * 0.66 + 2 * paddingExtraV);
              }
          });
        }

        processing.noStroke();
        processing.fill(93,194,83);
        processing.rect(paddingExtraH, maxSize - paddingOfBoard + 5 + paddingExtraV, maxSize, maxSize);
        currentPlayer = players[stepCounter % 2];
        processing.image(currentPlayer.image, image_left, maxSize - 80 + paddingExtraV, 80, 80);
        image_left = image_left + image_step;
        if( (image_left + 80) > maxSize + paddingExtraH || image_left < paddingExtraH) {
            image_step = image_step * (-1);
        }
    };

    var processPlaygroundScene = function() {
        if(gameScene != GAME_SCENE_PLAYGROUND) return;

        var currentPlayer = players[stepCounter % 2];
        if(currentPlayer.DoClickAction(processing.mouseX, processing.mouseY, playground)) {
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

    processing.mouseClicked = function() {
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

    var player1 = new Player(1, "Player 1", processing.color(213,251,209), processing.loadImage("https://shincar.github.io/games/images/cs-winston.png"));
    var player2 = new Player(2, "Player 2", processing.color(58,121,52), processing.loadImage("https://shincar.github.io/games/images/cs-ohnoes.png"));

    var start_button_x = paddingOfBoard + 30 + paddingExtraH;
    var start_button_y = gridSize * 2 + paddingOfBoard + paddingExtraV;
    var options_button_x = maxSize + paddingExtraH - (paddingOfBoard + 30) - gridSize;
    var options_button_y = gridSize * 2 + paddingOfBoard + paddingExtraV;
    var start_button = new Button("Start", start_button_x, start_button_y, gridSize, gridSize * 0.3, gridSize / 10);
    var options_button = new Button("Options", options_button_x, options_button_y, gridSize, gridSize * 0.3, gridSize / 10);

    var playground = new PlayGround(gridCount, gridSize, paddingOfBoard, paddingExtraH, paddingExtraV);

    var stepCounter = 0;
    var players = [player1, player2];

    processing.setup = function() {
      processing.size(window.innerWidth,window.innerHeight);

      start_button.SetColorTheme(processing.color(93,194,83), processing.color(213,251,209), processing.color(213,251,209));
      options_button.SetColorTheme(processing.color(93,194,83), processing.color(213,251,209), processing.color(213,251,209));

      if(username) {
        player1.name = username;
      }
    }

    processing.draw = function() {

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
  }
});
