var test = require('tape');
var game = require('../treasureinc.js');

test('generating a game instance', function(t){
  var numberOfPlayers = 2;
  var playerNames = ['PlayerA', 'PlayerB'];
  var gameInstance = game({numberOfPlayers: numberOfPlayers, playerNames: playerNames});
  t.ok(gameInstance.board, 'game instance has a board.');
  t.equal(gameInstance.players.length, numberOfPlayers, 'game instance has expected number of players.');
  t.ok(gameInstance.treasureDealer, 'game instance has a treasure dealer.');
  t.end();
})