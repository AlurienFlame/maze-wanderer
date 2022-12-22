import { Cell } from "./cell.js";
import { Edge } from "./edge.js";
import { Maze } from "./maze.js";

export class SquareGrid {
  constructor() {
    this.cells = {};
  }

  toString() {
    return `SquareGrid(${Object.values(this.cells).length} cells)`;
  }

  getCell(x, y) {
    return this.cells[`${x},${y}`];
  }

  setCell(x, y, cell) {
    this.cells[`${x},${y}`] = cell;
  }

  validate() {
    for (let cell of Object.values(this.cells)) {
      if (cell.edges.length > 4) {
        console.warn(`${cell.toString()} has more than 4 edges.`);
        return false;
      }
      if (!cell.validate()) {
        console.warn(`${cell.toString()} failed to validate itself.`);
        return false;
      }
    }
    return true;
  }

  expand(x, y, width, height) {
    // Generate cells
    let chunkCells = [];
    for (let i = x; i < x + width; i++) {
      for (let j = y; j < y + height; j++) {
        let cell = new Cell();
        this.setCell(i, j, cell);
        chunkCells.push(cell);
      }
    }

    // Generate edges
    for (let i = x; i < x + width; i++) {
      for (let j = y; j < y + height; j++) {
        let cell = this.getCell(i, j);
        for (let neighbor of this.getNeighborsOf(i, j)) {
          let edge = new Edge(cell, neighbor);
          if (cell.edges.some(cellEdge => cellEdge.isEquivalent(edge))) continue;
          cell.edges.push(edge);
          neighbor.edges.push(edge);
        }
      }
    }

    console.log(`Generated ${width}x${height} chunk at ${x},${y} with ${Object.values(chunkCells).length} cells`);
    this.validate();
    return chunkCells;
  }

  getNeighborsOf(x, y) {
    let neighbors = [];
    neighbors.push(this.getCell(x + 1, y));
    neighbors.push(this.getCell(x - 1, y));
    neighbors.push(this.getCell(x, y + 1));
    neighbors.push(this.getCell(x, y - 1));
    return neighbors.filter(cell => cell);
  }

  getCoordsOf(cell) {
    for (let [coords, prospectiveCell] of Object.entries(this.cells)) {
      if (cell === prospectiveCell) {
        return coords.split(",").map(coord => parseInt(coord));
      }
    }
    return null;
  }

  getDistanceBetween(cell1, cell2) {
    let [ x1, y1 ] = this.getCoordsOf(cell1);
    let [ x2, y2 ] = this.getCoordsOf(cell2);
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }
}