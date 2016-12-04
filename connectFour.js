var height = document.getElementById('grid_div').offsetHeight / boxSize - 1;
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

// Boolean to check if move is being made
var makingMove = false;
// Boolean whether bot is computing a move right now
var botThinking = false;
// Minimum number of milliseconds bots have to take before making a move
var botDelay = 100;
// players[1] is the first player and players[2] is the second player
var players = [,"Human", "Human"]

// Onclick events for the radio button selection
document.getElementById("human_1").onclick = function() {
  players[1] = "Human";
};
document.getElementById("human_2").onclick = function() {
  players[2] = "Human";
};

var bots = {}
// Object of all different bots made

/*
 * makeBotMove makes a move for the bot
 */
function makeBotMove(){
  if (botThinking || (players[playerTurn] === "Human"))
    return false;
  botThinking = true;
  var thinking = setTimeout(function(){
    botThinking = false;
    makeBotMove();
  },botDelay)
  var col = bots[players[playerTurn]]();
  makeMove(col,true);
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
  if (makingMove){
    return false;
  }
  var isBot = (typeof isBot !== 'undefined') ?  isBot : false;

  // if game is over or its the bot's turn and the player move, then moves are not allowed
  if (gameOver || (!isBot && (players[playerTurn] !== "Human")))
    return false;

  // we check from the bottom up to see if a move can be played
  var row = moveRow(col);
  if (row !== -1){
    makingMove = true;
    grid[row][col] = playerTurn;
    if (moveNumber === width*height || playerWon(row,col,playerTurn,grid)){
      var game_end = document.getElementById('game_end');
      if (moveNumber === width*height)
        game_end.childNodes[1].innerHTML = "Draw!";
      else{
        game_end.childNodes[1].innerHTML = "Player " + playerTurn + " wins!";
      }
      game_end.style.display = 'block';
      gameOver = true;
      drawGrid();
    }
    else{
      var drop = document.getElementById('drop-'+col);
      drop.setAttribute("fill-opacity",1);
      drop.setAttribute("fill",playerTurn===1?"yellow":"red");
      TweenLite.to(drop, 0.5, {x:0, y:(row+1)*100, ease:Linear.easeNone, onComplete: function(){
        playerTurn = 3 - playerTurn; // toggles between player 1 and 2
        document.getElementById('player_turn').innerHTML = "Player " + playerTurn + "'s Move";
        makeBotMove();
        drawGrid();
        makingMove = false;
      }});
      TweenLite.set(drop, {clearProps:"x, y"});
    }
    moveNumber++;
  }
}

/*
 * Clears the grid and clear browser circles (make the cirles white)
 * Also resets the player turn to 1 and sets gameOver to false
 */
function resetGrid(){
  document.getElementById('game_end').style.display = 'none';
  playerTurn = 1;
  moveNumber = 1;
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
      if (color !== 'white'){
        cell.setAttribute('fill-opacity','1');
        cell.setAttribute('fill',color);
      }
      else{
        console.log(row+'-'+col);
        cell.setAttribute('fill-opacity','0');
      }
    }
  }
}
