// Responsible for MST and maze generation
export class Maze {
  constructor() {
    this.tree = [];
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

    // Pick an edge at random from the frontier
    let nextEdge = edgesOnFrontier[Math.floor(Math.random() * edgesOnFrontier.length)];

    // Make sure the algorithm is working correctly
    if (!nextEdge) {
      console.warn("Could not find edge to add to tree");
      return;
    }
    if (!nextEdge.connects(nodesInTree, nodesNotInTree)) {
      console.warn("Edge to add to tree does not connect to tree");
      if (nodesInTree.includes(nextEdge.cell1) && nodesInTree.includes(nextEdge.cell2)) {
        console.warn("Both cells in edge are already in tree");
      } else if (nodesNotInTree.includes(nextEdge.cell1) && nodesNotInTree.includes(nextEdge.cell2)) {
        console.warn("Neither cell in edge is in tree");
      }
      return;
    }

    // Move the newly added node into the tree
    let nodeToAdd = nodesNotInTree.includes(nextEdge.cell1) ? nextEdge.cell1 : nextEdge.cell2;
    nodesNotInTree.splice(nodesNotInTree.indexOf(nodeToAdd), 1);
    nodesInTree.push(nodeToAdd);
    this.tree.push(nodeToAdd);

    return nextEdge;
  }

  // Apply Prim's algorithm to generate a minimum spanning tree
  primsAlgorithm(allCells, chunkCells) {

    let nodesNotInTree = [...chunkCells];
    let nodesInTree = Object.values(allCells).filter(
      cell => this.tree.includes(cell)
    );
    if (!nodesInTree.length) {
      nodesInTree = [chunkCells[0]];
      nodesNotInTree.splice(0, 1);
    }

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

  amazeChunk(allCells, chunkCells) {
    let edgesInTree = this.primsAlgorithm(allCells, chunkCells);
    for (let edge of edgesInTree) {
      edge.spawnGate();
    }
  }
}