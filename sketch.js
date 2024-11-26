// [name] Tetris

const NUMBER_OF_ROWS = 20;
const NUMBER_OF_COLUMNS = 10;
let gridArray;
let squareSize;
let xSquarePadding;

class Tetris {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.state = 0;
  }

  display() {
    this.x = this.col * squareSize + xSquarePadding;
    this.y = this.row * squareSize;
    square(this.x, this.y);
  }
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  setSquareSize();
}


function draw() {
  
}


function setSquareSize() {
  if (width / NUMBER_OF_ROWS < height / NUMBER_OF_COLUMNS) {
    squareSize = width / NUMBER_OF_ROWS;
  }
  else {
    squareSize = height / NUMBER_OF_COLUMNS;
  }
  xSquarePadding = (NUMBER_OF_COLUMNS * squareSize - width) / 2;
}

function createEmptySquareGrid () {
  for (let y = 0; y < NUMBER_OF_ROWS; y++) {
    for (let x = 0; x < NUMBER_OF_COLUMNS; x++) {
      square = new Tetris(y, x);
    }
  }
}