var cards = require('./cards/cards.json')
var shuffle = require('deck').shuffle

var exports = module.exports = {
    currentPlayer: 0,
    decks: [starterDeck(), starterDeck()],
    cards: cards,
    cardsPerHand: 5
}

function Deck(){
  return {
    // 0 is top of the deck.
    undrawn: [],
    drawn: [],
    push: function(card){
      return this.undrawn.push(card)
    },
    draw: function(num){
      var drawn = this.drawn
      var undrawn = this.undrawn
      if (undrawn.length < num){
        shuffle(drawn).forEach(function(card){ undrawn.push(card) })
        drawn.splice(0, drawn.length)
      }
      var hand = undrawn.splice(0,num)
      hand.forEach(function(card){ drawn.push(card) })
      return hand
    }
  }
}

function Cards(){
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

function starterDeck(){
  var deck = Deck()
  var numMove = 8
  var numGhostNoises = 2
  for (var i=0; i<numMove; i++){
    deck.push(Cards().get('move1'))
  }
  for (var i=0; i<numGhostNoises; i++){
    deck.push(Cards().get('ghostnoises'))
  }
  deck.undrawn = shuffle(deck.undrawn)
  return deck
}

exports.draw = function(){
  var currentDeck = this.decks[this.currentPlayer]
  this.currentPlayer == 1 ? this.currentPlayer = 0 : this.currentPlayer = 1
  return currentDeck.draw(this.cardsPerHand)
}

exports.cards = Cards