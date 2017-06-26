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
  res.render('card', {cards: hand})
})

app.get('/card/:cardname', function (req, res) {
  var cardDescription = treasureinc.cards.get(req.params['cardname'])
  res.send( cardDescription )
})

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache')
app.listen(3000)