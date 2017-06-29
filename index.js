var express = require('express')
var app = express()

var treasureinc = require('./treasureinc')
var mustacheExpress = require('mustache-express')

app.get('/', function (req, res) {
  res.render('index', {})
})

app.get('/draw', function (req, res) {
  // draw the current player's hand.
  var hand = treasureinc.draw()
  hand = hand.map(function(card) { 
    if (card.type == 'Chanelled'){ 
      card.channeled = true 
    }
    return card
  })
  res.render('cards', {cards: hand})
})

app.get('/turn', function (req, res) {
  res.render('header', {playerId: treasureinc.currentPlayer})
})

app.post('/turn', function (req, res) {
  treasureinc.updateCurrentPlayer()
  res.sendStatus(200)
})

app.get('/drawTreasure', function (req, res) {
  var treasure = treasureinc.drawTreasure()
  res.render('cards', {
      cards: treasure,
      treasure: 'yes'
      })
})

app.post('/takeTreasure/:cardname', function (req, res) {
  treasureinc.takeTreasure(req.params['cardname'])
  res.sendStatus(200)
})

app.get('/equipment', function (req, res) {
  res.render('cards', {cards: treasureinc.getEquipment()})
})

app.get('/level', function (req, res) {
  res.send(JSON.stringify(treasureinc.getLevel()))
})

app.post('/movePlayerAvatarTo/:row/:col', function (req, res) {
  treasureinc.movePlayerAvatarTo(req.params['row'], req.params['col'])
  res.sendStatus(200)
})

app.post('/channel/play/:cardname', function (req, res) {
  treasureinc.playChanneled(req.params['cardname'])
  res.sendStatus(200)
})

app.post('/channel/remove/:cardname', function (req, res){
  treasureinc.removeChanneled(req.params['cardname'])
  res.sendStatus(200)
})

app.get('/channel', function (req, res) {
  res.render('channeled', {cards: treasureinc.getChanneled()})
})

app.get('/card/:cardname', function (req, res) {
  var cardDescription = treasureinc.cards.get(req.params['cardname'])
  res.send( cardDescription )
})

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache')
app.listen(process.env.PORT || 3000)