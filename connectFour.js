var height = document.getElementById('grid_div').offsetHeight / boxSize;
var width = document.getElementById('grid_div').offsetWidth / boxSize;
var tick; // for setInterval

var grid = []; // grid representing the Connect Four board
for (var row = 0; row < height; row++){
  grid.push([]);
  for (var col = 0; col < width; col++)
    // 0 means empty, 1 means first player (yellow), 2 means second player (red)
    grid[row][col] = 0;
}

/* botPlaying
 * 0: bot is not playing
 * 1: bot is playing as player 1
 * 2: bot is playing as player 2
 * 3: bot is playing as both players
 */
var botPlaying = 0;

// playerTurn is either 1 or 2, indicating the player whose turn it is
var playerTurn = 1;

// Boolean to indicate if game is over or not
var gameOver = false;

/*
 * Checks if the given row and column includes a four in a row
 * If so, return true (the player won)
 * else, return false
 */
function playerWon(row,col){
  // TODO: Return true if this row,col is a winning move, otherwise false
  // Win condition : 4 in row, 4 in a col, 4 in a diagonal
  // row = 3, col = 4

  var currentColor = grid[row][col];
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
      var difference = width - col; // The difference we need for the top right corner is the width - col
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
              return true;
          }
      }
      i++;
  }
  // By default return false, the game still continues
  return false;
}

/*
 * Takes in a column and attempts to make a move there
 */
function makeMove(col){
  // if game is over, then moves are not allowed
  if (gameOver)
    return false;
  // we check from the bottom up to see if a move can be played
  for (var row = height - 1; row >= 0; row--){
    if (!grid[row][col]){
      grid[row][col] = playerTurn;
      if (playerWon(row,col)){
        gameOver = true;
        var game_end = document.getElementById('game_end');
        game_end.childNodes[1].innerHTML = "Player " + playerTurn + " wins!";
        game_end.style.display = 'block';
      }
      else{
        playerTurn = 3 - playerTurn; // toggles between player 1 and 2
        document.getElementById('player_turn').innerHTML = "Player " + playerTurn + "'s Move";
      }
      drawGrid();
      return true;
    }
  }
  return false;
}

/*
 * Draws the current state of the grid variable onto the browser
 * This should be called every time the grid is updated
 * NOTE:0 means empty, 1 means first player (yellow), 2 means second player (red)
 */
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

/*
 * Clears the grid and clear browser circles (make the cirles white)
 * Also resets the player turn to 1 and sets gameOver to false
 */
function resetGrid(){
  document.getElementById('game_end').style.display = 'none';
  playerTurn = 1;
  document.getElementById('player_turn').innerHTML = "Player 1's Move";
  gameOver = false;
  for (var row = 0; row < height; row++){
    for (var col = 0; col < width; col++){
      grid[row][col] = 0;
    }
  }
  drawGrid();
}
