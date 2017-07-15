// An immutable game board.
// A board is a [[]].
var exports = module.exports = function(xs){
  return Object.keys(exports).reduce(function(acc, key){
    acc[key] = exports[key].bind(null, xs);
    return acc;
  }, {})
}

exports.get = function(board, loc){
  var row = loc[0];
  var col = loc[1];
  return board[row][col];
}

exports.set = function(board, loc, obj){
  var boardRes = board.slice();
  var row = loc[0];
  var col = loc[1];
  boardRes[row] = boardRes[row].slice();
  boardRes[row][col] = obj;
  return module.exports(boardRes);
}

exports.move = function(board, locStart, locEnd, replaceValue){
  var boardRes = board.slice();
  var rowStart = locStart[0];
  var colStart = locStart[1];
  var rowEnd = locEnd[0];
  var colEnd = locEnd[1];
  boardRes[rowStart] = board[rowStart].slice();
  if (rowStart != rowEnd) { 
    boardRes[rowEnd] = board[rowEnd].slice();
  }
  boardRes[rowEnd][colEnd] = board[rowStart][colStart];
  boardRes[rowStart][colStart] = replaceValue;
  return module.exports(boardRes);
}