var hesistationFact = .8;
var mistypingFact = .1;

var text = 'Hello World! I just learned writing like a real hoooman. Look at me ^^';
var textview = document.getElementById('textview');

var keyboardLayout = [
  ['1!', '2"', '3§', '4$', '5%', '6&', '7/', '8(', '9)', '0=', 'ß?', '´`'],
   ['qQ', 'wW', 'eE', 'rR', 'tT', 'zZ', 'uU', 'iI', 'oO', 'pP', 'üÜ', '+*'],
    ['aA', 'sS', 'dD', 'fF', 'gG', 'hH', 'jJ', 'kK', 'lL', 'öÖ', 'äÄ', '#\''],
  ['<>', 'yY', 'xX', 'cC', 'vV', 'bB', 'nN', 'mM', ',;', '.:', '-_', '']
];

var overallTimeout = 0;
var shifted = false;
for(let y = 0; y < text.length; y++) {
  let character = text.charAt(y);
  
  if((/^[a-zA-Z]*$/).test(character))
    shifted = character === character.toUpperCase();

  if(Math.random() < mistypingFact) {
    // find character in keyboardLayout
    let xPos;
    let yPos;
    for(let y = 0; y < keyboardLayout.length; y++) {
      const row = keyboardLayout[y];
      for(let x = 0; x < row.length; x++) {
        const characterInRow = row[x];
        if(characterInRow.includes(character)) {
          xPos = x;
          yPos = y;

          break;
        }
      }
    }

    if(xPos != null && yPos != null) {
      // find direct neighbours to character
      let neighbours = [];

      for(let dY = -1; dY <= 1; dY++) {
        if(yPos + dY > 0 && yPos + dY < keyboardLayout.length-1) {
          for(let dX = -1; dX < 2; dX += 2) {
            if(xPos + dX > 0 && xPos + dX < keyboardLayout[yPos + dY].length-1) {
              neighbours.push(keyboardLayout[yPos + dY][xPos + dX]);
            }
          }
        }
      }

      // choose typo
      const index = Math.floor(Math.random() * (neighbours.length-1));
      
      let wrongCharacter = neighbours[index].charAt(0);
      if(shifted) {
        wrongCharacter = neighbours[index].charAt(1);
      }

      // Mistyping + Correcting
      queue(() => { textview.innerHTML += wrongCharacter; });
      queue(() => { textview.innerHTML = textview.innerHTML.slice(0, -1); });
    }
  }

  queue(() => { textview.innerHTML += character; });
}

function queue(handler) {
  overallTimeout += getVariedDelay();

  setTimeout(handler, overallTimeout);
}

function getVariedDelay() {
  return (Math.random() * hesistationFact) * (Math.random() * 400 + 80);
}