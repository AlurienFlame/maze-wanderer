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
}