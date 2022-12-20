# Maze Wanderer

A [procedurally generated maze](https://maze-wanderer.netlify.app/) that can be explored using the A* pathfinding algorithm.

## Features

- Use the mouse wheel to zoom
- Use the arrow keys to pan
- Click a location to pathfind to it with the A* algorithm
- Clicking a location outside of the maze will generate new chunks of maze using a minimum spanning tree made with Prim's algorithm
- The maze is a grid of html elements that are dynamically resized and recolored based on your panning and zooming

## A* Pathfinding

The A* pathfinding algorithm is a powerful tool for efficiently finding the shortest path between two points in a graph. It works by continuously expanding a search area from the start point and keeping track of the best path found so far, using a combination of the actual distance from the start and an estimated distance to the end (also known as a heuristic).

## Prim's Algorithm

Prim's algorithm is used to generate a minimum spanning tree for a weighted, undirected graph. It works by starting at a random vertex and adding the edges with the smallest weight that connect it to a tree, until all vertices are in the tree. This results in a tree that includes all the vertices and is connected by the minimum total weight of edges. By using cells in the maze as vertices and removing walls that overlap with edges in the MST, we can generate a maze that is guaranteed to be connected and not have any loops.

## Dynamic HTML

Implementing zooming and panning in the maze was surprisingly one of the most challenging parts of the project. To handle zooming, I needed to update the size of the individual maze tiles based on the user's mouse wheel input, while also adding or removing rows and columns of tiles as needed to fill the viewport. This required careful calculations to ensure that the tiles were resized and added/removed consistently, and that the maze remained centered on the screen. Because the maze is using CSS grid to position the elements, having just a single square out of place ruins the whole display.

## Sources
[Introduction to the A* Algorithm from Red Blob Games](https://www.redblobgames.com/pathfinding/a-star/introduction.html)  
[Minimum Spanning Tree Vs Shortest Path Tree from Baeldung](https://www.baeldung.com/cs/minimum-spanning-vs-shortest-path-trees)