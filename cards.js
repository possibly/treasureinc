var ImmutableCards = require('./cards/cards.json');

var exports = module.exports = ImmutableCards;

function CardNameFormat(card){
  return card.name.replace(/\s+/g, '').toLowerCase()
}

exports.get = function(cardName){
  // Searches the cards by name, which is lowercased
  // with white spaces removed.
  // Returns the card if found, otherwise undefined.
  var found = this.find( function(card) {
    return CardNameFormat(card) == cardName
  });
  return found
}

exports.compareCards = function(cardA, cardB){
  return cardA.name == cardB.name
}

exports.compareNameToCard = function(name, card){
  return name == CardNameFormat(card);
}

exports.StarterDeck = function(){
  var deck = []
  var numMove = 8
  var numGhostNoises = 2
  for (var i=0; i<numMove; i++){
    deck.push(this.get('move1'))
  }
  for (var i=0; i<numGhostNoises; i++){
    deck.push(this.get('ghostnoises'))
  }
  return deck
}