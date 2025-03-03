/* eslint-disable indent */
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

let backgroundMusic;
let placeSound;
let lostSound;


let numberOfRowsWithBlocks = 0;

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
let highScore = 0;
let rowPointChart = [40, 100, 300, 1200];
let hardDropPoints = 8;
let softDropPoints = 4;

let gameState = "idle";

let swappedRandomFallingTetris;
let swappedFallingTetrisColor;
let hasBeenSwapped = false;

let titleXShift = 5;
let titleYShift = 0;
let textColorGradients;


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
      square(this.x + xSquarePadding, this.y + ySquarePadding, squareSize);
    }
    else if (this.falling || this.solid) {
      fill(tetrisShadowColorPallet[this.colorState]);
      square(this.x + xSquarePadding, this.y + ySquarePadding, squareSize);
      fill(tetrisColorPallet[this.colorState]);
      square(this.x + xSquarePadding+5, this.y + ySquarePadding+5, squareSize-10);
    }
    else {
      fill(tetrisColorPallet[0]);
      square(this.x + xSquarePadding, this.y + ySquarePadding, squareSize);
    }
  }
}


function preload() {
  backgroundMusic = loadSound("background-music.mp3");
  placeSound = loadSound("placeSound.wav");
  lostSound = loadSound("lostSound.wav");
}


function setup() {
  if (getItem("highScore")) {
    highScore = getItem("highScore");
  }
  createCanvas(windowWidth, windowHeight);
  setColorPallet();
  createEmptySquareGrid();
  setSquareSize();
  newBlock();
  findShadow();
  
  swappedRandomFallingTetris = Math.floor(Math.random() * 7);
  swappedFallingTetrisColor = Math.floor(Math.random() * (tetrisColorPallet.length - 1)) + 1;

  textColorGradients = [color(255, 193, 0), color(255, 154, 0), color(255, 116, 0), color(255, 77, 0), color(255, 0, 0)];

  displayGrid();
  filter(BLUR, 30);

  lostSound.setVolume(0.03);
  backgroundMusic.setVolume(0.1);
  placeSound.setVolume(0.1);
}


function draw() {
  if (gameState === "idle") {
    displayTextInCenter("Click to Start");
  }
  else if (gameState === "playing") {
    background(255);

    if (frameCount % 15 === 0) {
      moveDown();
    }

    for (let arr of tetrisArray) {
      for (let newTetris of arr) {
        newTetris.display();
      }
    }

    showScore();
    //filter(BLUR, numberOfRowsWithBlocks*0.5);
  }
  else if (gameState === "lost") {
    displayTextInCenter("Game Over\nclick to restart");
  }
}


function keyPressed() {
  if (gameState === "playing") {
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
    if (key === "c") {
      swapBlocks();
    }
    if (key === "z") {
      rotateTetrisOtherWay();
    }
    if (key === "Escape") {
      gameState = "pause";
      filter(BLUR, 20);
      displayTextInCenter("Paused");
    }
  }
  else if (key === "Escape" || gameState === "pause") {
    gameState = "playing";
  }
}


function mouseClicked() {
  if (gameState === "idle") {
    gameState = "liminal";
  
    backgroundMusic.loop();

    let delayBlurCountdownArray = [["3", 15, 900], ["2", 10, 1900], ["1", 5, 3100], ["", 0, 4000]];
    for (let delayBlurCountdown of delayBlurCountdownArray) {
      delayedBlur(delayBlurCountdown[0], delayBlurCountdown[1], delayBlurCountdown[2]);
    }
  }
  else if (gameState === "lost") {
    location.reload();
  }
}


function delayedBlur(countdown, blurriness, delay) {
  setTimeout(() => {
    background(255);
    displayGrid();
    filter(BLUR, blurriness);

    if (!!countdown) {
      displayTextInCenter(countdown, 250);
    }
    else {
      gameState = "playing";
    }

  }, delay);
}


function displayTextInCenter(string, size=width/8) {
  textAlign(CENTER, CENTER);
  textSize(size);

  for (let textNumber = 0; textNumber < textColorGradients.length; textNumber++) {
    // Creates multiple layers of text to make a gradient illusion
    fill(textColorGradients[textNumber]);
    text(string, width / 2 + titleXShift * (textColorGradients.length - textNumber), height / 2 + titleYShift * (textColorGradients.length - textNumber));
  }
}


