/* Basic Tetris Game */

// Event listener
document.addEventListener('DOMContentLoaded', () => {

    
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));

    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    const width = 10;
    let nextRandom = 0;
    let timerId
    let score = 0
    // define an array of colours in the same order that the Tetrominoes sit in their array
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]

  //Arrays containing the Tetromino shapes L, Z, T, O & i 
  const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

  // An array of the Tetromino shape arrays
  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

  let currentPosition = 4; // set the initial start position
  let currentRotation = 0;
  
  // randomly select a Tetromino shape & it's first rotation
  //i.e. theTetrominoes[random][0]
  let random = Math.floor(Math.random()*theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  // draw the Tetromino
  function draw() {
      current.forEach(index => {
          squares[currentPosition + index].classList.add('tetromino')
          // set the background colour of the Tetromino to our variable 'random'
          // this will ensure that the correct index of the colors array is used
          // for each Tetromino shape. Each shape type will always have the same colour
          squares[currentPosition + index].style.backgroundColor = colors[random]
      })
  }

  // undraw the Tetromino
  function undraw() {
      current.forEach(index => {
          squares[currentPosition + index].classList.remove('tetromino')
          squares[currentPosition + index].style.backgroundColor = ''
      })
  }

  // assign function to keycodes - listen for keys being pressed
  function control(e) {
      if(e.keyCode === 37) {
          moveLeft()
      } else if(e.keyCode === 38) {
          rotate()
      } else if(e.keyCode === 39) {
          moveRight()
      } else if(e.keyCode === 40) {
          moveDown()
      }
  }
  // listen for 'keyup' and then call the function 'control(e)'
  document.addEventListener('keyup', control)

  // moveDown function
  function moveDown() {
      undraw(); // undraw the shape at its' current position
      currentPosition += width; // add width (10) to the current position
      draw(); // redraw the shape at the new position
      freeze(); // call the freeze function to check the next square down & start a new shape falling if needed
  }

  // freeze function to stop the shape moving down any further
  function freeze() { // check if the next square down has a class name of taken
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        // give each of the squares in the Tetromino the class of taken
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      //start a new tetromino falling
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  // move the Tetromino left unless at the left edge or there is a blockage
  function moveLeft() {
      undraw()
      const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

      if(!isAtLeftEdge) currentPosition -= 1

      if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
          currentPosition += 1
      }

      draw()
  }

    // move the Tetromino right unless at the right edge or there is a blockage
  function moveRight() {
      undraw()
      const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)

      if(!isAtRightEdge) currentPosition += 1

      if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
          currentPosition -= 1
      }

      draw()
  }

  // rotate the Tetromino
  function rotate() {
      undraw()
      currentRotation ++

      if( currentRotation === current.length) { //if the current rotation gets to 4, make it go back to 0
          currentRotation = 0
      }

      current = theTetrominoes[random][currentRotation]
      draw()
  }

  // show the next Tetromino that will appear
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 0


  // the Tetrominos without rotations
  const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [0, 1, displayWidth, displayWidth+1], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
  ]

  // display the shape in the mini-grid display
  function displayShape() {
    //remove any trace of a tetromino from the entire grid
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach( index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
  }
  
  // add an event listener to the start button
  startBtn.addEventListener('click', () => {
      if(timerId) { // if timerId is not null
        clearInterval(timerId)
        timerId = null // pause the game
      } else {
          draw()
          timerId = setInterval(moveDown, 1000)
          nextRandom = Math.floor(Math.random()*theTetrominoes.length)
          displayShape()
      }
  })

  // add score and remove fully filled rows function
  function addScore() {
      for( i = 0; i < 199; i += width) { // loop through each square in the grid
          const row = [i, i+1 , i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9] // define what a row is
          // check if every square in the row has a class of taken
          if(row.every(index => squares[index].classList.contains('taken'))) {
              score += 10 // if true add 10 to the score
              scoreDisplay.innerHTML = score // update the score in the hmtl document
              row.forEach(index => {
                  squares[index].classList.remove('taken')
                  squares[index].classList.remove('tetromino')
                  squares[index].style.backgroundColor = ''
              })
              const squaresRemoved = squares.splice(i, width)
              squares = squaresRemoved.concat(squares)
              squares.forEach(cell => grid.appendChild(cell))
          }
      }
  }

  // Game Over!
  function gameOver() {
      if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
          scoreDisplay.innerHTML = ` ${score} Game Over!`
          clearInterval(timerId)
      }
  }
})