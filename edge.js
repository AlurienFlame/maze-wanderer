export class Edge {
  constructor(cell1, cell2) {
    this.cell1 = cell1;
    this.cell2 = cell2;
  }

  spawnGate() {
    if (this.cell1.x === this.cell2.x) {
      if (this.cell1.y < this.cell2.y) {
        this.cell1.down = true;
        this.cell2.up = true;
      } else {
        this.cell1.up = true;
        this.cell2.down = true;
      }
    } else if (this.cell1.y === this.cell2.y) {
      if (this.cell1.x < this.cell2.x) {
        this.cell1.right = true;
        this.cell2.left = true;
      } else {
        this.cell1.left = true;
        this.cell2.right = true;
      }
    } else {
      throw new Error("Tried to spawn gate on edge, but cells are not adjacent");
    }
  }

}