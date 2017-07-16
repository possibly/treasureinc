var ImmutableDeck = require('./immutable-deck.js');
var Cards = require('./cards.js');
var copy = require('shallow-copy');

var Player = {
  name: '',
  resolve: 20,
  played: ImmutableDeck([]),
  hand: ImmutableDeck([]),
  undrawn: ImmutableDeck(Cards.StarterDeck()).shuffle(),
  discarded: ImmutableDeck([]),
  equipment: ImmutableDeck([]),
  channeling: ImmutableDeck([]),
  loc: []
}

exports = module.exports = function(){
  return Object.keys(exports).reduce(function(acc, key){
    acc[key] = exports[key];
    return acc;
  }, copy(Player))
}

exports.makePlayers = function(numberOfPlayers, availablePlayerLocations, names){
  var res = [];
  for (i = 0; i < numberOfPlayers; i++){
    var p = module.exports();
    p.loc = availablePlayerLocations.pop();
    p.name = names.shift();
    res.push(p);
  }
  return res;
}

// assumes cardToTrash is a Card obj.
exports.trash = function(cardToTrash, fromDeck){
  var p = copy(this);
  p[fromDeck] = this[fromDeck].without([cardToTrash], Cards.compareCards);
  return p;
}

// shuffles the discard pile into the undrawn pile.
// order is NOT preserved, e.g. discard pile does
// not go in the back of the undrawn pile.
exports.shuffle = function(){
  var p = copy(this);
  p.undrawn = this.undrawn.concat(this.discarded);
  p.undrawn = p.undrawn.shuffle();
  return p;
}

exports.draw = function(numToDraw){
  var res = this.undrawn.draw(
              this.discarded, 
              numToDraw
            );
  var p = copy(this);
  p.hand = res.drawn;
  p.undrawn = res.remaining;
  if (res.shuffled){ p.discarded = [] }
  return p;
}

exports.play = function(cardToPlay){
  var p = copy(this);
  p.hand = this.hand.without([cardToPlay], Cards.compareCards);
  if (cardToPlay.chanelled){
    p.channeling = p.channeling.concat({
      details: cardToPlay,
      duration: cardToPlay.duration
    })
  } else {
    p.played = this.played.concat(cardToPlay)
  }
  return p;
}

exports.discard = function(cardToDiscard, fromDeck){
  var p = copy(this);
  p[fromDeck] = this[fromDeck].without([cardToDiscard], Cards.compareCards);
  p.discarded = this.discarded.concat(cardToDiscard);
  return p;
}

exports.endTurn = function(){
  var p = copy(this);
  if (this.channeling.length > 0){
    p.channeling = this.channeling.map(function(channeledCard){
      var c = copy(channeledCard);
      c.duration -= 1;
      return c;
    })
    p.channeling = p.channeling.filter(function(channeledCard){
      if (channeledCard.duration != 0){ return true; }
      p.discarded = p.discarded.concat(channeledCard.details);
    })
  }
  p.discarded = p.discarded.concat(this.hand).concat(this.played);
  p.hand = [];
  p.played = [];
  return p
}

exports.gain = function(cardToGain){
  var p = copy(this);
  if (cardToGain.type == 'equipment'){
    p.equipment = p.equipment.concat(cardToGain);
    return p
  }
  p.discarded = p.discarded.concat(cardToGain);
  return p;
}

exports.setLoc = function(newLoc){
  var p = copy(this);
  p.loc = newLoc;
  return p;
}

exports.scared = function(delta){
  var p = copy(this);
  p.resolve = this.resolve + delta;
  return p;
}