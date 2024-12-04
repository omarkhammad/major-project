// [name] Tetris

let fallingBlockColor;
const NUMBER_OF_ROWS = 20;
const NUMBER_OF_COLUMNS = 10;
let tetrisArray = [];
let squareSize;
let xSquarePadding;
let ySquarePadding;
let currentFallingTetris;
let randomFallingTetris;
let fallingTetrisCoordinate;
let fallingTetrisColor;
let allFallingBlocks = 
[[[0, 0], [0, 1], [1, 0], [1, 1]],     // Square
  [[-1, 0], [0, 0], [1, 0], [2, 0]],   // Line
  [[-1, 0], [0, 0], [0, 1], [1, 1]],   // Z
  [[-1, 1], [0, 0], [0, 1], [1, 0]],   // S
  [[-1, 1], [0, 0], [0, 1], [1, 1]],   // T
  [[1, 0], [-1, 1], [0, 1], [1, 1]],   // L
  [[-1, 0], [-1, 1], [0, 1], [1, 1]]]; // Reverse L
let fallingBlocks = [];
let tetrisColorPallet = ["grey", "red", "blue", "green"];


class Tetris {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.colorState = 0;
    this.shadow = false;
    this.solid = false;
  }


  setCoordinates() {
    this.x = this.col * squareSize + xSquarePadding;
    this.y = this.row * squareSize;
  }


  display() {
    fill(tetrisColorPallet[this.colorState]);
    square(this.x + xSquarePadding, this.y + ySquarePadding, squareSize);
  }
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  createEmptySquareGrid();
  setSquareSize();
  newBlock();
  findShadow();
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
  fallingTetrisColor = Math.floor(Math.random() * (tetrisColorPallet.length - 1)) + 1;
  randomFallingTetris = allFallingBlocks[Math.floor(Math.random() * allFallingBlocks.length)];
  currentFallingTetris = [];
  fallingTetrisCoordinate = [4, 0];

  for (let block of randomFallingTetris) {
    currentFallingTetris.push([block[0] + fallingTetrisCoordinate[0], block[1] + fallingTetrisCoordinate[1]]);
    tetrisArray[block[1] + fallingTetrisCoordinate[1]][block[0] + fallingTetrisCoordinate[0]].colorState = fallingTetrisColor;
  }

}

function keyPressed() {
  if (key === "ArrowLeft") {
    moveHorizontally(-1);
  }
  if (key === "ArrowRight") {
    moveHorizontally(1);
  }
}

function findShadow() {
  let dropBy = 0;
  let isClear = true;
  while(isClear) {
    dropBy++;
    for (let block of currentFallingTetris) {
      if (dropBy + block[1] + 1 > NUMBER_OF_ROWS || tetrisArray[block[1] + dropBy][block[0]].solid) {
        isClear = false;
      }
    }
  }

  dropBy--;
  
  for (let block of currentFallingTetris) {
    tetrisArray[block[1] + dropBy][block[0]].colorState = fallingTetrisColor;
    tetrisArray[block[1] + dropBy][block[0]].shadow = true;
  }
}


function moveHorizontally(shift) {
  let isClear = "true";
  for (let block of currentFallingTetris) {
    if (block [0] + shift + 1 > NUMBER_OF_COLUMNS || block[0] + shift < 0 || tetrisArray[block[1]][block[0] + shift].solid) {
      isClear = false;
    }
  }

  if (isClear) {
    clearFallingTetris();

    fallingTetrisCoordinate[0] += shift;
    currentFallingTetris = [];
      
    for (let block of randomFallingTetris) {
      currentFallingTetris.push([block[0] + fallingTetrisCoordinate[0], block[1] + fallingTetrisCoordinate[1]]);
      tetrisArray[block[1] + fallingTetrisCoordinate[1]][block[0] + fallingTetrisCoordinate[0]].colorState = fallingTetrisColor;
    }
  
    findShadow();
  }
}


function clearFallingTetris() {
  for (let block of currentFallingTetris) {
    tetrisArray[block[1]][block[0]].colorState = 0;
  }
}