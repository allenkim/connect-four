var height = document.getElementById('grid_div').offsetHeight / 100;
var width = document.getElementById('grid_div').offsetWidth / 100;
var tick; // for setInterval
var grid = [];
for (var row = 0; row < height; row++){
  grid.push([]);
  for (var col = 0; col < width; col++)
    grid[row][col] = 0;
}

function drawGrid(){
  for (var row = 0; row < height; row++){
    for (var col = 0; col < width; col++){
      var cell = document.getElementById(row+'-'+col);
      if (grid[row][col])
        cell.setAttribute('fill-opacity',1);
      else
        cell.setAttribute('fill-opacity',0);
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
