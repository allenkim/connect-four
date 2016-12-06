// Custom Object with a constructor
var Point = function(row,col){
  this.row = row;
  this.col = col;
}

/*
 * Checks if the given row and column includes a four in a row
 * If so, return true (the player won)
 * else, return false
 */
function playerWon(row,col,currentColor,grid){
  // TODO: Return true if this row,col is a winning move, otherwise false
  // Win condition : 4 in row, 4 in a col, 4 in a diagonal
  // row = 3, col = 4
  if (row < 0 || col < 0 || row >= height || col >= width)
    return false;

  var tmp = grid[row][col];
  grid[row][col] = currentColor;

  var count = 0;

  // Iterate through the columns
  for (var x = 0; x < width; x++) {
      if (grid[row][x] !== currentColor) {
          // Reset the count and continue the loop, there may be more
          count = 0;
      }
      else {
          // Increment the count
          count++;
          if (count >= 4) {
            grid[row][col] = tmp;
            return true;
          }
      }
  }
  // Reset
  count = 0;

  // Iterate through the rows
  for (var y = 0; y < height; y++) {
      if (grid[y][col] !== currentColor) {
          // Reset the count
          count = 0;
      }
      else {
          count ++;
          if (count >= 4) {
            grid[row][col] = tmp;
            return true;
          }
      }
  }
  count = 0;

  // Get the top left corner
  var topLeftRow = row - Math.min(row, col);
  var topLeftCol = col - Math.min(row, col);

  var i = 0;
  // Check if the topLeftRow is accessible in JS
  while (grid[topLeftRow + i] !== undefined) {
      // Otherwise we break out of the loop
      if (grid[topLeftRow + i][topLeftCol + i] === undefined)
          break;
      else if (grid[topLeftRow + i][topLeftCol + i] !== currentColor) {
          // Reset the counter
          count = 0;
      }
      else {
          count++;
          if (count >= 4) {
            grid[row][col] = tmp;
            return true;
          }
      }
      i++;
  }

  // Reset the count
  count = 0;
  // Case 1: If the sum of the row, col <= 6 achieve the row to be 0
  var topRightRow, topRightCol;
  if (row + col <= 6) {
      topRightRow = 0;
      topRightCol = col + row;
  }
  // Otherwise acheive the column to be equal to 6
  else {
      var difference = width - col - 1; // The difference we need for the top right corner is the width - col - 1
      topRightRow = row - difference;
      topRightCol = col + difference;
  }

  // Reset the index counter
  i = 0;
  while(grid[topRightRow + i] !== undefined) {
      if (grid[topRightRow + i][topRightCol - i] === undefined)
          break;
      else if (grid[topRightRow + i][topRightCol - i] !== currentColor)
          count = 0;
      else {
          count++;
          if (count >= 4){
            grid[row][col] = tmp;
            return true;
          }
      }
      i++;
  }
  // By default return false, the game still continues
  grid[row][col] = tmp;
  return false;
}



/*
 * Checks if move is possible in the column
 * Returns the row it is placed in or -1 if not possible
 */
function moveRow(col, grid){
  for (var row = height - 1; row >= 0; row--){
    if (!grid[row][col])
      return row;
  }
  return -1;
}



function copyGrid(grid){
  var copyGrid = [];
  for (var row = 0; row < height; row++){
    copyGrid.push([]);
    for (var col = 0; col < width; col++)
      // 0 means empty, 1 means first player (yellow), 2 means second player (red)
      copyGrid[row][col] = grid[row][col];
  }
  return copyGrid;
}

