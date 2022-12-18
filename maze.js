import { Cell } from "./cell.js";

export class Maze {
  constructor() {
    this.cells = {};
  }

  generateBlock(x, y, width, height) {
    for (let i = x; i < x + width; i++) {
      for (let j = y; j < y + height; j++) {
        // grid of one less size to hold gates
        let cell = this.getCell(i, j) || new Cell(i, j, this);

        if ((cell.up || cell.down || cell.left || cell.right)) continue;
        // if cell has no gates, generate one to a neighbor with no gates

        let directionsWithFreeNeighbors = ["up", "down", "left", "right"].filter(direction => {
          let neighbor = cell.getNeighbor(direction) || cell.createNeighbor(direction);
          return !(neighbor.up || neighbor.down || neighbor.left || neighbor.right);
        });
        if (directionsWithFreeNeighbors.length === 0) continue;

        // console.log(`Cell ${cell.x},${cell.y} has free neighbors ${directionsWithFreeNeighbors.join(", ")}`);
        let direction = directionsWithFreeNeighbors[Math.floor(Math.random() * directionsWithFreeNeighbors.length)];

        // console.log(`Opening gate ${direction} in cell ${cell.x},${cell.y} and corresponding gate in neighbor`);
        cell.openGate(direction);
      }
    }
  }

  getCell(x, y) {
    return this.cells[`${x},${y}`];
  }

  setCell(x, y, cell) {
    this.cells[`${x},${y}`] = cell;
  }
}