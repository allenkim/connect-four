QUnit.test( "Test numWinningStates", function( assert ) {
  var grid = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0]
  ];
  assert.equal(numWinningStates(1,grid), 4*6);
  assert.equal(numWinningStates(1,grid),3);
});
