var test = require('tape');
var player = require('../player.js');

test('a player can draw, play and discard all non-channel cards.', function(t){
  var res = player();
  t.equal(res.hand.length, 0, 'player starts with an empty hand.');
  t.equal(res.discarded.length, 0, 'player starts with an empty discard pile.');
  var res = res.draw(5);
  t.equal(res.hand.length, 5, 'player draws 5 cards.');
  res = res.play(res.hand[0]);
  t.equal(res.played.length, 1, 'player plays 1 card.');
  t.equal(res.hand.length, 4, 'that card was drawn from their hand.');
  res = res.endTurn();
  t.equal(res.discarded.length, 5, 'all drawn cards were discarded.');
  t.equal(res.hand.length, 0, 'the drawn cards are no longer in their hand.');
  t.equal(res.played.length, 0, 'the drawn cards are no longer in the played area.');
  t.end();
});

test('a player can draw and shuffle cards correctly.', function(t){
  var res = player();
  res = res.draw(6);
  t.equal(res.hand.length, 6, 'player can draw 6 out of 10 undrawn cards and 0 discarded cards.');
  var originalUndrawnCards = res.undrawn;
  res = res.endTurn();
  res = res.draw(6);
  t.equal(res.hand.length, 6, 'player can draw 6 out of 4 undrawn cards and 6 discarded cards.');
  t.equal(res.discarded.length, 0,  'there are now 0 discarded cards, since the discard pile needed'+
                                    'to be shuffled since there were not enough undrawn cards');
  t.equal(res.undrawn.length, 4, 'there are now 4 undrawn cards, since 6 discards were shuffled and 2 taken.');
  for(var i = 0; i < originalUndrawnCards; i++){
    var match = false;
    for (var j = 0; j < res.hand.length; j++){
      if (res.hand[j].name == originalUndrawnCards[i].name){
        match = true;
        break;
      }
    }
    if (match == false){
      t.end('Not all undrawn cards were added to the hand after a discard pile shuffle.');
      return false;
    }
  }
  t.ok(true, 'All undrawn cards were added to the hand after a discard pile shuffle.');
  t.end();
})