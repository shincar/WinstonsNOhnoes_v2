var PlayGround = function(gridCount, gridSize, paddingOfBoard, paddingExtraH, paddingExtraV) {
  this.grid_count = gridCount;
  this.grid_size = gridSize;
  this.padding = paddingOfBoard;
  this.gridList = [];
  this.lines = [];
  this.winner = 0;

  for(var row = 0; row < this.grid_count; row++) {
      for(var col = 0; col < this.grid_count; col++) {
          this.gridList.push(new Grid(row * this.grid_count + col, this.padding + (col + 0.5) * this.grid_size + paddingExtraH, this.padding + (row + 0.5) * this.grid_size + paddingExtraV, this.grid_size));
      }
  }
};

PlayGround.prototype.reset = function() {
  this.gridList.forEach(function(grid) {
      grid.token_list = [];
      grid.owner = 0;
  });
  this.lines = [];
  this.winner = 0;
};

PlayGround.prototype.check = function() {
  if( this.lines.length > 0 ) return true;
  var bFound = false;

  // check horizontal line
  for(var row = 0; row < this.grid_count; row++) {
    bFound = true;

    if( this.gridList[row * this.grid_count].owner === 0 ) {
      bFound = false;
      continue;
    } else {
      for(var col = 0; col < this.grid_count - 1; col++) {
        bFound = this.gridList[row * this.grid_count].owner === this.gridList[row * this.grid_count + col + 1].owner;
        if(!bFound) {
          break;
        }
      }
    }
    if(bFound) {
      console.log("Found Winner: " + this.gridList[row * this.grid_count].owner);
      this.lines.push(this.gridList[row * this.grid_count]);
      this.lines.push(this.gridList[(row + 1) * this.grid_count - 1]);
      break;
    }
  }

  // check vertical line
  for(var col = 0; col < this.grid_count; col++) {
    bFound = true;

    if( this.gridList[col].owner === 0 ) {
      bFound = false;
      continue;
    } else {
      for(var row = 0; row < this.grid_count - 1; row++) {
        bFound = this.gridList[col].owner === this.gridList[(row + 1) * this.grid_count + col].owner;
        if(!bFound) {
          break;
        }
      }
    }
    if(bFound) {
      console.log("Found Vertical Winner: " + this.gridList[col].owner);
      this.lines.push(this.gridList[col]);
      this.lines.push(this.gridList[col + (this.grid_count - 1) * this.grid_count]);
      break;
    }
  }

  // check cross line 1
  if( this.gridList[0].owner != 0 ) {
    bFound = true;
    for(var i = 0; i < this.grid_count-1; i++) {
      bFound = this.gridList[0].owner === this.gridList[(i + 1) * this.grid_count + (i + 1)].owner;

      if(!bFound) {
        break;
      }
    }
    if(bFound) {
      console.log("Found cross line 1 Winner: " + this.gridList[0].owner);
      this.lines.push(this.gridList[0]);
      this.lines.push(this.gridList[this.gridList.length-1]);
    }
  }

  // check cross line 2
  if( this.gridList[this.grid_count-1].owner != 0) {
    bFound = true;
    for(var i = 0; i < this.grid_count-1; i++) {
      bFound = this.gridList[this.grid_count-1].owner === this.gridList[(i+2)*(this.grid_count-1)].owner;

      if(!bFound) {
        break;
      }
    }
    if(bFound) {
      console.log("Found cross line 2 Winner: " + this.gridList[this.grid_count-1].owner);
      this.lines.push(this.gridList[this.grid_count-1]);
      this.lines.push(this.gridList[(this.grid_count-1) * this.grid_count]);
    }
  }
  if(this.lines.length > 0) {
    this.winner = this.lines[0].owner;
  }

  return {
    result: (this.lines.length > 0),
    winner: this.winner
  };
};
