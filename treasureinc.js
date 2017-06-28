var cards = require('./cards/cards.json')
var shuffle = require('deck').shuffle

var exports = module.exports = {
    currentPlayer: 0,
    players: [Player(), Player()],
    treasureDeck: treasureDeck(),
    cardsPerHand: 5,
    cardsPerTreasureDraw: 3
}

function Player(){
  return {
    hand: [],
    deck: starterDeck(),
    equipment: []
  }
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
    },
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

function treasureDeck(){
  var deck = Deck()
  cards.forEach(function(card){
    var format = card.name.replace(/\s+/g, '').toLowerCase()
    if (format != 'move1' && format != 'ghostnoises'){
      deck.push(card)
    }
  })
  deck.undrawn = shuffle(deck.undrawn)
  return deck
}

exports.draw = function(){
  var currentDeck = this.players[this.currentPlayer].deck
  return currentDeck.draw(this.cardsPerHand)
}

exports.cards = Cards

exports.updateCurrentPlayer = function(){
  this.currentPlayer == 1 ? this.currentPlayer = 0 : this.currentPlayer = 1
  return this.currentPlayer
}

exports.drawTreasure = function(){
  return this.treasureDeck.draw(this.cardsPerTreasureDraw)
}

exports.takeTreasure = function(cardName){
  cardName = cardName.replace(/\s+/g, '').toLowerCase()
  var deck = this.treasureDeck
  var chosenCard = Cards().get(cardName)
  // remove the chosen card from the treasure deck
  deck.drawn.splice(deck.drawn.findIndex(function(card){ return card.name == chosenCard.name }), 1)
  // shuffle the drawn treasure cards back in with the undrawn treasure cards.
  var copyLen = deck.drawn.length
  for (var i = 0; i < copyLen; i++){
    deck.undrawn.push(deck.drawn.pop())
  }
  // shuffle all the treasure cards.
  deck.undrawn = shuffle(deck.undrawn)
  // give the treasure card to the player.
  if (chosenCard.type == 'equipment'){
    this.players[this.currentPlayer].equipment.push(chosenCard)
    return 'equipment'
  } 
  // move card to the player's drawn pile.
  this.players[this.currentPlayer].deck.drawn.push(chosenCard)
  return 'ability'
}

exports.getEquipment = function(){
  return this.players[this.currentPlayer].equipment
}