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
    let edges = new Set();
    for (let cell of Object.values(blockCells)) {
      for (let neighbor of cell.getNeighbors()) {
        edges.add(new Edge(cell, neighbor));
      }
    }

    // Apply Prim's algorithm to generate a minimum spanning tree
    let nodesInTree = [blockCells[0]]; // S1
    let nodesNotInTree = blockCells.slice(1); // S2
    let edgesInTree = []; // T
    let edgesOnFrontier = []; // E

    console.log(edges);

    // Add all edges in {u,v|v∈S2} into E
    for (let edge of edges) {
      if (nodesInTree.includes(edge.cells[0]) && nodesNotInTree.includes(edge.cells[1])) {
        edgesOnFrontier.add(edge);
      }
      if (nodesInTree.includes(edge.cells[1]) && nodesNotInTree.includes(edge.cells[0])) {
        edgesOnFrontier.add(edge);
      }
    }
    
    if (edgesOnFrontier.length !== 2) {
      console.log("Failure to properly implement Prim's algorithm");
    }

    while (nodesNotInTree.length > 0) {
      // Select an edge {u,v|u∈S1,v∈S2,(u,v)∈E} with minimum weight
      edgesOnFrontier.sort((e1, e2) => e1.weight - e2.weight);
      let edge = edgesOnFrontier.shift();

      // Add {u,v} to T
      edgesInTree.push(edge);

      // Add v to S1
      nodesInTree.push(edge.cells[1]);

      // Add all edges in {v,w|w∈S2} into E
      for (let edge of edges) {
        if (nodesInTree.includes(edge.cells[0]) && nodesNotInTree.includes(edge.cells[1])) {
          edgesOnFrontier.add(edge);
        }
        if (nodesInTree.includes(edge.cells[1]) && nodesNotInTree.includes(edge.cells[0])) {
          edgesOnFrontier.add(edge);
        }
      }
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