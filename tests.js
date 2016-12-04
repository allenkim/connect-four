QUnit.test( "Test numWinningStates", function( assert ) {
  var totalWinningStates = 4*6 + 3*7 + 24;
  var grid = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0]
  ];
  // assert.equal(numWinningStates(1,grid), totalWinningStates);
  // assert.equal(numWinningStates(2,grid), totalWinningStates);
  grid = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0]
  ];
  // assert.equal(numWinningStates(1,grid), totalWinningStates);
  assert.equal(numWinningStates(2,grid), totalWinningStates - 3);
  grid = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,2,0,0,0]
  ];
  // assert.equal(numWinningStates(1,grid), totalWinningStates - 7);
  // assert.equal(numWinningStates(2,grid), totalWinningStates);
});
