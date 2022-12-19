import { Maze } from './maze.js';
const maze = new Maze();
maze.generateBlock(0, 0, 20, 20);

// Display & Events
const mazeElem = document.getElementById('maze');

mazeElem.addEventListener('wheel', (e) => {
  zoom(e.deltaY);
});

let tileSize = 200; // px
let rows = 0; // Actual number of elements, not data structure
let cols = 0;
zoom(0); // Generate initial elements

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

mazeElem.addEventListener('keyup', (e) => {
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

// Change tile element classes to represent a different part of the maze state
// Should get called during pathfinding traversal
function pan(deltaX, deltaY) {
  // TODO
  console.warn('pan() not implemented');
}

function render() {
  for (let i = 0; i < mazeElem.children.length; i++) {
    let tile = mazeElem.children[i];
    let x = i % cols;
    let y = Math.floor(i / cols);
    let cell = maze.getCell(x, y);

    // Reset tile style
    tile.style.borderTop = '3px solid #665C54';
    tile.style.borderBottom = '3px solid #665C54';
    tile.style.borderLeft = '3px solid #665C54';
    tile.style.borderRight = '3px solid #665C54';
    tile.style.backgroundColor = 'transparent';
    if (!cell) {
      tile.style.backgroundColor = '#3f3a37';
    }

    // Set tile style based on cell state
    // if (cell.up) tile.style.borderTop = 'none';
    // if (cell.down) tile.style.borderBottom = 'none';
    // if (cell.left) tile.style.borderLeft = 'none';
    // if (cell.right) tile.style.borderRight = 'none';
    if (!cell) continue;
    if (cell.up) tile.style.borderTop = '3px dashed #665C5455';
    if (cell.down) tile.style.borderBottom = '3px dashed #665C5455';
    if (cell.left) tile.style.borderLeft = '3px dashed #665C5455';
    if (cell.right) tile.style.borderRight = '3px dashed #665C5455';

  }


}