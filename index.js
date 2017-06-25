var express = require('express')
var app = express()

var cards = require('./cards/cards.json')
 
app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/card/:cardname', function (req, res) {
  var cardDescription = cards.find(function(card){
    var format = card.name.replace(/\s+/g, '').toLowerCase();
    return format == req.params['cardname'] 
  })
  res.send( cardDescription )
})
 
app.listen(3000)