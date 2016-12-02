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

  return Math.random() < 0.5;
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
