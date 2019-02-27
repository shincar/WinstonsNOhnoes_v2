var Grid = function(grid_index, x, y, size) {
      this.grid_index = grid_index;
      this.x = x;
      this.y = y;
      this.size = size;
      this.token_list = [];
      this.owner = 0;
};

Grid.prototype.IsContains = function(x, y) {
  return ( x > (this.x - this.size / 2) && x < (this.x + this.size / 2) && (y > this.y - this.size / 2) && (y < this.y + this.size / 2));
};

Grid.prototype.CleanUp = function(selectedToken) {
  if(this.token_list.length === 0) return;

  // if the last token in token_list is equal to selectedToken we have something to do
  var lastToken = this.token_list.slice(-1)[0];
  if(lastToken == selectedToken) {
      if( selectedToken.currentX === this.x && selectedToken.currentY === this.y ) {
          if( this.token_list.length > 1 ) {
              this.token_list[this.token_list.length - 2].visible = false;
          }
      }
  }
};
