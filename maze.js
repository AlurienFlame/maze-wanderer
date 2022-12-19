import { Cell } from "./cell.js";
import { Edge } from "./edge.js";

export class Maze {
  constructor() {
    this.cells = {};
  }

  generateBlock(x, y, width, height) {
    // Generate cells
    let blockCells = [];
    for (let i = x; i < x + width; i++) {
      for (let j = y; j < y + height; j++) {
        let cell = new Cell(i, j, this);
        this.setCell(i, j, cell);
        blockCells.push(cell);
      }
    }

    // Generate an edge between each cell in the block and its neighbor
    let edges = [];
    for (let cell of Object.values(blockCells)) {
      if (cell.getNeighbor("right")) edges.push(new Edge(cell, cell.getNeighbor("right")));
      if (cell.getNeighbor("down")) edges.push(new Edge(cell, cell.getNeighbor("down")));
    }

    // Apply Prim's algorithm to generate a minimum spanning tree
    let nodesInTree = [blockCells[0]];
    // console.log([blockCells[0]]); // Array containing one cell
    // console.log(nodesInTree); // Array of all cells??
    let nodesNotInTree = blockCells.slice(1);
    let edgesInTree = [];
    let edgesOnFrontier = [];

    // Move any node connecting outside of the tree onto the frontier
    for (let edge of edges) {
      if (edge.inOneOf(nodesInTree, nodesNotInTree)) {
        edgesOnFrontier.push(edge);
      }
    }

    if (edgesOnFrontier.length !== 2) {
      console.warn("First addition of nodes to frontier did not add exactly two nodes");
    }

    while (edgesOnFrontier.length) {
      // Select an edge on the frontier with minimum weight
      edgesOnFrontier.sort((e1, e2) => e1.weight - e2.weight);
      let edge = edgesOnFrontier.shift();

      if (!edge) {
        console.warn("Could not find edge to add to tree");
        break;
      }

      // Add the edge to the tree
      edgesInTree.push(edge);

      // Move the newly added node into the tree
      nodesNotInTree.splice(nodesNotInTree.indexOf(edge.cell2), 1);
      nodesInTree.push(edge.cell2);

      // Add all edges in {v,w|w∈S2} into E
      edgesOnFrontier = edgesOnFrontier.concat(edges.filter(edge => edge.inOneOf(nodesInTree, nodesNotInTree)));
    }

    for (let edge of edgesInTree) {
      edge.spawnGate();
    }



    console.log(`Generated block at ${x},${y} with ${Object.values(blockCells).length} cells`);
    // Add gates at edges of block
  }

  // generateBlock(x, y, width, height) {
  //   for (let i = x; i < x + width; i++) {
  //     for (let j = y; j < y + height; j++) {
  //       // grid of one less size to hold gates
  //       let cell = this.getCell(i, j) || new Cell(i, j, this);

  //       if ((cell.up || cell.down || cell.left || cell.right)) continue;
  //       // if cell has no gates, generate one to a neighbor with no gates

  //       let directionsWithFreeNeighbors = ["up", "down", "left", "right"].filter(direction => {
  //         let neighbor = cell.getNeighbor(direction) || cell.createNeighbor(direction);
  //         return !(neighbor.up || neighbor.down || neighbor.left || neighbor.right);
  //       });
  //       if (directionsWithFreeNeighbors.length === 0) continue;

  //       // console.log(`Cell ${cell.x},${cell.y} has free neighbors ${directionsWithFreeNeighbors.join(", ")}`);
  //       let direction = directionsWithFreeNeighbors[Math.floor(Math.random() * directionsWithFreeNeighbors.length)];

  //       // console.log(`Opening gate ${direction} in cell ${cell.x},${cell.y} and corresponding gate in neighbor`);
  //       cell.openGate(direction);
  //     }
  //   }
  // }

  getCell(x, y) {
    return this.cells[`${x},${y}`];
  }

  setCell(x, y, cell) {
    this.cells[`${x},${y}`] = cell;
  }
}