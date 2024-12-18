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
[[[[0, 0], [0, 1], [1, 0], [1, 1]]],     // O

  [[[-1, 1], [0, 1], [1, 1], [2, 1]],   // I
  [[1, 3], [1, 2], [1, 1], [1, 0]],   // I
  [[-1, 2], [0, 2], [1, 2], [2, 2]],   // I
  [[0, 3], [0, 2], [0, 1], [0, 0]]],   // I

  [[[-1, 0], [0, 0], [0, 1], [1, 1]],   // Z
  [[1, 0], [0, 2], [0, 1], [1, 1]],   // Z
  [[-1, 1], [0, 1], [0, 2], [1, 2]],   // Z
  [[0, 0], [-1, 2], [-1, 1], [0, 1]]],   // Z

  [[[-1, 1], [0, 0], [0, 1], [1, 0]],   // S
  [[1, 2], [0, 0], [0, 1], [1, 1]],   // S
  [[-1, 2], [0, 1], [0, 2], [1, 1]],   // S
  [[0, 2], [-1, 0], [-1, 1], [0, 1]]],   // S

  [[[0, 1], [0, 0], [-1, 1], [1, 1]],   // T
  [[0, 1], [0, 0], [0, 2], [1, 1]],   // T
  [[0, 1], [0, 2], [-1, 1], [1, 1]],   // T
  [[0, 1], [0, 0], [-1, 1], [0, 2]]],   // T

  [[[1, 0], [-1, 1], [0, 1], [1, 1]],   // L
  [[0, 0], [0, 1], [0, 2], [1, 2]],   // L
  [[-1, 2], [-1, 1], [0, 1], [1, 1]],   // L
  [[0, 0], [0, 1], [0, 2], [-1, 0]]],   // L

  [[[-1, 0], [-1, 1], [0, 1], [1, 1]], // J
  [[0, 0], [0, 1], [0, 2], [1, 0]], // J
  [[1, 2], [-1, 1], [0, 1], [1, 1]], // J
  [[0, 0], [0, 1], [0, 2], [-1, 2]]]]; // J


let rotationState = 0;

let shadowArray = [];
let tetrisColorPallet;
let tetrisShadowColorPallet = [];
const SHADOW_FADE = 0.3;
let score = 0;
let rowPointChart = [40, 100, 300, 1200];
let hardDropPoints = 8;
let softDropPoints = 4;

let gameIsOver = false;


class Tetris {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.colorState = 0;
    this.falling = false;
    this.shadow = false;
    this.solid = false;
  }


  dropHeightByOne() {
    this.row++;
  }


  setCoordinates() {
    this.x = this.col * squareSize + xSquarePadding;
    this.y = this.row * squareSize;
  }


  display() {
    if (this.shadow && !this.falling) {
      fill(tetrisShadowColorPallet[this.colorState]);
    }
    else {
      fill(tetrisColorPallet[this.colorState]);
    }
    square(this.x + xSquarePadding, this.y + ySquarePadding, squareSize);
  }
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  setColorPallet();
  createEmptySquareGrid();
  setSquareSize();
  newBlock();
  findShadow();
  // window.setInterval(moveDown, 500);
}


function draw() {
  background(255);
  for (let arr of tetrisArray) {
    for (let newTetris of arr) {
      newTetris.display();
    }
  }

  showScore();
}


function keyPressed() {
  if (key === "ArrowLeft") {
    moveHorizontally(-1);
  }
  if (key === "ArrowRight") {
    moveHorizontally(1);
  }
  if (key === "ArrowDown") {
    moveDown();
  }
  if (key === "ArrowUp") {
    rotateTetris();
  }
  if (key === " ") {
    moveAllTheWayDown();
  }
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
  rotationState = 0;
  fallingTetrisColor = Math.floor(Math.random() * (tetrisColorPallet.length - 1)) + 1;
  randomFallingTetris = Math.floor(Math.random() * 6);

  fallingTetrisCoordinate = [4, 0];
  findFallingBlocks();
  findShadow();
  checkGameLoss();
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
    shadowArray.push(tetrisArray[block[1] + dropBy][block[0]]);
  }
}


function clearShadow() {
  for (let block of shadowArray) {
    block.shadow = false;
    if (!block.solid && !block.falling) {
      block.colorState = 0;
    }
  }
  shadowArray = [];
}


function moveHorizontally(shift) {
  let isClear = "true";
  for (let block of currentFallingTetris) {
    if (block [0] + shift + 1 > NUMBER_OF_COLUMNS || block[0] + shift < 0 || tetrisArray[block[1]][block[0] + shift].solid) {
      isClear = false;
    }
  }

  if (isClear) {
    clearShadow();
    clearFallingTetris();

    fallingTetrisCoordinate[0] += shift;
      
    findFallingBlocks();
    findShadow();
  }
}


