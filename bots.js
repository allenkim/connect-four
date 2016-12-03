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
    if (row !== -1 && playerWon(row,col,playerTurn)){
      return col;
    }
  }
  for (var col = 0; col < width; col++){
    var row = moveRow(col);
    if (row !== -1 && playerWon(row,col,3-playerTurn)){
      return col;
    }
  }
  while (!gameOver){
    var col = Math.floor(Math.random() * 7);
    if (moveRow(col))
      return col;
  }
}

var player_options = document.getElementsByClassName("player_options");
for (var i = 1; i <= 2; i++){
  for (var bot in bots){
    if (!bots.hasOwnProperty(bot))
      continue;
    var id = bot+'_'+i;
    var button_div = document.createElement('div');
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
