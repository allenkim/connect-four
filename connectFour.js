var height = document.getElementById('grid_div').offsetHeight / 100;
var width = document.getElementById('grid_div').offsetWidth / 100;
var tick; // for setInterval
var grid = [];
for (var row = 0; row < height; row++){
  grid.push([]);
  for (var col = 0; col < width; col++)
    grid[row][col] = 0;
}

var playerTurn = 1;

function makeMove(col){
  for (var row = height - 1; row >= 0; row--){
    if (!grid[row][col]){
      grid[row][col] = playerTurn;
      playerTurn = 3 - playerTurn;
      drawGrid();
      return true;
    }
  }
  return false;
}

// 0 means empty, 1 means first player (yellow), 2 means second player (red)
function drawGrid(){
  for (var row = 0; row < height; row++){
    for (var col = 0; col < width; col++){
      var cell = document.getElementById(row+'-'+col);
      var color = 'white';
      if (grid[row][col] == 1)
        color = 'yellow';
      else if (grid[row][col] == 2)
        color = 'red';
      cell.setAttribute('fill',color);
    }
  }
}

function resetGrid(){
  for (var row = 0; row < height; row++){
    for (var col = 0; col < width; col++){
      grid[row][col] = 0;
    }
  }
  drawGrid();
}
