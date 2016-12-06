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
  table.removeChild(table.childNodes[0]);
}

function runSimulations(){
  deleteTable();
  var NUMBER_SIMULATIONS = document.getElementById("num_simulations").value;
  var results = [
    ["Players","Number of Wins","Number of Losses","Total"],
    ["1st - " + players[1], 150, 100, NUMBER_SIMULATIONS],
    ["2nd - " + players[2], 50, 75, NUMBER_SIMULATIONS]
  ];
  createTable(results);
}