function displayGrid() {
  for (let arr of tetrisArray) {
    for (let newTetris of arr) {
      newTetris.display();
    }
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
  clearRow();
  rotationState = 0;
  hasBeenSwapped = false;
  randomFallingTetris = Math.floor(Math.random() * 7);
  fallingTetrisColor = randomFallingTetris + 1;

  fallingTetrisCoordinate = [4, 0];
  updateTetrisFrame();
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
    fallingTetrisCoordinate[0] += shift;
    updateTetrisFrame();
  }
}


function moveDown() {
  let isClear = "true";
  for (let block of currentFallingTetris) {
    if (block [1] + 2 > NUMBER_OF_ROWS || tetrisArray[block[1] + 1][block[0]].solid) {
      isClear = false;
    }
  }

  if (isClear) {
    fallingTetrisCoordinate[1]++;
    updateTetrisFrame();
  }
  else {
    replaceShadowWithSolid();
    currentFallingTetris = [];
    clearShadow();
    
    newBlock();
    increaseScore(softDropPoints);
  }
}


function increaseScore(increaseBy) {
  score += increaseBy;
  if (score > highScore) {
    highScore = score;
    storeItem("highScore", highScore);
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
    updateTetrisFrame();
  }
}


function rotateTetrisOtherWay() {
  if (canRotate()) {
    if (rotationState < 1) {
      rotationState = 3;
    }
    else {
      rotationState--;
    }
    updateTetrisFrame();
  }
}


function moveAllTheWayDown() {
  clearFallingTetris();
  replaceShadowWithSolid();
  newBlock();
  increaseScore(hardDropPoints);
}


function replaceShadowWithSolid() {
  for (let block of shadowArray) {
    block.colorState = fallingTetrisColor;
    block.solid = true;
    block.shadow = false;
    block.falling = false;
  }
  currentFallingTetris = [];
  shadowArray = [];

  placeSound.play();
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
  if (currentFallingTetris) {
    for (let block of currentFallingTetris) {
      tetrisArray[block[1]][block[0]].colorState = 0;
      tetrisArray[block[1]][block[0]].falling = false;
    }
    currentFallingTetris = [];
  }
}


function swapBlocks() {
  if (!hasBeenSwapped) {
    rotationState = 0;
    randomFallingTetris = [swappedRandomFallingTetris, swappedRandomFallingTetris = randomFallingTetris][0];
    fallingTetrisColor = [swappedFallingTetrisColor, swappedFallingTetrisColor = fallingTetrisColor][0];
    

    fallingTetrisCoordinate = [4, 0];
    updateTetrisFrame();

    hasBeenSwapped = true;
  }
}


function setColorPallet() {
  tetrisColorPallet = [color(60, 60, 60), color(240,240,0), color(240,160,0), color(0,0,240), color(0,240,240), color(240,0,0), color(144,0,216), color(0,240,0)];
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
  let rowIsFull;
  let rowHasBlock;
  let numberOfRowsCleared = 0;
  numberOfRowsWithBlocks = 0;
  for (let row of tetrisArray) {
    rowIsFull = true;
    rowHasBlock = false;
    for (let block of row) {
      if (!block.solid) {
        rowIsFull = false;
      }
      else {
        rowHasBlock = true;
      }
    }
    
    if (rowIsFull) {
      numberOfRowsCleared++;
      dropMultipleRowsByOne(tetrisArray.indexOf(row));
      tetrisArray.splice(tetrisArray.indexOf(row), 1);
      addRowToTheTop();
    }

    if (rowHasBlock) {
      numberOfRowsWithBlocks++;
    }
  }

  if (numberOfRowsCleared){
    setSquareSize();
    increaseScore(rowPointChart[numberOfRowsCleared - 1]);
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
  fill("black");
  textSize(70);
  textAlign(LEFT, TOP);
  text(withComas(score), 0, 0);
  
  textAlign(RIGHT, TOP);
  text(withComas(highScore), width, 0);
}


function checkGameLoss() {
  for (let block of allFallingBlocks[randomFallingTetris][rotationState]) {
    if (tetrisArray[block[1] + fallingTetrisCoordinate[1]][block[0] + fallingTetrisCoordinate[0]].solid) {
      gameState = "lost";
      backgroundMusic.stop();
      lostSound.play();
    }
  }
}


function withComas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function updateTetrisFrame() {
  clearFallingTetris();
  findFallingBlocks();
  clearShadow();
  findShadow();
}
