class GameNode {
  constructor(player, col, grid) {
    this.grid = grid;
    this.col = col;
    this.player = player;
    this.visits = 0;
    this.value = 0;
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
  var numSimulations = 200;
  var simulationPerNode = 80;
  for (var n = 0; n < numSimulations; n++){
    var newNode = treePolicy(player, tree.getRoot);
    for (var m = 0; m < simulationPerNode; m++){
      var simulatonResult = defaultPolicy(newNode.player,newNode.grid);
      backupNegamax(newNode,simulatonResult);
    }
  }
  var child = bestChild(player, tree.getRoot,0);
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

function treePolicy(player, node){
  var curr = node;
  var currGrid = node.grid;
  while (!terminalState(currGrid)){
    if (!isFullyExpanded(curr)){
      return expand(curr);
    }
    else{
      curr = bestChild(player, curr, 1);
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
  var uctVal = node.value / node.visits + c * Math.sqrt(2 * Math.log(node.parent.visits) / node.visits);
  return uctVal;
}

function bestChild(player, node, c){
  var best = node.children[0];
  var bestVal = UCT(best,c);
  if (c === 0){
    //console.log(player, best.col, best.value, best.visits, bestVal);
  }
  if (player === 1){
    for (var i = 1; i < node.children.length; i++){
      var child = node.children[i];
      var childVal = UCT(child,c);
      if (c === 0){
        //console.log(player, child.col, child.value, child.visits, childVal);
      }
      if (childVal > bestVal){
        bestVal = childVal;
        best = child;
      }
    }
  }
  else if (player === 2){
    for (var i = 1; i < node.children.length; i++){
      var child = node.children[i];
      var childVal = UCT(child,c);
      if (c === 0){
        //console.log(player, child.col, child.value, child.visits, childVal);
      }
      if (childVal < bestVal){
        bestVal = childVal;
        best = child;
      }
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
  if (winningState(1,grid))
    return 1;
  if (winningState(2,grid))
    return -1;
  while (!isGridFull(newGrid)){
    var col = bots["Decent_Bot"](playerTurn, newGrid);
    var row = moveRow(col,newGrid);
    if (playerWon(row,col,playerTurn,newGrid)){
      return (playerTurn === 1) ? 1 : -1;
    }
    newGrid[row][col] = playerTurn;
    playerTurn = 3 - playerTurn;
  }
  return 0;
}

function backupNegamax(node, value){
  var curr = node;
  var currVal = value;
  if (node.player === 2)
    currVal = -value;
  while (curr !== null){
    curr.visits++;
    curr.value += value;
    currVal = -currVal;
    curr = curr.parent;
  }
}