// player is either 1 or 2
function numWinningStates(player,grid){
  // TODO: Find number of winning states for player given grid
  var totalWinningStates = 4 * 6 + 3 * 7 + 12 * 2;
  var otherPlayer = 3 - player;

  // Check each row
  for (var row = 0; row < height; row++) {
    for (var col = 0; col <= width - 4; col++) {
      for (var i = 0; i < 4; i++) {
        // Refer to the other player we're looking at
        if (grid[row][col + i] === otherPlayer) {
          totalWinningStates--;
          break;
        }
      }
    }
  }

  // console.log("After rows: " + totalWinningStates);

  // Check each column
  for (var col = 0; col < width; col++) {
    for (var row = 0; row <= height - 4; row++) {
      for (var i = 0; i < 4; i++) {
        if (grid[row + i][col] === otherPlayer) {
          totalWinningStates--;
          break;
        }
      }
    }
  }

  // console.log("After cols: " + totalWinningStates);

  // Check from top left to bottom right
  // Below are the first 6 points to start
  var topLeftCoordinates = [
    new Point(2, 0),
    new Point(1, 0),
    new Point(0, 0),
    new Point(0, 1),
    new Point(0, 2),
    new Point(0, 3)
  ];

  for (var i = 0; i < topLeftCoordinates.length; i++) {
    var point = topLeftCoordinates[i];
    var row, tempRow, col, tempCol;

    row = tempRow = point.row;
    col = tempCol = point.col;

    // Only do the check if there are 4 available spaces ahead
    while (grid[row + 3] !== undefined) {
      if (grid[row + 3][col + 3] === undefined)
        break;
      tempRow = row;
      tempCol = col;
      // Check the next four points, if the other player has a piece at the point
      // then break out of the loop
      for (var j = 0; j < 4; j++) {
        if (grid[tempRow][tempCol] === otherPlayer) {
          totalWinningStates--;
          break;
        }
        tempRow++;
        tempCol++;
      }
      // Move onto the next point in the diagonal to check
      row++;
      col++;
    }
  }

  // Check from top right to bottom left
  // Below are the first 6 points to start
  var topRightCoordinates = [
    new Point(0, 3),
    new Point(0, 4),
    new Point(0, 5),
    new Point(0, 6),
    new Point(1, 6),
    new Point(2, 6)
  ];

  for (var i = 0; i < topRightCoordinates.length; i++) {
    var point = topRightCoordinates[i];
    var row, tempRow, col, tempCol;

    row = tempRow = point.row;
    col = tempCol = point.col;

    while (grid[row + 3] !== undefined) {
      if (grid[row + 3][col - 3] === undefined)
        break;
      tempRow = row;
      tempCol = col;
      for (var j = 0; j < 4; j++) {
        if (grid[tempRow][tempCol] === otherPlayer) {
          totalWinningStates--;
          break;
        }
        tempRow++;
        tempCol--;
      }
      row++;
      col--;
    }
  }
  return totalWinningStates;
}

// player is either 1 or 2
function numThreeInRow(player,grid){
  // TODO: Find number of three in a row states for player given grid
  var totalThreeInRow = 5 * 6 + 4 * 7 + 20 * 2;
  var otherPlayer = 3 - player;

  // Check each row
  for (var row = 0; row < height; row++) {
    for (var col = 0; col <= width - 3; col++) {
      for (var i = 0; i < 3; i++) {
        // Refer to the other player we're looking at
        if (grid[row][col + i] === otherPlayer) {
          totalThreeInRow--;
          break;
        }
      }
    }
  }

  // console.log("After rows: " + totalWinningStates);

  // Check each column
  for (var col = 0; col < width; col++) {
    for (var row = 0; row <= height - 3; row++) {
      for (var i = 0; i < 3; i++) {
        if (grid[row + i][col] === otherPlayer) {
          totalThreeInRow--;
          break;
        }
      }
    }
  }

  // console.log("After cols: " + totalWinningStates);

  // Check from top left to bottom right
  // Below are the first 8 points to start
  var topLeftCoordinates = [
    new Point(3, 0),
    new Point(2, 0),
    new Point(1, 0),
    new Point(0, 0),
    new Point(0, 1),
    new Point(0, 2),
    new Point(0, 3),
    new Point(0, 4)
  ];

  for (var i = 0; i < topLeftCoordinates.length; i++) {
    var point = topLeftCoordinates[i];
    var row, tempRow, col, tempCol;

    row = tempRow = point.row;
    col = tempCol = point.col;

    // Only do the check if there are 3 available spaces ahead
    while (grid[row + 2] !== undefined) {
      if (grid[row + 2][col + 2] === undefined)
        break;
      tempRow = row;
      tempCol = col;
      // Check the next three points, if the other player has a piece at the point
      // then break out of the loop
      for (var j = 0; j < 3; j++) {
        if (grid[tempRow][tempCol] === otherPlayer) {
          totalThreeInRow--;
          break;
        }
        tempRow++;
        tempCol++;
      }
      // Move onto the next point in the diagonal to check
      row++;
      col++;
    }
  }

  // Check from top right to bottom left
  // Below are the first 8 points to start
  var topRightCoordinates = [
    new Point(0, 2),
    new Point(0, 3),
    new Point(0, 4),
    new Point(0, 5),
    new Point(0, 6),
    new Point(1, 6),
    new Point(2, 6),
    new Point(3, 6)
  ];

  for (var i = 0; i < topRightCoordinates.length; i++) {
    var point = topRightCoordinates[i];
    var row, tempRow, col, tempCol;

    row = tempRow = point.row;
    col = tempCol = point.col;

    while (grid[row + 2] !== undefined) {
      if (grid[row + 2][col - 2] === undefined)
        break;
      tempRow = row;
      tempCol = col;
      for (var j = 0; j < 3; j++) {
        if (grid[tempRow][tempCol] === otherPlayer) {
          totalThreeInRow--;
          break;
        }
        tempRow++;
        tempCol--;
      }
      row++;
      col--;
    }
  }
  return totalThreeInRow;
}

