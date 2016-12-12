class GameNode {
  constructor(player, grid) {
    this.grid = grid;
    this.player = player;
    this.visits = 1;
    this.wins = 0;
    this.children = [];
    this.parent = null;
  }
}

class GameTree {
  constructor() {
    var height = 6;
    var width = 7;
    var grid = []; // grid representing the Connect Four board
    for (var row = 0; row < height; row++){
      grid.push([]);
      for (var col = 0; col < width; col++)
        // 0 means empty, 1 means first player (yellow), 2 means second player (red)
        grid[row][col] = 0;
    }
    this.root = new GameNode(1, grid); // 1 means that the empty grid is the player 1's turn
  }
  get getRoot() {
    return this.root;
  }
  get bestMove() {
    var col = this.roots[0].col;
    var visits = this.roots[0].visits;
    for (var i = 1; i < this.roots.length; i++){
      var root = this.roots[i];
      if (root.visits > visits){
        visits = root.visits;
        col = root.col;
      }
    }
    return col;
  }

}

function figureOutMove(grid, newGrid){
  var height = grid.length;
  var width = grid[0].length;
  for (var row = height - 1; row >= 0; row--){
    for (var col = 0; col < width; col++){
      if (grid[row][col] !== newGrid[row][col])
        return col;
    }
  }
  return -1;
}

function mcts(player,grid){
  var tree = new GameTree();
  var numSimulations = 5000;
  for (var n = 0; n < numSimulations; n++){
    var newNode = treePolicy(tree.getRoot);
    var simulatonResult = defaultPolicy(player,newNode.grid);
    backupNegamax(newNode,simulatonResult);
  }
  var child = bestChild(tree.getRoot,0);
  return figureOutMove(grid, child.grid);
}

function isFullyExpanded(node){
  var grid = node.grid;
  var width = grid[0].length;
  var totalChildren = 0;
  for (var col = 0; col < width; col++){
    var row = moveRow(col,grid);
    if (row !== -1){
      totalChildren++;
    }
  }
  return (totalChildren === node.children.length);
}

function treePolicy(node){
  var CONSTANT = 1;
  var curr = node;
  var currGrid = node.grid;
  while (!terminalState(currGrid)){
    if (!isFullyExpanded(curr)){
      return expand(curr);
    }
    else{
      curr = bestChild(curr, CONSTANT);
    }
  }
  return curr;
}

function expand(node){
  var grid = node.grid;
  var player = node.player;
  var width = grid[0].length;
  for (var col = 0; col < width; col++){
    var row = moveRow(col,grid);
    if (row !== -1){
      var newGrid = copyGrid(grid);
      newGrid[row][col] = player;
      var newNode = new GameNode(3 - player, newGrid);
      newNode.parent = node;
      node.children.push(newNode);
    }
  }
  return newNode;
}

function UCT(node,c){
  return node.wins / node.visits + c * Math.sqrt(2 * Math.log(node.parent.visits) / node.visits);
}

function bestChild(node, c){
  var best = node.children[0];
  var bestVal = UCT(best,c);
  for (var i = 1; i < node.children.length; i++){
    var child = node.children[i];
    var childVal = UCT(child,c);
    if (childVal > bestVal){
      bestVal = childVal;
      best = child;
    }
  }
  return best;
}

function defaultPolicy(player,grid){
  var width = grid[0].length;
  var height = grid.length;
  var playerTurn = player;
  var makingMove = false;
  var newGrid = copyGrid(grid);
  while (!isGridFull(newGrid)){
    var col = bots["Pure_Random_Bot"](newGrid);
    var row = moveRow(col,newGrid);
    if (playerWon(row,col,playerTurn,newGrid))
      return (player === playerTurn);
    newGrid[row][col] = playerTurn;
    playerTurn = 3 - playerTurn;
  }
  return 0.5;
}

function backupNegamax(node, value){
  var curr = node;
  while (curr.parent !== null){
    curr.visit++;
    curr.wins += value;
    value = -value;
    curr = curr.parent;
  }
}
