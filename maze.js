import { Cell } from "./cell.js";
import { Edge } from "./edge.js";

export class Maze {
  constructor() {
    this.cells = {};
  }

  // Moves a node from inTree to notInTree based on Prim's algorithm,
  // and returns the edge that connects the node to the tree.
  stepPrims(nodesInTree, nodesNotInTree, probableFrontierEdges) {
    // Find frontier
    let edgesOnFrontier = [];
    for (let node of nodesNotInTree) {
      for (let edge of node.edges) {
        if (edge.connects(nodesInTree, nodesNotInTree)) {
          edgesOnFrontier.push(edge);
        }
      }
    }
    // console.log(`Edges on frontier: ${edgesOnFrontier.length} =?= Probable frontier edges: ${probableFrontierEdges.length}`);

    // Pick an edge based on weight
    let smallestEdge = edgesOnFrontier[0];
    for (let edge of edgesOnFrontier) {
      if (edge.weight < smallestEdge.weight) {
        smallestEdge = edge;
      }
    }

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
    let edges = [];
    for (let cell of Object.values(blockCells)) {
      if (cell.getNeighbor("right")) edges.push(new Edge(cell, cell.getNeighbor("right")));
      if (cell.getNeighbor("down")) edges.push(new Edge(cell, cell.getNeighbor("down")));
    }

    // Validate no duplicate edges
    for (let i = 0; i < edges.length; i++) {
      for (let j = i + 1; j < edges.length; j++) {
        if (edges[i].isEquivalent(edges[j])) {
          console.warn("Duplicate edge found");
        }
      }
    }

    // Generate edges to already generated sections of the maze
    let probableFrontierEdges = [];
    for (let cell of Object.values(blockCells)) {
      for (let neighbor of cell.getNeighbors()) {
        if (neighbor.inMST) {
          let edge = new Edge(cell, neighbor);
          edges.push(edge);
          probableFrontierEdges.push(edge);
        }
      }
    }

    // Validate no duplicate edges
    for (let i = 0; i < edges.length; i++) {
      for (let j = i + 1; j < edges.length; j++) {
        if (edges[i].isEquivalent(edges[j])) {
          console.warn("Duplicate edge found");
        }
      }
    }

    // TODO: nodesInTree should be more inclusive
    // Apply Prim's algorithm to generate a minimum spanning tree
    let nodesInTree = Object.values(this.cells).filter(
      cell => cell.inMST
    );
    if (!nodesInTree.length) {
      nodesInTree = [blockCells[0]];
    }
    let nodesNotInTree = blockCells.slice(1);

    let edgesInTree = [];
    console.time("Prims algorithm");
    while (nodesNotInTree.length) {
      edgesInTree.push(this.stepPrims(nodesInTree, nodesNotInTree, probableFrontierEdges));
    }
    console.timeEnd("Prims algorithm");

    return edgesInTree;
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

    for (let edge of this.primsAlgorithm(blockCells)) {
      edge.spawnGate();
    }

    console.log(`Generated block at ${x},${y} with ${Object.values(blockCells).length} cells`);
  }

  getCell(x, y) {
    return this.cells[`${x},${y}`];
  }

  setCell(x, y, cell) {
    this.cells[`${x},${y}`] = cell;
  }
}