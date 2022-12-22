// Responsible for connecting cells and holding information about the connection
export class Edge {
  constructor(cell1, cell2) {
    this.hasGate = false;
    this.cell1 = cell1;
    this.cell2 = cell2;
    this.weight = Math.random();
  }

  spawnGate() {
    if (this.hasGate) {
      throw new Error("Tried to spawn gate on edge, but edge already has a gate");
    }
    this.hasGate = true;
  }

  isEquivalent(edge) {
    return (this.cell1 === edge.cell1 && this.cell2 === edge.cell2) ||
      (this.cell1 === edge.cell2 && this.cell2 === edge.cell1);
  }

  connects(arr1, arr2) {
    return arr1.includes(this.cell1) && arr2.includes(this.cell2) ||
      arr1.includes(this.cell2) && arr2.includes(this.cell1);
  }

  toString() {
    return `Edge(${this.cell1.toString()}, ${this.cell2.toString()}, ${this.weight})`;
  }

  has(cell) {
    return this.cell1 === cell || this.cell2 === cell;
  }
}