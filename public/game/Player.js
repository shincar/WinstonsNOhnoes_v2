var Player = function(id, name, color, image) {
  this.id = id;
  this.name = name;
  this.color = color;
  this.image = image;
  this.tokens = [new Token(id, 0, TOKEN_SIZE_SMALL, color, image), new Token(id, 1, TOKEN_SIZE_SMALL, color, image),
                 new Token(id, 2, TOKEN_SIZE_MEDIUM, color, image), new Token(id, 3, TOKEN_SIZE_MEDIUM, color, image),
                 new Token(id, 4, TOKEN_SIZE_LARGE, color, image), new Token(id, 5, TOKEN_SIZE_LARGE, color, image)];
};

Player.prototype.reset = function() {
  this.tokens.forEach(function(element) {
      element.selected = false;
      element.used = false;
      element.visible = true;
  });
};

Player.prototype.DoClickAction = function(x, y, playground) {
  var bFindTokenToSelect = false;
  var bValidAction = false;
  var clickedToken;
  var bAlreadySelectedToken = false;
  var selectedToken;
  var token_index = -1;
  var grid_index = -1;

  // Get MouseX and MouseY and verify if any token is selected
  for(var i = 0; i < this.tokens.length; i++) {
      if(this.tokens[i].visible && this.tokens[i].IsContains(x, y)) {
          bFindTokenToSelect = true;
          clickedToken = this.tokens[i];
      }
      if(this.tokens[i].selected) {
          bAlreadySelectedToken = true;
          selectedToken = this.tokens[i];
      }
  }

  // If user click on a token, that means either he want to select or unselect a token
  if(bFindTokenToSelect) {
      if(clickedToken.selected) {
          clickedToken.selected = false;
          bAlreadySelectedToken = false;
      } else {
          // if the token was not clicked, we should unselect previous selected token first
          if(bAlreadySelectedToken)
              selectedToken.selected = false;
          clickedToken.selected = true;
      }
  }
  // otherwise, user may try to click on the grid that he want to do a real move
  else if(bAlreadySelectedToken)
  {
      // if x and y fall into any grid range, and there is no token equal and bigger to this one,
      // we move the token user selected to this grid
      playground.gridList.forEach(function(grid) {
          if( grid.IsContains(x, y) &&
              (grid.token_list.length === 0 || (grid.token_list.length > 0 && grid.token_list[grid.token_list.length - 1].size < selectedToken.size)) ){

              if(!selectedToken.used) {
                selectedToken.parentGrid = grid;
              } else {
                selectedToken.parentGrid.token_list.pop();
                if(selectedToken.parentGrid.token_list.length > 0) {
                  selectedToken.parentGrid.token_list[selectedToken.parentGrid.token_list.length - 1].visible = true;
                  selectedToken.parentGrid.owner = selectedToken.parentGrid.token_list[selectedToken.parentGrid.token_list.length - 1].player_id;
                } else {
                  selectedToken.parentGrid.owner = 0;
                }
              }

              selectedToken.selected = false;
              selectedToken.used = false;
              if(!playground.check()) {
                // move the token to this grid
                selectedToken.used = true;
                selectedToken.setTokenInfo(grid.x, grid.y, selectedToken.size);
                grid.token_list.push(selectedToken);
                grid.owner = selectedToken.player_id;
                selectedToken.parentGrid = grid;
                token_index = selectedToken.token_index;
                grid_index = grid.grid_index;
                bValidAction = true;
              }
          }
      });

      // After we decide if a token was moved, we need to clean up token_list in gridList
      playground.gridList.forEach(function(grid) {
          grid.CleanUp(selectedToken);
      });

  }
  // if there is no token selected before and user does not click any token, we do nothing
  else
  {
      // do nothing here for now
  }

  return {
      result: bValidAction,
      token_index: token_index,
      grid_index: grid_index
  };
};