function moveDown() {
  clearShadow();
  let isClear = "true";
  for (let block of currentFallingTetris) {
    if (block [1] + 2 > NUMBER_OF_ROWS || tetrisArray[block[1] + 1][block[0]].solid) {
      isClear = false;
    }
  }

  if (isClear) {
    clearFallingTetris();

    fallingTetrisCoordinate[1]++;
      
    findFallingBlocks();
    findShadow();
  }
  else {
    for (let block of currentFallingTetris) {
      tetrisArray[block[1]][block[0]].colorState = fallingTetrisColor;
      tetrisArray[block[1]][block[0]].solid = true;
      tetrisArray[block[1]][block[0]].shadow = false;
      tetrisArray[block[1]][block[0]].falling = false;
    }
    
    newBlock();
    clearRow();
    score += softDropPoints;
  }
}


function rotateTetris() {
  if (canRotate()) {
    if (rotationState > 2) {
      rotationState = 0;
    }
    else {
      rotationState++;
    }
    clearFallingTetris();
    clearShadow();
    findFallingBlocks();
    findShadow();
  }


}


function moveAllTheWayDown() {
  clearFallingTetris();
  for (let block of shadowArray) {
    block.colorState = fallingTetrisColor;
    block.solid = true;
    block.shadow = false;
    block.falling = false;
  }
  clearShadow();
  newBlock();
  clearRow();
  score += hardDropPoints;
}


function canRotate() {
  if (!randomFallingTetris) {
    return false;
  }

  let newRotationState;
  let isClear = true;
  if (rotationState > 2) {
    newRotationState = 0;
  }
  else {
    newRotationState = rotationState + 1;
  }

  for (let block of allFallingBlocks[randomFallingTetris][newRotationState]) {
    let newX = fallingTetrisCoordinate[0] + block[0];
    let newY = fallingTetrisCoordinate[1] + block[1];
    if (!(newX >= 0 && newY >= 0 && newX < NUMBER_OF_COLUMNS && newY < NUMBER_OF_ROWS && !tetrisArray[newY][newX].solid)) {
      isClear = false;
    }
  }

  return isClear;
}


function clearFallingTetris() {
  for (let block of currentFallingTetris) {
    tetrisArray[block[1]][block[0]].colorState = 0;
    tetrisArray[block[1]][block[0]].falling = false;
  }
}


function setColorPallet() {
  tetrisColorPallet = [color(60, 60, 60), color(3, 65, 174), color(114, 203, 59), color(255, 213, 0), color(255, 151, 28), color(255, 50, 19)];
  for (let theColor of tetrisColorPallet) {
    tetrisShadowColorPallet.push(lerpColor(tetrisColorPallet[0], theColor, SHADOW_FADE));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setSquareSize();
}


function findFallingBlocks() {
  currentFallingTetris = [];
  for (let block of allFallingBlocks[randomFallingTetris][rotationState]) {
    currentFallingTetris.push([block[0] + fallingTetrisCoordinate[0], block[1] + fallingTetrisCoordinate[1]]);
    tetrisArray[block[1] + fallingTetrisCoordinate[1]][block[0] + fallingTetrisCoordinate[0]].colorState = fallingTetrisColor;
    tetrisArray[block[1] + fallingTetrisCoordinate[1]][block[0] + fallingTetrisCoordinate[0]].falling = true;
  }
}


function clearRow() {
  let rowIsClear;
  let numberOfRowsCleared = 0;
  for (let row of tetrisArray) {
    rowIsClear = true;
    for (let block of row) {
      if (!block.solid) {
        rowIsClear = false;
      }
    }
    
    if (rowIsClear) {
      numberOfRowsCleared++;
      dropMultipleRowsByOne(tetrisArray.indexOf(row));
      tetrisArray.splice(tetrisArray.indexOf(row), 1);
      addRowToTheTop();
    }
  }
  if (numberOfRowsCleared){
    setSquareSize();
    score += rowPointChart[numberOfRowsCleared - 1];
  }
}


function dropMultipleRowsByOne(rowHeight) {
  for (let row = rowHeight - 1; row >= 0; row--) {
    for (let col = 0; col < NUMBER_OF_COLUMNS; col++) {
      tetrisArray[row][col].dropHeightByOne();
    }
  }
}

function addRowToTheTop() {
  let arr = [];
  for (let x = 0; x < NUMBER_OF_COLUMNS; x++) {
    let newTetris = new Tetris(0, x);
    arr.push(newTetris);
  }
  tetrisArray.unshift(arr);
}


function showScore() {
  textSize(20);
  textAlign(LEFT, TOP);
  text(score, 0, 0);
}

function checkGameLoss() {
  for (let block of allFallingBlocks[randomFallingTetris][rotationState]) {
    if (tetrisArray[block[1] + fallingTetrisCoordinate[1]][block[0] + fallingTetrisCoordinate[0]].solid) {
      gameIsOver = true;
    }
  }
}