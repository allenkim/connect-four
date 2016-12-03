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

// player is either 1 or 2
function numWinningStates(player,grid){
  // TODO: Find number of winning states for player given grid
}

// returns if grid is winning state for the player
// eseentially checking if grid contains a 4-in-a-row for the player
function winningState(player,grid){
  // TODO: implement this
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
