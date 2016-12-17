var height = document.getElementById('grid_div').offsetHeight / boxSize - 1;
var width = document.getElementById('grid_div').offsetWidth / boxSize;
var tick; // for setInterval

var grid = []; // grid representing the Connect Four board
for (var row = 0; row < height; row++){
  grid.push([]);
  for (var col = 0; col < width; col++)
    // 0 means empty, 1 means first player (yellow), 2 means second player (red)
    grid[row][col] = 0;
}

// playerTurn is either 1 or 2, indicating the player whose turn it is
var playerTurn = 1;
// Move number is a counter of the moves that goes up to 42
var moveNumber = 1;
// Boolean to indicate if game is over or not
var gameOver = false;

// Boolean to check if move is being made
var makingMove = false;
// Boolean whether bot is computing a move right now
var botThinking = false;
// Minimum number of milliseconds bots have to take before making a move
var botDelay = 300;
// Tween Delay for dropping
var tweenDelay = 0.08;
// players[1] is the first player and players[2] is the second player
var players = [,"Human", "Human"]

// Onclick events for the radio button selection
document.getElementById("human_1").onclick = function() {
  players[1] = "Human";
};
document.getElementById("human_2").onclick = function() {
  players[2] = "Human";
};

/*
 * makeBotMove makes a move for the bot
 */
function makeBotMove(){
  if (botThinking || gameOver || (players[playerTurn] === "Human"))
    return false;
  botThinking = true;
  var thinking = setTimeout(function(){
    botThinking = false;
    makeBotMove();
  },botDelay)
  if (!makingMove){
    var col = bots[players[playerTurn]](playerTurn,grid);
    makeMove(col,true);
  }
}

/*
 * Takes in a column and attempts to make a move there
 * isBot is a boolean that is false by default
 * it should be true when called by bots
 */
function makeMove(col,isBot){
  if (makingMove){
    return false;
  }
  var isBot = (typeof isBot !== 'undefined') ?  isBot : false;

  // if game is over or its the bot's turn and the player move, then moves are not allowed
  if (gameOver || (!isBot && (players[playerTurn] !== "Human")))
    return false;

  // we check from the bottom up to see if a move can be played
  var row = moveRow(col,grid);
  if (row !== -1){
    makingMove = true;
    grid[row][col] = playerTurn;
    var drop = document.getElementById('drop-'+col);
    drop.setAttribute("fill-opacity",1);
    drop.setAttribute("fill",playerTurn===1?"yellow":"red");
    if (players[playerTurn] === "Human")
      tweenDelay = 0.08;
    else
      tweenDelay = 0.05;
    if (moveNumber === width*height || playerWon(row,col,playerTurn,grid)){
      TweenLite.to(drop, tweenDelay*(row+1), {x:0, y:(row+1)*100, ease: Linear.easeNone, onComplete: function(){
        var game_end = document.getElementById('game_end');
        if (moveNumber >= width*height){
          game_end.childNodes[1].innerHTML = "Draw!";
        }
        else{
          game_end.childNodes[1].innerHTML = "Player " + playerTurn + " wins!";
        }
        game_end.style.display = 'block';
        gameOver = true;
        drawGrid();
        drop.setAttribute('style','');
        for (var c = 0; c < width; c++)
          document.getElementById('drop-'+c).setAttribute("fill-opacity",0);
        makingMove = false;
      }});
      TweenLite.set(drop, {clearProps:"x, y"});
    }
    else{

      TweenLite.to(drop, tweenDelay*(row+1), {x:0, y:(row+1)*100, ease: Linear.easeNone, onComplete: function(){
        playerTurn = 3 - playerTurn; // toggles between player 1 and 2
        document.getElementById('player_turn').innerHTML = "Player " + playerTurn + "'s Move";
        botThinking = false;
        makeBotMove();
        drawGrid();
        drop.setAttribute('style','');
        for (var c = 0; c < width; c++)
          document.getElementById('drop-'+c).setAttribute("fill-opacity",0);
        makingMove = false;
      }});
      TweenLite.set(drop, {clearProps:"x, y"});
    }
    moveNumber++;
  }
}

/*
 * Clears the grid and clear browser circles (make the cirles white)
 * Also resets the player turn to 1 and sets gameOver to false
 */
function resetGrid(){
  for (var col = 0; col < width; col++){
    var drop = document.getElementById('drop-'+col);
    drop.setAttribute('style','');
    drop.setAttribute('fill-opacity','0');
  }
  document.getElementById('game_end').style.display = 'none';
  playerTurn = 1;
  moveNumber = 1;
  document.getElementById('player_turn').innerHTML = "Player 1's Move";
  gameOver = false;
  for (var row = 0; row < height; row++){
    for (var col = 0; col < width; col++){
      grid[row][col] = 0;
    }
  }
  drawGrid();
  makeBotMove();
}

/*
 * Draws the current state of the grid variable onto the browser
 * This should be called every time the grid is updated
 * NOTE:0 means empty, 1 means first player (yellow), 2 means second player (red)
 */
function drawGrid(){
  for (var row = 0; row < height; row++){
    for (var col = 0; col < width; col++){
      var cell = document.getElementById(row+'-'+col);
      var color = 'white';
      if (grid[row][col] == 1)
        color = 'yellow';
      else if (grid[row][col] == 2)
        color = 'red';
      if (color !== 'white'){
        cell.setAttribute('fill-opacity','1');
        cell.setAttribute('fill',color);
      }
      else{
        cell.setAttribute('fill-opacity','0');
      }
    }
  }
}
