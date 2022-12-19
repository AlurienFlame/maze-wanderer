import { Cell } from './cell.js';

export class Guide {
  constructor(maze) {
    this.maze = maze;
    this.pos = null;
    this.path = [];
    this.visited = [];
    this.targetCell = null;
  }

  // Modify the agent's pathfinding target to (x,y),
  // returns true if the target is reachable, false otherwise
  updateTargetCell(x, y) {
    this.targetCell = this.maze.getCell(x, y);
    if (!this.targetCell) {
      console.warn(`Target cell ${x},${y} is not in maze`);
      return false;
    }
    this.aStar(this.targetCell);
    // TODO: Check reachability
  }

  stepAlongPath() {
    let nextCell = this.path.shift();
    if (!nextCell) return;
    this.pos = nextCell;
  }

  // Given a target cell, return a path to it as a
  // list of cells, sorted from start to end
  aStar(targetCell) {
    let frontier = [this.pos];
    this.visited = [];

    while (!this.stepAStar(frontier));

    this.path = [];
    for (let pathCell = targetCell; pathCell !== this.pos; pathCell = pathCell.pathOrigin) {
      this.path.push(pathCell);
    }
  }

  // Modifies frontier and visited, returns true if it reaches targetCell
  stepAStar(frontier) {
    if (!frontier.length) {
      console.warn("No path to target");
      return true;
    }

    let cell = frontier.shift();
    if (cell === this.targetCell) return true;

    this.visited.push(cell);
    let neighbors = cell.getNeighborsByEdges();
    let unexploredNeighbors = neighbors.filter(neighbor => !this.visited.includes(neighbor) && !frontier.includes(neighbor));
    let reachableNeighbors = unexploredNeighbors.filter(neighbor => cell.hasGateTo(neighbor));
    frontier.push(...reachableNeighbors);

    for (let neighbor of reachableNeighbors) {
      neighbor.pathOrigin = cell;
    }
  }

  toString() {
    return `Guide(${this.pos.toString()}, path: ${this.path.map(cell => cell.toString()).join(", ")})`;
  }





}