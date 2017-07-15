var shuffle = require('deck').shuffle
var levelMapping =  {
                      w: 'wall',
                      e: 'empty',
                      p: 'player',
                      t: 'treasure'
                    }
var levelParserRes = require('./levelparser.js')(levelMapping); //todo: allow user to specify level.
var availablePlayerLocations = shuffle(levelParserRes.playerLocs);
var Player = require('./player.js');
var Cards = require('./cards.js');
var ImmutableDeck = require('./immutable-deck.js');
var Board = require('./board.js');
var copy = require('shallow-copy');

var exports = module.exports = function(opts){
    //opts: numberOfPlayers, playerNames
    var players = Player.makePlayers(opts.numberOfPlayers, availablePlayerLocations, opts.playerNames);
    var treasureDeck =  ImmutableDeck(Cards)
                        .without(['move1', 'ghostnoises'], Cards.compareNameToCard)
                        .shuffle();
    var treasureDealer = Player();
    treasureDealer.undrawn = treasureDeck;
    var t = {
      board: Board(levelParserRes.data),
      players: players,
      currentPlayerIndex: 0,
      treasureDealer: treasureDealer,
      cardsPerHand: 5,
      cardsPerTreasureDraw: 3
    }

    return Object.keys(exports).reduce(function(acc, key){
      acc[key] = exports[key]
      return acc;
    }, t)
}

exports.getCurrentPlayer = function(){
  return this.players[this.currentPlayerIndex];
}

exports.endTurn = function(){
  var res = copy(this);
  res.players = copy(this.players);
  // force the old Current Player to end their turn. (e.g. discard everything.)
  res.players[this.currentPlayerIndex] = this.getCurrentPlayer().endTurn();
  // set the new Current Player.
  res.currentPlayerIndex += 1;
  if (res.currentPlayerIndex == this.players.length){
    res.currentPlayerIndex = 0;
  }
  return res
}

exports.draw = function(){
  var res = copy(this);
  res.players = copy(this.players);
  res.players[this.currentPlayerIndex] = this.getCurrentPlayer().draw(this.cardsPerHand);
  return res;
}

exports.drawTreasure = function(){
  var res = copy(this);
  res.treasureDealer = this.treasureDealer.draw(this.cardsPerTreasureDraw);
  return res;
}

exports.pickTreasure = function(pickedCard){
  var res = copy(this);
  res.treasureDealer = this.treasureDealer
                            .trash(pickedCard, this.treasureDealer.drawn)
                            .shuffle();
  res.players[this.currentPlayerIndex] = this.getCurrentPlayer().gain(pickedCard);
  return res;
}

exports.play = function(cardToPlay){
  var res = copy(this);
  res.players = copy(this.players);
  res.players[this.currentPlayerIndex] = this.getCurrentPlayer().play(cardToPlay);
  return res;
}

exports.discardACard = function(cardToDiscard, fromDeck){
  var res = copy(this);
  res.players = copy(this.players);
  res.players[this.currentPlayerIndex] = this.getCurrentPlayer().discard(cardToDiscard, fromDeck);
  return res;
}

exports.gain = function(cardToGain){
  var res = copy(this);
  res.players = copy(this.players);
  res.players[this.currentPlayerIndex] = this.getCurrentPlayer().gain(cardToGain);
  return res;
}

exports.move = function(moveEndLocation){
  var res = copy(this);
  // update the board.
  res.board = copy(this.board);
  var moveStartLocation = this.players[this.currentPlayerIndex].loc;
  var replaceValue = Board.get(levelParserRes.data.viz)
  res.board = this.board.move(moveStartLocation, moveEndLocation, replaceValue);
  // update the Current Player.
  res.players = copy(this.players);
  res.players[this.currentPlayerIndex] = this.getCurrentPlayer().setLoc(moveEndLocation);
  return res;
}

// delta must be +1 or -1
exports.scare = function(delta, playerIndex){
  var res = copy(this);
  res.players[playerIndex] = this.players[playerIndex].scared(delta);
  return res;
}