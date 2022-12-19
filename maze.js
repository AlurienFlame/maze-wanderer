import { Cell } from "./cell.js";
import { Edge } from "./edge.js";

export class Maze {
  constructor() {
    this.cells = {};
  }

  // Moves a node from inTree to notInTree based on Prim's algorithm,
  // and returns the edge that connects the node to the tree.
  stepPrims(nodesInTree, nodesNotInTree) {
    // Find frontier
    let edgesOnFrontier = [];
    for (let node of nodesNotInTree) {
      for (let edge of node.edges) {
        if (edge.connects(nodesInTree, nodesNotInTree)) {
          edgesOnFrontier.push(edge);
        }
      }
    }

    // Pick an edge based on weight
    let smallestEdge = edgesOnFrontier[0];
    for (let edge of edgesOnFrontier) {
      if (edge.weight < smallestEdge.weight) {
        smallestEdge = edge;
      }
    }

    // Make sure the algorithm is working correctly
    if (!smallestEdge) {
      console.warn("Could not find edge to add to tree");
      return;
    }
    if (!smallestEdge.connects(nodesInTree, nodesNotInTree)) {
      console.warn("Edge to add to tree does not connect to tree");
      if (nodesInTree.includes(smallestEdge.cell1) && nodesInTree.includes(smallestEdge.cell2)) {
        console.warn("Both cells in edge are already in tree");
      } else if (nodesNotInTree.includes(smallestEdge.cell1) && nodesNotInTree.includes(smallestEdge.cell2)) {
        console.warn("Neither cell in edge is in tree");
      }
      return;
    }

    // Move the newly added node into the tree
    let nodeToAdd = nodesNotInTree.includes(smallestEdge.cell1) ? smallestEdge.cell1 : smallestEdge.cell2;
    nodesNotInTree.splice(nodesNotInTree.indexOf(nodeToAdd), 1);
    nodesInTree.push(nodeToAdd);
    nodeToAdd.inMST = true;

    return smallestEdge;
  }

  // Generate a minimum spanning tree of cells
  primsAlgorithm(blockCells) {
    // Generate an edge between each cell in the block and its neighbor
    for (let cell of Object.values(blockCells)) {
      if (cell.getNeighbor("right")) new Edge(cell, cell.getNeighbor("right"));
      if (cell.getNeighbor("down")) new Edge(cell, cell.getNeighbor("down"));
    }

    // Generate edges to already generated sections of the maze
    for (let cell of Object.values(blockCells)) {
      for (let neighbor of cell.getNeighbors()) {
        if (neighbor.inMST) {
          new Edge(cell, neighbor);
        }
      }
    }

    // Apply Prim's algorithm to generate a minimum spanning tree
    let nodesInTree = Object.values(this.cells).filter(
      cell => cell.inMST
    );
    if (!nodesInTree.length) {
      nodesInTree = [blockCells[0]];
    }
    let nodesNotInTree = blockCells.slice(1);

    let edgesInTree = [];
    let i=0;
    while (nodesNotInTree.length) {
      let nextEdge = this.stepPrims(nodesInTree, nodesNotInTree);
      if (!nextEdge) {
        console.warn("Prim's tripped - failed to find edge to add to tree");
        break;
      }
      edgesInTree.push(nextEdge);
      i++;
    }
    console.log(`Generated MST with ${edgesInTree.length} edges in ${i} steps.`);
    return edgesInTree;
  }

  generateBlock(x, y, width, height) {
    // FIXME: Fails to make a gate to (x,y) unless (x,y)==(0,0)
    // Generate cells
    let blockCells = [];
    for (let i = x; i < x + width; i++) {
      for (let j = y; j < y + height; j++) {
        let cell = new Cell(i, j, this);
        this.setCell(i, j, cell);
        blockCells.push(cell);
      }
    }

    for (let edge of this.primsAlgorithm(blockCells)) {
      edge.spawnGate();
    }

    console.log(`Generated block at ${x},${y} with ${Object.values(blockCells).length} cells`);
    this.validate();
  }

  getCell(x, y) {
    return this.cells[`${x},${y}`];
  }

  setCell(x, y, cell) {
    this.cells[`${x},${y}`] = cell;
  }

  validate() {
    // No equivalent edges
    // Since every edge's cells have pointers to it, we can check the cells for duplicates
    // instead of n^2 checking every edge against every other edge
    for (let cell of Object.values(this.cells)) {
      if (!cell.validate()) {
        console.warn(`Cell ${cell.x},${cell.y} failed to validate itself.`);
        return false;
      }
    }
    return true;
  }

  toString() {
    return `Maze(${Object.values(this.cells).length})`;
  }
}