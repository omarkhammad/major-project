// [name] Tetris

const NUMBER_OF_ROWS = 20;
const NUMBER_OF_COLUMNS = 10;
let tetrisArray = [];
let squareSize;
let xSquarePadding;
let ySquarePadding;
let fallingBlocks = [];
let tetrisColorPallet = ["grey", "red"];


class Tetris {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.state = 0;
    this.shadow = false;
  }


  setCoordinates() {
    this.x = this.col * squareSize + xSquarePadding;
    this.y = this.row * squareSize;
  }


  display() {
    fill(tetrisColorPallet[this.state]);
    square(this.x + xSquarePadding, this.y + ySquarePadding, squareSize);
  }
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  createEmptySquareGrid();
  setSquareSize();
  newBlock();
}


function draw() {
  for (let arr of tetrisArray) {
    for (let newTetris of arr) {
      newTetris.display();
    }
  }

  // Tetris => Tetris.display();
}


function setSquareSize() {
  if (width / NUMBER_OF_COLUMNS < height / NUMBER_OF_ROWS) {
    squareSize = width / NUMBER_OF_COLUMNS;
  }
  else {
    squareSize = height / NUMBER_OF_ROWS;
  }
  xSquarePadding = (width - NUMBER_OF_COLUMNS * squareSize) / 4;
  
  ySquarePadding = (height - NUMBER_OF_ROWS * squareSize) / 2;
  
  for (let arr of tetrisArray) {
    for (let newTetris of arr) {
      newTetris.setCoordinates();
    }
  }
}

function createEmptySquareGrid() {
  for (let y = 0; y < NUMBER_OF_ROWS; y++) {
    let arr = [];
    for (let x = 0; x < NUMBER_OF_COLUMNS; x++) {
      let newTetris = new Tetris(y, x);
      arr.push(newTetris);
    }
    tetrisArray.push(arr);
  }
}


function allTetris(func) {
  for (let arr of tetrisArray) {
    for (let newTetris of arr) {
      newTetris.func();
    }
  }
}


function newBlock() {
  let fallingBlockColor = Math.floor(Math.random() * (tetrisColorPallet.length - 1)) + 1;
  fallingBlocks = [[0, 4], [0, 5], [1, 4], [1, 5]];
  for (let fallingBlock of fallingBlocks) {
    tetrisArray[fallingBlock[0]][fallingBlock[1]].state = fallingBlockColor;
  }
}


function findShadow() {
  let dropBy = 0;
  let clear = true;
  while(clear && dropBy < 18) {
    dropBy = 1;
    for (let block of fallingBlocks) {
      if (tetrisArray[block[1]][block[0]].state !== 0) {
        clear = false;
      }
    }
  }
}
