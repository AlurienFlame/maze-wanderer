import { Cell } from './cell.js';

export class Guide {
  constructor(maze) {
    this.maze = maze;
    this.pos = null;
    this.resetPathfinding();
  }

  // Modify the agent's pathfinding target to (x,y),
  // returns true if the target is reachable, false otherwise
  updateTargetCell(x, y) {
    this.targetCell = this.maze.getCell(x, y);
    if (!this.targetCell) {
      console.warn(`Target cell ${x},${y} is not in maze`);
      return false;
    }
    this.frontier = [this.pos];
  }

  resetPathfinding() {
    this.targetCell = null;
    this.path = [];
    this.visited = [];
    this.frontier = [];
  }

  mainLoop() {
    if (!this.targetCell) return;
    if (this.path.length) {
      this.stepAlongPath();
    } else {
      if (this.stepAStar(this.frontier)) {
        // aStar reached target or otherwise couldn't step

        // Build path from visited
        this.path = [];
        for (let pathCell = this.targetCell; pathCell != this.pos ; pathCell = pathCell.pathOrigin) {
          if (!pathCell) {
            // This is normal if the target is unreachable
            console.log("Failed to construct path, giving up.");
            this.resetPathfinding();
            return;
          }
          this.path.push(pathCell);
        }
      }
    }
  }

  stepAlongPath() {
    // Step
    let nextCell = this.path.pop();
    this.pos = nextCell;

    // Reached target
    if (this.pos === this.targetCell) {
      this.resetPathfinding();
    }
  }

  // TODO: this is BFS, make it actually aStar
  // Modifies frontier and visited, returns true if it reaches targetCell
  stepAStar(frontier) {
    if (!frontier.length) {
      console.warn("No path to target");
      return true;
    }

    let cell = frontier.shift();
    if (cell === this.targetCell) return true;

    if (!cell) {
      console.warn("Cell in frontier is null");
      return true;
    }

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