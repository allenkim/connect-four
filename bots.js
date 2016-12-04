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
    if (moveRow(col))
      return col;
  }
}

// Basic bot that will win when possible or block if enemy is going to win
// Otherwise, it plays randomly
bots["Basic_Bot"] = function(){
  for (var col = 0; col < width; col++){
    var row = moveRow(col);
    if (row !== -1 && playerWon(row,col,playerTurn,grid)){
      return col;
    }
  }
  for (var col = 0; col < width; col++){
    var row = moveRow(col);
    if (row !== -1 && playerWon(row,col,3-playerTurn,grid)){
      return col;
    }
  }
  while (!gameOver){
    var col = Math.floor(Math.random() * 7);
    if (moveRow(col) !== -1)
      return col;
  }
}

// Custom Object with a constructor
class Point {
  constructor(row, col) {
    this.row = row;
    this.col = col;
  }
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
        if (grid[row][col] === otherPlayer) {
          totalWinningStates--;
          break;
        }
      }
    }
  }

  // Check each column
  for (var col = 0; col < width; col++) {
    for (var row = 0; row <= height - 4; row++) {
      for (var i = 0; i < 4; i++) {
        if (grid[row][col] === otherPlayer) {
          totalWinningStates--;
          break;
        }
      }
    }
  }

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
  ]

  for (var i = 0; i < topRightCoordinates.length; i++) {
    var point = topRightCoordinates[i];
    var row, tempRow, col, tempCol;

    row = tempRow = point.row;
    col = tempCol = point.col;

    while (grid[row + 3] !== undefined) {
      if (grid[row + 3][col + 3] === undefined)
        break;
      for (var j = 0; j < 4; j++) {
        if (grid[tempRow][tempCol] === otherPlayer) {
          totalWinningStates--;
          break;
        }
        tempRow++;
        tempCol--;
      }
    }

    row++;
    col--;
  }
}

// returns if grid is winning state for the player
// eseentially checking if grid contains a 4-in-a-row for the player
function winningState(player,grid){
  // TODO: implement this
  // Check the column, only need to check rows 0 to 2
  // If there is a winning state return true
  for (var row = 0; row < height / 2; row++) {
    for (var col = 0; col < width; width++) {
      // If the point is not the player, don't bother checking
      if (grid[row][col] !== player) {
        continue;
      }
      else {
        var count = 0;
        var tempRow = row;
        for (var i = 0; i < 4; i++) {
          if (grid[tempRow][col] === player) {
            count++;
          }
          else {
            break;
          }
          if (count >= 4) {
            return true;
          }
        }
      }
    }
  }
}

function heuristic(row,col,grid){
  if (winningState(1,grid))
    return Infinity;

  if (winningState(2,grid))
    return -Infinity;

  // Number of ways player 1 can win - number of ways player 2 can win
  return numWinningStates(1,grid) - numWinningStates(2,grid);
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

// returns best move with heuristic
function minimax(move, depth, player){
  // TODO: Implement minimax
  // move should be {grid: new grid state, value: heuristic}?
}

// Player 1 is max, player 2 is min
bots["Minimax_Bot"] = function(){
  //var move = minimax(copyGrid(grid), 5, playerTurn);
  //return move.col;
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
