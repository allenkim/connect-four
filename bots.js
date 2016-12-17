// All bots computes the column it will make its next move in

// Object of all different bots made
var bots = {}

// Basic bot that will randomly choose an available column
bots["Pure_Random_Bot"] = function(playerTurn, grid){
  var width = grid[0].length;
  while (!isGridFull(grid)){
    var col = Math.floor(Math.random() * width);
    if (moveRow(col,grid) !== -1)
      return col;
  }
}

// Basic bot that will win when possible or block if enemy is going to win
// Otherwise, it plays randomly
bots["Basic_Bot"] = function(playerTurn, grid){
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
  while (!isGridFull(grid)){
    var col = Math.floor(Math.random() * 7);
    if (moveRow(col,grid) !== -1)
      return col;
  }
}

// Decent bot is like Basic bot but also checks to avoid threats
// Otherwise, it plays randomly
bots["Decent_Bot"] = function(playerTurn, grid){
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
  var goodCols = [];
  var okayCols = [];
  var badCols = [];
  for (var col = 0; col < width; col++){
    var row = moveRow(col,grid);
    if (row === 0){
      goodCols.push(col);
    }
    else if (row > 0){
      if (playerWon(row-1,col,3-playerTurn,grid))
        badCols.push(col);
      else if (playerWon(row-1,col,playerTurn,grid))
        okayCols.push(col);
      else
        goodCols.push(col);
    }
  }
  var avail = goodCols;
  if (goodCols.length === 0){
    avail = okayCols;
    if (okayCols.length === 0){
      avail = badCols;
    }
  }

  while (!isGridFull(grid)){
    var col = avail[Math.floor(Math.random() * avail.length)];
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
bots["Minimax_Bot"] = function(playerTurn, grid){
  return minimax(copyGrid(grid), minimaxDepth, playerTurn);
}

function updatedHeuristic(grid){
  if (winningState(1,grid))
    return 1000;

  if (winningState(2,grid))
    return -1000;

  // Number of three in a rows for player 1 - player 2
  // var threeHeuristic = numThreeInRow(1,grid) - numThreeInRow(2,grid);
  // Number of ways player 1 can win - number of ways player 2 can win
  var fourHeuristic = numWinningStates(1,grid) - numWinningStates(2,grid);
  // Number of totalThreats
  var threatHeuristic = numberThreats(1,grid) - numberThreats(2,grid);
  return threatHeuristic * 12.5 + fourHeuristic + (Math.random()-0.5)*0.001;
}

// returns best move with heuristic
function alphabeta(grid, depth, alpha, beta, player, heuristic){
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
  var order = [3,2,4,1,5,0,6]
  // Max's turn
  if (player === 1) {
    var bestValue = -Infinity;
    for (var i = 0; i < width; i++) {
      var col = order[i];
      // Stores the row position if played at the column
      var row = moveRow(col,grid);
      // if it's a valid move
      if (row !== -1) {
        var copiedGrid = copyGrid(grid);
        // Update the coordinates to have the player
        copiedGrid[row][col] = player;
        var currentValue = alphabeta(copiedGrid, depth - 1, alpha, beta, 2, heuristic);
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
    for (var i = 0; i < width; i++) {
      var col = order[i];
      // Stores the row position if played at the column
      var row = moveRow(col,grid);
      // if it's a valid move
      if (row !== -1) {
        var copiedGrid = copyGrid(grid);
        // Update the coordinates to have the player
        copiedGrid[row][col] = player;
        var currentValue = alphabeta(copiedGrid, depth - 1, alpha, beta, 1, heuristic);
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
var alphabetaDepth = 8;

// Player 1 is max, player 2 is min
bots["AlphaBeta_Bot"] = function(playerTurn, grid){
  return alphabeta(copyGrid(grid), alphabetaDepth, -Infinity, Infinity, playerTurn, heuristic);
}

// Player 1 is max, player 2 is min
bots["AlphaBeta_Bot_v2"] = function(playerTurn, grid){
  return alphabeta(copyGrid(grid), alphabetaDepth, -Infinity, Infinity, playerTurn, updatedHeuristic);
}

bots["MCTS_Bot"] = function(playerTurn, grid){
  return mcts(playerTurn, grid);
}
