/* Variables to keep in mind
* grid: 2D array of the state of the game
* playerTurn: number of current player
* height: height of the grid
* width: width of the grid
*/

/*
* Helper Functions:
* moveRow(col): returns the row that would be played if col is played
*               if col is full, returns -1
* playerWon(row,col,color): returns if player wins by playing color on the
*                           specified row, column
*/

// All bots computes the column it will make its next move in

// Basic bot that will randomly choose an available column
bots["Pure_Random_Bot"] = function(){
  while (!gameOver){
    var col = Math.floor(Math.random() * 7);
    if (moveRow(col,grid))
    return col;
  }
}

// Basic bot that will win when possible or block if enemy is going to win
// Otherwise, it plays randomly
bots["Basic_Bot"] = function(){
  for (var col = 0; col < width; col++){
    var row = moveRow(col,grid);
    if (row !== -1 && playerWon(row,col,playerTurn,grid)){
      return col;
    }
  }
  for (var col = 0; col < width; col++){
    var row = moveRow(col,grid);
    if (row !== -1 && playerWon(row,col,3-playerTurn,grid)){
      return col;
    }
  }
  while (!gameOver){
    var col = Math.floor(Math.random() * 7);
    if (moveRow(col,grid) !== -1)
    return col;
  }
}

// Custom Object with a constructor
var Point = function(row,col){
  this.row = row;
  this.col = col;
}

// player is either 1 or 2
function numWinningStates(player,grid){
  // TODO: Find number of winning states for player given grid
  var totalWinningStates = 4 * 6 + 3 * 7 + 24;
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

function heuristic(grid){
  if (winningState(1,grid))
    return Infinity;

  if (winningState(2,grid))
    return -Infinity;

  // Number of ways player 1 can win - number of ways player 2 can win
  return numWinningStates(1,grid) - numWinningStates(2,grid) + (Math.random()-0.5)*0.001;
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

// Deepest check for our state space graph
var maxDepth = 5;

// returns best move with heuristic
function minimax(grid, depth, player){
  if (depth === 0 || isGridFull(grid) || winningState(1, grid) || winningState(2, grid)) {
    return heuristic(grid);
  }
  var bestColumn = 0;
  for (var col = 0; col  < width; col++){
    var row = moveRow(col,grid);
    if (row !== -1){
      bestColumn = col;
      break;
    }
  }
  // Max's turn
  if (player === 1) {
    var bestValue = -Infinity;
    for (var col = 0; col < width; col++) {
      // Stores the row position if played at the column
      var row = moveRow(col,grid);
      // if it's a valid move
      if (row !== -1) {
        var copiedGrid = copyGrid(grid);
        // Update the coordinates to have the player
        copiedGrid[row][col] = player;
        var currentValue = minimax(copiedGrid, depth - 1, 2);
        if (currentValue > bestValue) {
          bestValue = currentValue;
          bestColumn = col;
        }
      }
    }
    if (depth === maxDepth)
      return bestColumn;

    return bestValue;
  }
  // Min's turn
  else {
    var bestValue = Infinity;
    for (var col = 0; col < width; col++) {
      // Stores the row position if played at the column
      var row = moveRow(col,grid);
      // if it's a valid move
      if (row !== -1) {
        var copiedGrid = copyGrid(grid);
        // Update the coordinates to have the player
        copiedGrid[row][col] = player;
        var currentValue = minimax(copiedGrid, depth - 1, 1);
        if (currentValue < bestValue) {
          bestValue = currentValue;
          bestColumn = col;
        }
      }
    }
    if (depth === maxDepth)
      return bestColumn;

    return bestValue;
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

// Player 1 is max, player 2 is min
bots["Minimax_Bot"] = function(){
  return minimax(copyGrid(grid), maxDepth, playerTurn);
}

var player_options = document.getElementsByClassName("player_options");
for (var i = 1; i <= 2; i++){
  for (var bot in bots){
    if (!bots.hasOwnProperty(bot))
      continue;
    var id = bot+'_'+i;
    var button_div = document.createElement('div');
    button_div.setAttribute('class','left_align');
    var option = document.createElement('input');
    option.setAttribute('type','radio');
    option.setAttribute('id', id);
    option.setAttribute('name','options_'+i);
    var label = document.createElement('label')
    label.setAttribute('for', id);
    label.innerHTML = bot;
    button_div.appendChild(option);
    button_div.appendChild(label);
    player_options[i-1].appendChild(button_div);
    (function(i,id, bot){
      document.getElementById(id).onclick = function() {
        players[i] = bot;
        makeBotMove();
      };
    })(i,id, bot);
  }
}
