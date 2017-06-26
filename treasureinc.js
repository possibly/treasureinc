var cards = require('./cards/cards.json')
var exports = module.exports = {
  currentPlayer: 1,
  numPlayers: 2,
}

exports.starterDeck = function(){
  var deck = []
  var numMove = 8
  var numGhostNoises = 2
  for (var i=0; i<numMove; i++){
    deck.push(this.cards().get('move1'))
  }
  for (var i=0; i<numGhostNoises; i++){
    deck.push(this.cards().get('ghostnoises'))
  }
  return deck
}

exports.cards = function(){
  return {
    cards: cards,
    get: function(cardName){
      // returns the card if found, otherwise undefined.
      var found = this.cards.find( function(card) {
        var format = card.name.replace(/\s+/g, '').toLowerCase()
        return format == cardName
      });
      return found
    }
  }
}