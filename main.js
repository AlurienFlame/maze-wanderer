import { Maze } from './maze.js';
import { Guide } from './guide.js';
const maze = new Maze();
const mazeElem = document.getElementById('maze');
const guide = new Guide(maze);

// Zoom
mazeElem.addEventListener('wheel', (e) => {
  zoom(e.deltaY);
});
window.addEventListener('resize', updateSize);
function updateSize() {
  zoom(0);

  // Reactive canvas
  let minViewSize = Math.min(mazeElem.clientWidth, mazeElem.clientHeight);
  mazeElem.setAttribute('width', minViewSize);
  mazeElem.setAttribute('height', minViewSize);
}

let tileSize = 30; // px
let strokeSize;

// Update the width of tile elements, and add/remove them as needed
function zoom(delta) {
  delta = -Math.min(Math.max(delta, -1), 1); // Clamp and invert
  tileSize += delta;
  strokeSize = Math.max(1, Math.floor(tileSize / 10));

  render();
}

// Pan
document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowUp') {
    pan(0, -1);
  } else if (e.key === 'ArrowDown') {
    pan(0, 1);
  } else if (e.key === 'ArrowLeft') {
    pan(-1, 0);
  } else if (e.key === 'ArrowRight') {
    pan(1, 0);
  }
});

let cameraX = 0; // Cell coords
let cameraY = 0;
const blockSize = 32;

// Change tile element classes to represent a different part of the maze state
// Should get called during pathfinding traversal
function pan(deltaX, deltaY) {
  cameraX += deltaX;
  cameraY += deltaY;
  render();
}

// Helper for rendering
const rootStyles = getComputedStyle(document.documentElement);
function style(name) {
  return rootStyles.getPropertyValue(name);
}

function render() {
  let ctx = mazeElem.getContext('2d');
  ctx.strokeStyle = style('--wall-color');
  ctx.lineWidth = strokeSize;
  for (let x = 0; x <= Math.floor(mazeElem.clientWidth / tileSize); x++) {
    for (let y = 0; y <= Math.floor(mazeElem.clientHeight / tileSize); y++) {
      let cellX = x + cameraX;
      let cellY = y + cameraY;
      let pX = x * tileSize;
      let pY = y * tileSize;
      let cell = maze.getCell(cellX, cellY);
      
      // Cell background
      if (!cell) {
        ctx.fillStyle = style('--background-color');
      } else if (guide.pos == cell) {
        ctx.fillStyle = style('--guide-color');
      } else if (guide.targetCell == cell) {
        ctx.fillStyle = style('--target-color');
      } else if (guide.path.includes(cell)) {
        ctx.fillStyle = style('--path-color');
      } else if (guide.visited.includes(cell)) {
        ctx.fillStyle = style('--visited-color');
      } else {
        ctx.fillStyle = style('--maze-color');
      }

      // Cell borders
      ctx.beginPath();
      if (cell) {
        if (!cell.hasGateToDirection("up")) {
          ctx.moveTo(pX, pY);
          ctx.lineTo(pX + tileSize, pY);
        }
        if (!cell.hasGateToDirection("down")) {
          ctx.moveTo(pX, pY + tileSize);
          ctx.lineTo(pX + tileSize, pY + tileSize);
        }
        if (!cell.hasGateToDirection("left")) {
          ctx.moveTo(pX, pY);
          ctx.lineTo(pX, pY + tileSize);
        }
        if (!cell.hasGateToDirection("right")) {
          ctx.moveTo(pX + tileSize, pY);
          ctx.lineTo(pX + tileSize, pY + tileSize);
        }
      }
      ctx.fillRect(pX, pY, tileSize, tileSize);
      ctx.stroke();
    }
  }
}

// Control Guide
mazeElem.addEventListener('click', (e) => {
  let Px = e.offsetX;
  let Py = e.offsetY;
  let x = Math.floor(Px / tileSize) + cameraX;
  let y = Math.floor(Py / tileSize) + cameraY;
  if (!maze.getCell(x, y)) {
    // Generate a new block if clicked outside of existing maze
    maze.generateBlock(Math.floor(x / blockSize)*blockSize, Math.floor(y / blockSize)*blockSize, blockSize, blockSize);
  }
  guide.updateTargetCell(x, y);
  render();
});

setInterval(() => {
  guide.mainLoop();
  render();
}, 1000 / 30);

main();
function main() {
  maze.generateBlock(0, 0, blockSize, blockSize);
  guide.pos = maze.getCell(0, 0);


  updateSize();
}