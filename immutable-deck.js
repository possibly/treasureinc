// A deck is simply an array.
// Objects in the deck are not expected to mutate.
// and thus are not copied.
var shuffle = require('deck').shuffle;
var copy = require('shallow-copy');

var exports = module.exports = function(deck){
  var d = copy(deck);
  return Object.keys(exports).reduce(function(acc, key){
    acc[key] = exports[key];
    return acc;
  }, d)
}

exports.draw = function(discard, numToDraw){
  var shuffled = false;
  var res = this;
  if (this.length < numToDraw){
    shuffled = shuffle(discard);
    res = this.concat(shuffled)
  }
  var drawn = res.slice(0, numToDraw)
  var remaining = res.slice(numToDraw)
  return {
    drawn: module.exports(drawn),
    remaining: module.exports(remaining),
    shuffled: shuffled
  }
}

// return the deck without the specified cards.
exports.without = function(objs, test){
  var res = module.exports(this)
  while (objs.length > 0){
    var obj = objs.pop();
    var index = res.findIndex(function(card){
      return test(obj, card);
    })
    res.splice(index,1);
  }
  return res;
}

exports.shuffle = function(){
  return module.exports(shuffle(this));
}