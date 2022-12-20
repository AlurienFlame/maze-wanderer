import { Cell } from './cell.js';

export class Guide {
  constructor(maze) {
    this.maze = maze;
    this.pos = null;
    this.origins = {};
    this.resetPathfinding();
  }

  // Modify the agent's pathfinding target to (x,y),
  // returns true if the target is reachable, false otherwise
  updateTargetCell(x, y) {
    this.resetPathfinding();
    this.targetCell = this.maze.getCell(x, y);
    if (!this.targetCell) {
      // This should never happen now, as we generate blocks on click
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
    if (this.path.length) { // FIXME: Follows path even if target got moved
      this.stepAlongPath();
    } else {
      if (this.stepAStar()) {
        // aStar reached target or otherwise couldn't step

        // Build path from visited
        this.path = [];
        for (let pathCell = this.targetCell; pathCell != this.pos; pathCell = this.origins[pathCell]) {
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

  // Modifies frontier and visited, returns true if it reaches targetCell
  stepAStar() {
    if (!this.frontier.length) {
      console.warn("No path to target");
      return true;
    }

    this.frontier.sort((a, b) => a.detourCost - b.detourCost);
    let cell = this.frontier.shift();
    if (cell === this.targetCell) return true;

    if (!cell) {
      console.warn("Cell in frontier is null");
      return true;
    }

    this.visited.push(cell);
    let neighbors = cell.getNeighborsByEdges();

    for (let neighbor of neighbors) {
      if (this.visited.includes(neighbor) || this.frontier.includes(neighbor)) continue;
      if (!cell.hasGateTo(neighbor)) continue;

      this.distanceFromStart = (cell.distanceFromStart ?? 0) + 1;
      let distanceToTarget =
        Math.abs(neighbor.x - this.targetCell.x) +
        Math.abs(neighbor.y - this.targetCell.y);
      neighbor.detourCost = this.distanceFromStart + distanceToTarget;
      this.frontier.push(neighbor);
      this.origins[neighbor] = cell;
    }
  }

  toString() {
    return `Guide(${this.pos.toString()}, path: ${this.path.map(cell => cell.toString()).join(", ")})`;
  }





}