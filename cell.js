// Responsible for holding edges
export class Cell {
  constructor() {
    this.edges = [];
  }

  getNeighborsByEdges() {
    return this.edges.map(edge => edge.cell1 === this ? edge.cell2 : edge.cell1);
  }

  validate() {
    // No duplicate edges
    for (let i = 0; i < this.edges.length; i++) {
      for (let j = i + 1; j < this.edges.length; j++) {
        if (this.edges[i].isEquivalent(this.edges[j])) {
          console.warn(`Equivalent edges ${this.edges[i]} and ${this.edges[j]}`);
          return false;
        }
      }
    }
    return true;
  }

  toString() {
    return `Cell(${this.edges.length} edges, ${this.edges.filter(edge => edge.hasGate).length} gates)`;
  }

  hasGateTo(cell) {
    let edge = this.edges.find(edge => edge.cell1 === cell || edge.cell2 === cell);
    if (!edge) return false;
    return edge.hasGate;
  }
}