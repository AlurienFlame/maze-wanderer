import { Cell } from './cell.js';

export class Guide {
  constructor(maze) {
    this.maze = maze;
    this.pos = null;
    this.path = [];
    this.targetCell = null;
  }

  // Modify the agent's pathfinding target to (x,y),
  // returns true if the target is reachable, false otherwise
  updateTargetCell(x, y) {
    this.targetCell = this.maze.getCell(x, y);
    if (!this.targetCell) {
      console.log(`Target cell ${this.targetCell.toString()} is not in maze`);
      return false;
    }
    this.path = this.aStar(this.targetCell);
  }

  stepAlongPath() {
    let nextCell = this.path.shift();
    if (!nextCell) return;
    this.pos = nextCell;
  }

  // Given a target cell, return a path to it as a
  // list of cells, sorted from start to end
  aStar(targetCell) {
    console.warn("Guide.aStar not implemented");
    return [];
  }

  toString() {
    return `Guide(${this.pos.toString()}, path: ${this.path.map(cell => cell.toString()).join(", ")})`;
  }





}