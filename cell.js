const coordFromDirection = {
  "up": { x: 0, y: -1 },
  "down": { x: 0, y: 1 },
  "left": { x: -1, y: 0 },
  "right": { x: 1, y: 0 }
};

export class Cell {
  constructor(x, y, maze) {
    this.x = x;
    this.y = y;
    this.maze = maze;
    this.edges = [];
    this.inMST = false;
  }

  openGate(direction) {
    let neighbor = this.getNeighbor(direction);
    if (!neighbor) {
      throw new Error(`Tried to open gate from ${this.toString()} in direction ${direction} but there is no neighbor in that direction`);
    }
    let edge = this.edges.find(edge => edge.cell1 === neighbor || edge.cell2 === neighbor);
    if (!edge) {
      throw new Error(`Tried to open gate from ${this.toString()} to ${neighbor.toString()} but there is no edge between them`);
    }
    edge.spawnGate();
  }

  getNeighbor(direction) {
    if (!direction) console.log("Undefined direction given to getNeighbor");
    return this.maze.getCell(this.x + coordFromDirection[direction].x, this.y + coordFromDirection[direction].y);
  }

  getNeighbors() {
    return ["up", "down", "left", "right"].map(direction => this.getNeighbor(direction)).filter(neighbor => neighbor);
  }

  getNeighborsByEdges() {
    return this.edges.map(edge => edge.cell1 === this ? edge.cell2 : edge.cell1);
  }

  validate() {
    // No duplicate edges
    for (let i = 0; i < this.edges.length; i++) {
      for (let j = i + 1; j < this.edges.length; j++) {
        if (this.edges[i].weight === this.edges[j].weight) {
          console.warn(`Equal weights on edges ${this.edges[i]} and ${this.edges[j]}`);
          return false;
        }
        if (this.edges[i].isEquivalent(this.edges[j])) {
          console.warn(`Equivalent edges ${this.edges[i]} and ${this.edges[j]}`);
          return false;
        }
      }
    }
    return true;
  }

  toString() {
    return `Cell(${this.x},${this.y})`;
  }

  hasGateTo(cell) {
    let edge = this.edges.find(edge => edge.cell1 === cell || edge.cell2 === cell);
    if (!edge) return false;
    return edge.hasGate;
  }

  hasGateToDirection(direction) {
    return this.hasGateTo(this.getNeighbor(direction));
  }
}