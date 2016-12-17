var height = 6;
var width = 7;

var grid = []; // grid representing the Connect Four board
for (var row = 0; row < height; row++){
  grid.push([]);
  for (var col = 0; col < width; col++)
    // 0 means empty, 1 means first player (yellow), 2 means second player (red)
    grid[row][col] = 0;
}

function createTable(tableData) {
  var table =document.getElementById("table_results")
  var tableBody = document.createElement('tbody');

  tableData.forEach(function(rowData) {
    var row = document.createElement('tr');

    rowData.forEach(function(cellData) {
      var cell = document.createElement('td');
      cell.appendChild(document.createTextNode(cellData));
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
}

function deleteTable(){
  var table = document.getElementById("table_results");
  var tableBody = table.childNodes;
  if (tableBody.length > 0)
    table.removeChild(tableBody[0]);
}

function clearGrid(){
  for (var row = 0; row < height; row++)
    for (var col = 0; col < width; col++)
      grid[row][col] = 0;
}

function simulateGame(){
  clearGrid();
  var moveNumber = 1;
  var playerTurn = 1;
  var makingMove = false;
  while (moveNumber <= width*height){
    var col = bots[players[playerTurn]](playerTurn,grid);
    var row = moveRow(col,grid);
    if (playerWon(row,col,playerTurn,grid))
      return playerTurn;
    grid[row][col] = playerTurn;
    playerTurn = 3 - playerTurn;
    moveNumber++;
  }
  return 0;
}

function runSimulations(){
  deleteTable();
  var NUMBER_SIMULATIONS = document.getElementById("num_simulations").value;
  var player1_Wins = 0;
  var player2_Wins = 0;
  var draws = 0;
  for (var i = 1; i <= NUMBER_SIMULATIONS; i++){
    var winningPlayer = simulateGame();
    if (winningPlayer === 1)
      player1_Wins++;
    else if (winningPlayer === 2)
      player2_Wins++;
    else
      draws++;
    console.log(i + " simulations run...");
  }
  var results = [
    ["Players","Number of Wins","Number of Losses","Draws"],
    ["1st - " + players[1], player1_Wins, player2_Wins, draws],
    ["2nd - " + players[2], player2_Wins, player1_Wins, draws]
  ];
  createTable(results);
}
