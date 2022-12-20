import { Maze } from './maze.js';
import { Guide } from './guide.js';
const maze = new Maze();
const mazeElem = document.getElementById('maze');
const guide = new Guide(maze);

// Zoom
mazeElem.addEventListener('wheel', (e) => {
  zoom(e.deltaY);
});
window.addEventListener('resize', () => {
  zoom(0);
});

let tileSize = 30; // px
let rows = 0; // Actual number of elements, not data structure
let cols = 0;

// Update the width of tile elements, and add/remove them as needed
function zoom(delta) {
  delta = -Math.min(Math.max(delta, -1), 1); // Clamp and invert
  let rowsBeforeZoom = Math.ceil(mazeElem.clientHeight / tileSize);
  let colsBeforeZoom = Math.ceil(mazeElem.clientWidth / tileSize);
  let deltaPxEntireBoard = delta * tileSize;
  let deltaPxPerTile = deltaPxEntireBoard / Math.max(rowsBeforeZoom, colsBeforeZoom);
  let newTileSize = tileSize + deltaPxPerTile;

  // Clamp zoom level between 1px and the smaller of the maze's width and height
  const MIN_TILE_SIZE = 3;
  const MAX_TILE_SIZE = Math.min(mazeElem.clientWidth, mazeElem.clientHeight);
  if (newTileSize < MIN_TILE_SIZE || newTileSize > MAX_TILE_SIZE) return;


  tileSize = newTileSize; // to update the global variable
  let rowsAfterZoom = Math.ceil(mazeElem.clientHeight / newTileSize);
  let colsAfterZoom = Math.ceil(mazeElem.clientWidth / newTileSize);

  // Rows
  let deltaRows = rowsAfterZoom - rows;
  if (deltaRows > 0) {
    for (let i = 0; i < deltaRows; i++) {
      // Add a row
      for (let j = 0; j < cols; j++) {
        let tile = document.createElement('div');
        tile.classList.add('tile');
        mazeElem.appendChild(tile);
      }
      rows++;
      mazeElem.style.setProperty('--rows', rows);
    }
  } else if (deltaRows < 0) {
    for (let i = 0; i < -deltaRows; i++) {
      // Remove a row
      for (let j = 0; j < cols; j++) {
        mazeElem.removeChild(mazeElem.lastChild);
      }
      rows--;
      mazeElem.style.setProperty('--rows', rows);
    }
  }

  // Columns
  let deltaCols = colsAfterZoom - cols;
  if (deltaCols > 0) {
    for (let i = 0; i < deltaCols; i++) {
      // Add a column
      for (let j = 0; j < rows; j++) {
        let tile = document.createElement('div');
        tile.classList.add('tile');
        mazeElem.insertBefore(tile, mazeElem.children[j * cols + i]);
      }
      cols++;
      mazeElem.style.setProperty('--cols', cols);
    }
  } else if (deltaCols < 0) {
    for (let i = 0; i < -deltaCols; i++) {
      // Remove a column
      for (let j = 0; j < rows; j++) {
        mazeElem.removeChild(mazeElem.children[j * cols]);
      }
      cols--;
      mazeElem.style.setProperty('--cols', cols);
    }
  }

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

function cellCoordsFromTileIndex(index) {
  if (isNaN(index)) {
    console.error('Invalid index to get cell coords from', index);
    return { x: 0, y: 0 };
  }
  let x = index % cols;
  let y = Math.floor(index / cols);
  x += cameraX;
  y += cameraY;
  return { x, y };
}

// Render the maze state to the DOM
function render() {
  for (let i = 0; i < mazeElem.children.length; i++) {
    let tile = mazeElem.children[i];
    let { x, y } = cellCoordsFromTileIndex(i);
    let cell = maze.getCell(x, y);

    // Reset tile style
    tile.style.borderTop = `1px solid ${style('--wall-color')}`;
    tile.style.borderBottom = `1px solid ${style('--wall-color')}`;
    tile.style.borderLeft = `1px solid ${style('--wall-color')}`;
    tile.style.borderRight = `1px solid ${style('--wall-color')}`;
    tile.style.backgroundColor = 'transparent';
    if (!cell) {
      tile.style.backgroundColor = style('--background-color');
    }

    if (!cell) continue;
    // Set tile style based on cell state
    // if (cell.up) tile.style.borderTop = 'none';
    // if (cell.down) tile.style.borderBottom = 'none';
    // if (cell.left) tile.style.borderLeft = 'none';
    // if (cell.right) tile.style.borderRight = 'none';
    if (cell.up) tile.style.borderTop = `1px dashed ${style('--wall-color')}bb`;
    if (cell.down) tile.style.borderBottom = `1px dashed ${style('--wall-color')}bb`;
    if (cell.left) tile.style.borderLeft = `1px dashed ${style('--wall-color')}bb`;
    if (cell.right) tile.style.borderRight = `1px dashed ${style('--wall-color')}bb`;

    // Render guide and its path
    if (!guide) continue;
    if (guide.visited.includes(cell)) {
      tile.style.backgroundColor = style('--visited-color');
    }
    if (guide.path.includes(cell)) {
      tile.style.backgroundColor = style('--path-color');
    }
    if (guide.targetCell === cell) {
      tile.style.backgroundColor = style('--target-color');
    }
    if (guide.pos === cell) {
      tile.style.backgroundColor = style('--guide-color');
    }
  }
}

// Control Guide
mazeElem.addEventListener('click', (e) => {
  if (e.target === mazeElem) return; // Click and drag gets wrong target
  let { x, y } = cellCoordsFromTileIndex(Array.from(mazeElem.children).indexOf(e.target));
  if (!maze.getCell(x, y)) {
    // Generate a new block if clicked outside of existing maze
    maze.generateBlock(x - x % blockSize, y - y % blockSize, blockSize, blockSize);
  }
  guide.updateTargetCell(x, y);
  render();
});

main();
function main() {
  maze.generateBlock(0, 0, blockSize, blockSize);
  // maze.generateBlock(blockSize, 0, blockSize, blockSize);
  guide.pos = maze.getCell(0, 0);


  zoom(0); // Generate initial tile elements

}