// All bots computes the column it will make its next move in

// Object of all different bots made
var bots = {}

// Basic bot that will randomly choose an available column
bots["Pure_Random_Bot"] = function(grid){
  var width = grid[0].length;
  while (!gameOver){
    var col = Math.floor(Math.random() * width);
    if (moveRow(col,grid))
    return col;
  }
}

// Basic bot that will win when possible or block if enemy is going to win
// Otherwise, it plays randomly
bots["Basic_Bot"] = function(grid){
  var width = grid[0].length;
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
    return 1000;

  if (winningState(2,grid))
    return -1000;

  // Number of ways player 1 can win - number of ways player 2 can win
  return numWinningStates(1,grid) - numWinningStates(2,grid) + (Math.random()-0.5)*0.001;
}

// returns best move with heuristic
function minimax(grid, depth, player){
  var width = grid[0].length;
  if (depth === 0 || isGridFull(grid) || winningState(1, grid) || winningState(2, grid)) {
    var maxWin = winningState(1,grid);
    var minWin = winningState(2, grid);
    var gridFull = isGridFull(grid);
    if (depth === 0 || maxWin || minWin || gridFull) {
      if (maxWin)
        return 1000 + depth;
      else if (minWin)
        return -1000 - depth;
      else
        return heuristic(grid);
    }
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
bots["Minimax_Bot"] = function(grid){
  return minimax(copyGrid(grid), minimaxDepth, playerTurn);
}

// returns best move with heuristic
function alphabeta(grid, depth, alpha, beta, player){
  var width = grid[0].length;
  var maxWin = winningState(1,grid);
  var minWin = winningState(2, grid);
  var gridFull = isGridFull(grid);
  if (depth === 0 || maxWin || minWin || gridFull) {
    if (maxWin)
      return 1000 + depth;
    else if (minWin)
      return -1000 - depth;
    else
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
        var currentValue = alphabeta(copiedGrid, depth - 1, alpha, beta, 2);
        if (currentValue > bestValue) {
          bestValue = currentValue;
          bestColumn = col;
        }
        alpha = Math.max(alpha, bestValue);
        if (beta <= alpha)
          break;
      }
    }
    if (depth === alphabetaDepth)
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
        var currentValue = alphabeta(copiedGrid, depth - 1, alpha, beta, 1);
        if (currentValue < bestValue) {
          bestValue = currentValue;
          bestColumn = col;
        }
        beta = Math.min(beta, bestValue);
        if (beta <= alpha)
          break;
      }
    }
    if (depth === alphabetaDepth)
      return bestColumn;

    return bestValue;
  }
}

// Deepest check for our state space graph
var alphabetaDepth = 6;

// Player 1 is max, player 2 is min
bots["AlphaBeta_Bot"] = function(grid){
  return alphabeta(copyGrid(grid), alphabetaDepth, -Infinity, Infinity, playerTurn);
}
