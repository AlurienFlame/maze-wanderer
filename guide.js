// Responsible for pathfinding
export class Guide {
  constructor(grid) {
    this.grid = grid;
    this.pos = null;
    this.origins = new Map();
    this.resetPathfinding();
  }

  // Modify the agent's pathfinding target to (x,y),
  // returns true if the target is reachable, false otherwise
  updateTargetCell(x, y) {
    this.resetPathfinding();
    this.targetCell = this.grid.getCell(x, y);
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
        this.constructPath();
      }
    }
  }

  // Build path from visited
  constructPath() {
    // TODO: this should happen incrementally too
    this.path = [];
    for (let pathCell = this.targetCell; pathCell != this.pos; pathCell = this.origins.get(pathCell)) {
      if (!pathCell) {
        // This is normal if the target is unreachable
        console.log("Failed to construct path, giving up.");
        this.resetPathfinding();
        return;
      }
      this.path.push(pathCell);
      if (this.path.length > Object.values(this.grid.cells).length) {
        console.warn(`Path has more cells (${this.path.length}) than entire grid (${Object.values(this.grid.cells).length}), probably stuck in a loop, giving up.`);
        this.resetPathfinding();
        return;
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
    if (neighbors.includes(cell)) {
      console.warn(`Cell ${cell} has itself as neighbor`);
      return true;
    }

    for (let neighbor of neighbors) {
      if (this.visited.includes(neighbor) || this.frontier.includes(neighbor)) continue;
      if (!cell.hasGateTo(neighbor)) continue;

      this.distanceFromStart = (cell.distanceFromStart ?? 0) + 1;
      let distanceToTarget = this.grid.getDistanceBetween(neighbor, this.targetCell);
      neighbor.detourCost = this.distanceFromStart + distanceToTarget;
      this.frontier.push(neighbor);
      this.origins.set(neighbor, cell);
      if (neighbor === cell) {
        console.warn(`Loop detected in pathfinding: ${cell} has itself as neighbor`);
        return true;
      }
    }
    // FIXME: path ends up just being the target cell over and over
  }

  toString() {
    return `Guide(${this.pos.toString()}, path: ${this.path.map(cell => cell.toString()).join(", ")})`;
  }
}