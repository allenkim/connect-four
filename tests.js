QUnit.test( "Test numWinningStates", function( assert ) {
  var totalWinningStates = 69;
  var grid = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0]
  ];
  // Test #1
  assert.equal(numWinningStates(1,grid), totalWinningStates);
  // Test #2
  assert.equal(numWinningStates(2,grid), totalWinningStates);
  grid = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0]
  ];
  // Test #3
  assert.equal(numWinningStates(1,grid), totalWinningStates);
  // Test #4
  assert.equal(numWinningStates(2,grid), totalWinningStates - 3);
  grid = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,2,0,0,0]
  ];
  // Test #5
  assert.equal(numWinningStates(1,grid), totalWinningStates - 7);
  // Test #6
  assert.equal(numWinningStates(2,grid), totalWinningStates);

  grid = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [2,2,2,0,1,1,1]
  ];
  // Test #7
  assert.equal(numWinningStates(1,grid), totalWinningStates - 9);
  // Test #8
  assert.equal(numWinningStates(2,grid), totalWinningStates - 9);
});

QUnit.test( "Test winningState", function( assert ) {
  var grid = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0]
  ];
  // Test #1
  assert.equal(winningState(1,grid), false);
  // Test #2
  assert.equal(winningState(2,grid), false);

  grid = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,1,0,0],
    [0,2,2,1,2,0,0],
    [1,1,1,2,2,2,1]
  ];
  // Test #3
  assert.equal(winningState(1,grid), false);
  // Test #4
  assert.equal(winningState(2,grid), false);

  grid = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,2],
    [0,0,0,0,1,2,1],
    [0,2,2,1,2,2,1],
    [1,1,1,2,2,2,1]
  ];
  // Test #5
  assert.equal(winningState(1,grid), false);
  // Test #6
  assert.equal(winningState(2,grid), true);

  grid = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,2],
    [0,0,0,0,1,2,1],
    [0,2,2,1,2,2,1],
    [1,1,1,2,2,2,1]
  ];
  // Test #7
  assert.equal(winningState(1,grid), false);
  // Test #8
  assert.equal(winningState(2,grid), true);

  grid = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1],
    [0,0,0,0,1,2,1],
    [0,2,2,1,2,2,1],
    [1,1,1,2,2,2,1]
  ];
  // Test #9
  assert.equal(winningState(1,grid), true);
  // Test #10
  assert.equal(winningState(2,grid), false);

  grid = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0],
    [2,1,0,0,1,2,1],
    [2,2,1,1,2,2,1],
    [1,1,1,1,2,2,1]
  ];
  // Test #11
  assert.equal(winningState(1,grid), true);
  // Test #12
  assert.equal(winningState(2,grid), false);

  grid = [
    [0,0,0,0,0,0,0],
    [1,1,0,0,0,0,0],
    [2,2,1,2,0,0,0],
    [2,1,2,1,1,2,1],
    [2,2,1,1,2,2,1],
    [1,1,1,1,2,2,1]
  ];
  // Test #13
  assert.equal(winningState(1,grid), true);
  // Test #14
  assert.equal(winningState(2,grid), false);

  grid = [
    [0,0,0,0,0,0,2],
    [1,1,0,0,0,2,2],
    [2,2,1,2,2,1,2],
    [2,1,2,2,1,2,1],
    [2,2,1,1,2,2,1],
    [1,1,1,1,2,2,1]
  ];
  // Test #15
  assert.equal(winningState(1,grid), true);
  // Test #16
  assert.equal(winningState(2,grid), true);

  grid = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [1,1,1,0,2,2,2],
    [1,1,1,0,2,2,2],
    [1,1,1,0,2,2,2]
  ];
  // Test #17
  assert.equal(winningState(1,grid), false);
  // Test #18
  assert.equal(winningState(2,grid), false);

  grid = [
    [0,0,0,0,0,1,2],
    [1,1,0,0,1,2,2],
    [2,2,2,1,1,1,2],
    [2,1,1,2,1,2,1],
    [2,2,1,1,2,2,1],
    [1,1,1,1,2,1,1]
  ];
  // Test #19
  assert.equal(winningState(1,grid), true);
  // Test #20
  assert.equal(winningState(2,grid), false);

  grid = [
    [0,0,0,0,0,0,2],
    [1,1,0,0,1,0,2],
    [2,2,2,0,1,0,2],
    [2,1,1,2,1,2,1],
    [2,2,1,1,2,2,1],
    [1,1,0,1,2,2,1]
  ];
  // Test #21
  assert.equal(winningState(1,grid), false);
  // Test #22
  assert.equal(winningState(2,grid), true);

  grid = [
    [0,0,0,0,0,0,2],
    [1,1,2,0,1,0,2],
    [2,2,1,2,1,0,2],
    [2,1,1,2,2,2,1],
    [2,2,1,1,1,2,1],
    [1,1,0,1,2,2,1]
  ];
  // Test #21
  assert.equal(winningState(1,grid), false);
  // Test #22
  assert.equal(winningState(2,grid), true);
});
