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


function heuristic(grid){
  if (winningState(1,grid))
    return Infinity;

  if (winningState(2,grid))
    return -Infinity;

  // Number of ways player 1 can win - number of ways player 2 can win
  return numWinningStates(1,grid) - numWinningStates(2,grid) + (Math.random()-0.5)*0.001;
}

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
    if (depth === minimaxDepth)
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
    if (depth === minimaxDepth)
      return bestColumn;

    return bestValue;
  }
}

// Deepest check for our state space graph
var minimaxDepth = 5;

// Player 1 is max, player 2 is min
bots["Minimax_Bot"] = function(){
  return minimax(copyGrid(grid), minimaxDepth, playerTurn);
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
