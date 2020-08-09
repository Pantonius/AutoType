class AutoTyper {

  originalText;
  typedText;

  overallTimeout = 0;
  shifted = false;
  hesitationFact = .8;
  mistypingFact = .1;
  
  listener;
  
  keyboardLayout = [
    ['1!', '2"', '3§', '4$', '5%', '6&', '7/', '8(', '9)', '0=', 'ß?', '´`'],
     ['qQ', 'wW', 'eE', 'rR', 'tT', 'zZ', 'uU', 'iI', 'oO', 'pP', 'üÜ', '+*'],
      ['aA', 'sS', 'dD', 'fF', 'gG', 'hH', 'jJ', 'kK', 'lL', 'öÖ', 'äÄ', '#\''],
    ['<>', 'yY', 'xX', 'cC', 'vV', 'bB', 'nN', 'mM', ',;', '.:', '-_']
  ];

  type(text) {
    if(text) {
      this.originalText = text;
    }

    this.typedText = '';

    for(let y = 0; y < this.originalText.length; y++) {
      let character = this.originalText.charAt(y);
      
      if((/^[a-zA-Z]*$/).test(character))
        this.shifted = character === character.toUpperCase();
    
      if(Math.random() < this.mistypingFact) {
        // find character in keyboardLayout
        let xPos;
        let yPos;
        for(let y = 0; y < this.keyboardLayout.length; y++) {
          const row = this.keyboardLayout[y];
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
            if(yPos + dY > 0 && yPos + dY < this.keyboardLayout.length-1) {
              for(let dX = -1; dX < 2; dX += 2) {
                if(xPos + dX > 0 && xPos + dX < this.keyboardLayout[yPos + dY].length-1) {
                  neighbours.push(this.keyboardLayout[yPos + dY][xPos + dX]);
                }
              }
            }
          }
    
          // choose typo
          const index = Math.floor(Math.random() * (neighbours.length-1));
          
          let wrongCharacter = neighbours[index].charAt(0);
          if(this.shifted) {
            wrongCharacter = neighbours[index].charAt(1);
          }
    
          // Mistyping + Correcting
          this.queue(() => { 
            this.typedText += wrongCharacter;
            this.listener(this.typedText);
          });
          
          this.queue(() => {
            this.typedText = this.typedText.slice(0, -1);
            this.listener(this.typedText);
          });
        }
      }

      this.queue(() => {
        this.typedText += character;
        this.listener(this.typedText);
      });
    }
  }

  queue(handler) {
    this.overallTimeout += this.getVariedDelay();
  
    setTimeout(handler, this.overallTimeout);
  }

  getVariedDelay() {
    return (Math.random() * this.hesitationFact) * (Math.random() * 400 + 80);
  }

  setListener(listener) {
    this.listener = listener;
  }

  setHesitationFactor(factor) {
    this.hesitationFact = factor;
  }

  setMistypingFactor(factor) {
    this.mistypingFact = factor;
  }
}