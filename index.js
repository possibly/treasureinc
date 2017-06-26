var express = require('express')
var app = express()

var treasureinc = require('./treasureinc')
var deck = require('deck')
var mustacheExpress = require('mustache-express');

app.get('/', function (req, res) {
  res.render('index', {cards: treasureinc.starterDeck()})
})

app.get('/card/:cardname', function (req, res) {
  var cardDescription = treasureinc.cards.get(req.params['cardname'])
  res.send( cardDescription )
})

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache')
app.listen(3000)