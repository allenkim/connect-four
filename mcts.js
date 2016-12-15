class GameNode {
  constructor(player, col, grid) {
    this.grid = grid;
    this.col = col;
    this.player = player;
    this.visits = 0;
    this.wins = 0;
    this.children = [];
    this.parent = null;
  }
}

class GameTree {
  constructor(player,grid) {
    this.root = new GameNode(player, null, grid);
  }
  get getRoot() {
    return this.root;
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
  var tree = new GameTree(player,grid);
  var numSimulations = 10000;
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
  var curr = node;
  var currGrid = node.grid;
  while (!terminalState(currGrid)){
    if (!isFullyExpanded(curr)){
      return expand(curr);
    }
    else{
      curr = bestChild(curr, 1);
      currGrid = curr.grid;
    }
  }
  return curr;
}

function expand(node){
  var grid = node.grid;
  var player = node.player;
  var width = grid[0].length;
  var colList = node.children.map(function(node){
    return node.col;
  });
  for (var col = 0; col < width; col++){
    if (colList.indexOf(col) > -1)
      continue;
    var row = moveRow(col,grid);
    if (row !== -1){
      var newGrid = copyGrid(grid);
      newGrid[row][col] = player;
      var newNode = new GameNode(3 - player, col, newGrid);
      newNode.parent = node;
      node.children.push(newNode);
      return newNode;
    }
  }
}

function UCT(node,c){
  return node.wins / node.visits + c * Math.sqrt(2 * Math.log(node.parent.visits) / node.visits);
}

function bestChild(node, c){
  var best = node.children[0];
  var bestVal = UCT(best,c);
  if (c === 0){
    console.log(c, best.col, best.wins, best.visits);
  }
  for (var i = 1; i < node.children.length; i++){
    var child = node.children[i];
    var childVal = UCT(child,c);
    if (c === 0){
      console.log(c, child.col, child.wins, child.visits);
    }
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
    var col = bots["Basic_Bot"](playerTurn, newGrid);
    var row = moveRow(col,newGrid);
    if (playerWon(row,col,playerTurn,newGrid))
      return (player === playerTurn) ? 1 : 0;
    newGrid[row][col] = playerTurn;
    playerTurn = 3 - playerTurn;
  }
  return 0.5;
}

function backupNegamax(node, value){
  var curr = node;
  while (curr !== null){
    curr.visits++;
    curr.wins += value;
    curr = curr.parent;
  }
}
