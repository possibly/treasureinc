var fs = require('fs');

var exports = module.exports = function(mapping){
  var playerChar = 'p';
  var playerLocs = [];
  var levelData = fs.readFileSync('./levels/demo.level');
  levelData = levelData.toString().split('\n').map(function(line, i){
      return line.split('').map(function(character, j){
        if (character == playerChar){
          playerLocs.push([i,j])
        }
        return {
          'viz': character,
          'logic': mapping[character]
        }
      })
    })
  return {
    data: levelData,
    playerLocs: playerLocs
  }
}