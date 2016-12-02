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

// playerTurn is either 1 or 2, indicating the player whose turn it is
var playerTurn = 1;

// Move number is a counter of the moves that goes up to 42
var moveNumber = 1;

// Boolean to indicate if game is over or not
var gameOver = false;

// Boolean whether bot is computing a move right now
var botThinking = false;

/* botTurn indicates which players are bots
 * 0: bot is not playing
 * 1: bot is playing as player 1
 * 2: bot is playing as player 2
 * 3: bot is playing as both players
 */
var botTurn = 0;
document.getElementById('h_v_h').onclick = function() {
  if (botTurn !== 0){
    botTurn = 0;
  }
};
document.getElementById('h_v_b').onclick = function() {
  if (botTurn !== 1){
    botTurn = 1;
    if (playerTurn == 1)
      makeBotMove();
  }
};
document.getElementById('b_v_h').onclick = function() {
  if (botTurn !== 2){
    botTurn = 2;
    if (playerTurn == 2)
      makeBotMove();
  }
};
document.getElementById('b_v_b').onclick = function() {
  if (botTurn !== 3){
    botTurn = 3;
    makeBotMove();
  }
};

/*
 * Computes the column the bot will make its next move in
 */
function computeBotMove(){
  for (var col = 0; col < width; col++){
    var row = moveRow(col);
    if (row !== -1)
      return col;
  }
}

/*
 * makeBotMove makes a move for the bot
 */
function makeBotMove(){
  if (botThinking || (botTurn !== 3 && botTurn !== playerTurn))
    return false;

  var col = computeBotMove();
  makeMove(col,true);
}

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
 * Checks if move is possible in the column
 * Returns the row it is placed in or -1 if not possible
 */
function moveRow(col){
  for (var row = height - 1; row >= 0; row--){
    if (!grid[row][col])
      return row;
  }
  return -1;
}

/*
 * Takes in a column and attempts to make a move there
 * isBot is a boolean that is false by default
 * it should be true when called by bots
 */
function makeMove(col,isBot){
  var isBot = (typeof isBot !== 'undefined') ?  isBot : false;

  // if game is over or its the bot's turn and the move, then moves are not allowed
  if (gameOver || (!isBot && (botTurn === 3 || botTurn === playerTurn)))
    return false;

  // we check from the bottom up to see if a move can be played
  var row = moveRow(col);
  if (row !== -1){
    grid[row][col] = playerTurn;
    moveNumber++;
    if (moveNumber === width*height || playerWon(row,col)){
      gameOver = true;
      var game_end = document.getElementById('game_end');
      game_end.childNodes[1].innerHTML = "Player " + playerTurn + " wins!";
      game_end.style.display = 'block';
    }
    else{
      playerTurn = 3 - playerTurn; // toggles between player 1 and 2
      document.getElementById('player_turn').innerHTML = "Player " + playerTurn + "'s Move";
      makeBotMove();
    }
    drawGrid();
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
  makeBotMove();
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