// returns if grid is winning state for the player
// eseentially checking if grid contains a 4-in-a-row for the player
function winningState(player,grid){
  // Check the column, only need to check rows 0 to 2
  // If there is a winning state return true
  // console.log(grid);
  for (var col = 0; col < width; col++) {
    for (var row = 0; row < height - 3; row++) {
      // console.log("row : " + row + " col: " + col);
      // If the point is not the player, don't bother checking
      if (grid[row][col] !== player)
        continue;
      else {
        var count = 0;
        // Check the next 4 slots
        for (var i = 0; i < 4; i++) {
          if (grid[row][col] !== player) {
            break;
          }
          else {
            row++;
            count++;
          }
        }
        if (count === 4) { return true; }
      }
    }
  }

  // Check the rows, only need to check columns 0 to 3
  // If there are any winning states then return true
  for (var row = 0; row < height; row++) {
    for (var col = 0; col < width - 3; col++) {
      if (grid[row][col] !== player) {
        continue;
      }
      else {
        var count = 0;
        for (var i = 0; i < 4; i++) {
          if (grid[row][col] !== player) {
            break;
          }
          else {
            col++;
            count++;
          }
        }
        if (count == 4) { return true; }
      }
    }
  }

  // Check from the top left to the bottom right
  var topLeftCoordinates = [
    new Point(2, 0),
    new Point(1, 0),
    new Point(0, 0),
    new Point(0, 1),
    new Point(0, 2),
    new Point(0, 3)
  ];

  // Go through all of the top left coordinates
  for (var i = 0; i < topLeftCoordinates.length; i++) {
    var point = topLeftCoordinates[i];
    var row, tempRow, col, tempCol;

    row = tempRow = point.row;
    col = tempCol = point.col;

    // Check if the fourth space ahead exists
    while (grid[row + 3] !== undefined) {
      if (grid[row][col] === undefined)
        break;
      tempRow = row;
      tempCol = col;
      var count = 0;
      // Check if the next 4 is the winning move
      for (var j = 0; j < 4; j++) {
        if(grid[tempRow][tempCol] === player) {
          count++;
          tempRow++;
          tempCol++;
          if (count >= 4) {
            // TODO: Check if this screws up
            // console.log("Top Left -> Bottom Right Count: " + count);
            return true;
          }
        }
        else {
          break;
        }
      }
      row++;
      col++;
    }

    // Check from the top right to bottom left
    var topRightCoordinates = [
      new Point(0, 3),
      new Point(0, 4),
      new Point(0, 5),
      new Point(0, 6),
      new Point(1, 6),
      new Point(2, 6)
    ];

    // Go through all possible top right coordinates
    for (var i = 0; i < topRightCoordinates.length; i++) {
      var point = topRightCoordinates[i];
      var row, tempRow, col, tempCol;

      row = tempRow = point.row;
      col = tempCol = point.col;

      while (grid[row + 3] !== undefined) {
        if (grid[row + 3][col - 3] === undefined)
          break;
        tempRow = row;
        tempCol = col;
        var count = 0;
        for (var j = 0; j < 4; j++) {
          if (grid[tempRow][tempCol] === player) {
            count++;
            tempRow++
            tempCol--;
            if (count >= 4) {
              // TODO: Check if this screws up
              // console.log("Top Right -> Bottom left Count: " + count);
              return true;
            }
          }
          else {
            break;
          }
        }
        row++;
        col--;
      }
    }

    // After checking all of the cases, we determine that this board is not
    // a winning board
    return false;
  }
}

// Checks if the grid is full
function isGridFull(grid) {
  for (var row = 0; row < height; row++) {
    for (var col = 0; col < width; col++) {
      if (grid[row][col] === 0)
        return false;
    }
  }
  return true;
}

function numberThreats(player,grid){
  var totalThreats = 0;
  for (var col = 0; col < width; col++){
    var row = moveRow(col,grid);
    if (row > 0){
      if (playerWon(row-1,col,player,grid))
        totalThreats++;
    }
  }
  return totalThreats;
}
