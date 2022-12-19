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
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    this.edges = [];
    this.inMST = false;
  }

  openGate(direction) {
    this[direction] = true; // Open gate in this cell
    let neighbor = this.getNeighbor(direction);
    if (!neighbor) return;
    const oppositeDirection = {
      "up": "down",
      "down": "up",
      "left": "right",
      "right": "left"
    };
    neighbor[oppositeDirection[direction]] = true; // Open corresponding gate in neighbor
  }

  getNeighbor(direction) {
    if (!direction) console.log("Undefined direction given to getNeighbor");
    return this.maze.getCell(this.x + coordFromDirection[direction].x, this.y + coordFromDirection[direction].y);
  }

  getNeighbors() {
    return ["up", "down", "left", "right"].map(direction => this.getNeighbor(direction)).filter(neighbor => neighbor);
  }

  createNeighbor(direction) {
    return new Cell(this.x + coordFromDirection[direction].x, this.y + coordFromDirection[direction].y, this.maze);
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
}