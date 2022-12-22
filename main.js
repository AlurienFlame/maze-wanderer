import { Maze } from './maze.js';
import { Guide } from './guide.js';
import { SquareGrid } from './squareGrid.js';
const maze = new Maze();
const mazeElem = document.getElementById('maze');
const grid = new SquareGrid();
const guide = new Guide(grid);

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
const blockSize = 8;

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
      let cell = grid.getCell(cellX, cellY);
      
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
        if (!grid.getCell(cellX, cellY - 1)?.edges.find((e) => e.has(cell)).hasGate) {
          ctx.moveTo(pX, pY);
          ctx.lineTo(pX + tileSize, pY);
        }
        if (!grid.getCell(cellX, cellY + 1)?.edges.find((e) => e.has(cell)).hasGate) {
          ctx.moveTo(pX, pY + tileSize);
          ctx.lineTo(pX + tileSize, pY + tileSize);
        }
        if (!grid.getCell(cellX - 1, cellY)?.edges.find((e) => e.has(cell)).hasGate) {
          ctx.moveTo(pX, pY);
          ctx.lineTo(pX, pY + tileSize);
        }
        if (!grid.getCell(cellX + 1, cellY)?.edges.find((e) => e.has(cell)).hasGate) {
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
  // FIXME: x and y are offest by chunk coords
  let x = Math.floor(Px / tileSize) + cameraX;
  let y = Math.floor(Py / tileSize) + cameraY;
  if (!grid.getCell(x, y)) {
    // Generate a new block if clicked outside of existing maze
    let chunk = grid.expand(Math.floor(x / blockSize)*blockSize, Math.floor(y / blockSize)*blockSize, blockSize, blockSize);
    maze.amazeChunk(grid.cells, chunk);
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
  let initialChunk = grid.expand(0, 0, blockSize, blockSize);
  maze.amazeChunk(grid.cells, initialChunk);
  guide.pos = grid.getCell(0, 0);


  updateSize();
}