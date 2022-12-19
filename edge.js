export class Edge {
  constructor(cell1, cell2) {
    this.cells = new Set([cell1, cell2]);
    this.weight = Math.random();
  }

  spawnGate() {
    let cell1 = this.cells[0];
    let cell2 = this.cells[1];

    if (cell1.x === cell2.x) {
      if (cell1.y < cell2.y) {
        cell1.down = true;
        cell2.up = true;
      } else {
        cell1.up = true;
        cell2.down = true;
      }
    } else if (cell1.y === cell2.y) {
      if (cell1.x < cell2.x) {
        cell1.right = true;
        cell2.left = true;
      } else {
        cell1.left = true;
        cell2.right = true;
      }
    } else {
      throw new Error("Tried to spawn gate on edge, but cells are not adjacent");
    }
  }

}