var test = require('tape');
var game = require('../treasureinc.js');

test('generating a game instance works.', function(t){
  var gameInstance = game({numberOfPlayers: 2, playerNames: ['PlayerA', 'PlayerB']});
  t.ok(gameInstance.board, 'game instance has a board.');
  t.equal(gameInstance.players.length, 2, 'game instance has expected number of players.');
  t.ok(gameInstance.treasureDealer, 'game instance has a treasure dealer.');
  t.end();
})

test('ending a turn switches the current player.', function(t){
  var gameInstance = game({numberOfPlayers: 2, playerNames: ['PlayerA', 'PlayerB']});
  t.equal(gameInstance.currentPlayerIndex, 0, 'the current player is the first player.');
  gameInstance = gameInstance.endTurn();
  t.equal(gameInstance.currentPlayerIndex, 1, 'the current player is now the next player.');
  t.end();
})