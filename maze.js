import { Cell } from "./cell.js";
import { Edge } from "./edge.js";

export class Maze {
  constructor() {
    this.cells = {};
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

    // Apply Prim's algorithm to generate a minimum spanning tree
    let arbitraryStartingNode = blockCells[0];
    let nodesInTree = [arbitraryStartingNode];
    let nodesNotInTree = blockCells.slice(1);

    let edgesInTree = [];
    let edgesOnFrontier = [];
    let edgesUnexplored = [...edges];

    // Move any node connecting to outside of the tree onto the frontier
    edgesOnFrontier = edgesOnFrontier.concat(arbitraryStartingNode.edges);
    edgesUnexplored = edgesUnexplored.filter(e => !edgesOnFrontier.includes(e));

    if (edgesOnFrontier.length !== 2) {
      console.warn("First addition of nodes to frontier did not add exactly two nodes");
    }

    while (edgesOnFrontier.length) {
      // Select an edge on the frontier with minimum weight
      edgesOnFrontier.sort((e1, e2) => e1.weight - e2.weight);
      let randomEdge = edgesOnFrontier.shift();

      if (!randomEdge) {
        console.warn("Could not find edge to add to tree");
        break;
      }

      if (!randomEdge.inOneOf(nodesInTree, nodesNotInTree)) {
        console.warn("Edge to add to tree does not connect to tree");
        if (nodesInTree.includes(randomEdge.cell1) && nodesInTree.includes(randomEdge.cell2)) {
          console.warn("Both cells in edge are already in tree");
        } else if (nodesNotInTree.includes(randomEdge.cell1) && nodesNotInTree.includes(randomEdge.cell2)) {
          console.warn("Neither cell in edge is in tree");
        }
        break;
      }

      // Add the edge to the tree
      edgesInTree.push(randomEdge);

      // Move the newly added node into the tree
      let nodeToAdd = nodesNotInTree.includes(randomEdge.cell1) ? randomEdge.cell1 : randomEdge.cell2;
      nodesNotInTree.splice(nodesNotInTree.indexOf(nodeToAdd), 1);
      nodesInTree.push(nodeToAdd);

      // Add edges that are newly adjacent to the tree to the frontier
      let newEdges = edgesUnexplored.filter(
        e => e.inOneOf([nodeToAdd], nodesNotInTree) &&
          !edgesOnFrontier.some(e2 => e === e2)
      );
      edgesOnFrontier.push(...newEdges);
      edgesUnexplored = edgesUnexplored.filter(e => !newEdges.includes(e));

      // Potential case where the addition of a node prevents another node from
      // being part of the frontier, but it is still in the frontier list.
      edgesOnFrontier = edgesOnFrontier.filter(e => e.inOneOf(nodesInTree, nodesNotInTree));
    }

    if (edgesUnexplored.length) {
      console.warn(`Not all edges were explored - ${edgesUnexplored.length} remain`);
    }

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
    // Add gates at edges of block
  }

  getCell(x, y) {
    return this.cells[`${x},${y}`];
  }

  setCell(x, y, cell) {
    this.cells[`${x},${y}`] = cell;
  }
}