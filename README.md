# Pathfinding Visualizer
This mini-project is inspired by [Clément Mihailescu's](https://github.com/clementmihailescu) pathfinding visualizer [tutorial](https://youtu.be/msttfIHHkak). Pathfinding algorithms are usually an attempt to solve the shortest path problem in graph theory. They try to find the best path given a starting point and ending point based on some predefined criteria. A few of these (weighted and non-weighted algorithms have been implemented in this App, which can be found live at [https://rishabhsood.github.io/pathFindingVisualizer/](https://rishabhsood.github.io/pathFindingVisualizer/). The algorithms implemented namely are:

## Dijkstra's Algorithm (weighted)
> Dijkstra's algorithm (or Dijkstra's Shortest Path First algorithm, SPF algorithm)[4] is an algorithm for finding the shortest paths between nodes in a graph. In the case of our visualizer, we present a graph with each node having a weight of 1, The user can optionally add a weight to a node, in order to change it's weight to 5. For learning this algorithm, I found this youTube video really helpful [https://youtu.be/GazC3A4OQTE](https://youtu.be/GazC3A4OQTE).

## A* Algorithm (weighted)
> This is an extension of Dijkstra'a algorithm, which follows the same updation algorithm, which is further modified by taking in account a heuristic( which is depective of the distance of a given node to the target node ). For more detailing and deep understanding you might like to checkout this youTube video: [https://youtu.be/ySN5Wnu88nE](https://youtu.be/ySN5Wnu88nE).

## Depth First Search (unweighted)
> Depth-first search (DFS) is an algorithm for traversing or searching tree or graph data structures. The algorithm starts at the root node (selecting some arbitrary node as the root node in the case of a graph) and explores as far as possible along each branch before backtracking. It is really not suitable for pathfinding and doesn't guarantee the shortest path.

## Breadth First Search (unweighted)
> Breadth First Search (BFS) is again an algorithm for traversing or searching tree or graph data structures.It starts at the root node and examines child nodes level wise. It's updation algorithm is very similar to that of Dijkstra's, however it doesn't take into account weights of nodes and treats each node equally.

## The recursive maze division algorithm
> A basic recursive algorithm is used to generate the mazes you see on your screen. Detailing on the same can be found [here](http://weblog.jamisbuck.org/2011/1/12/maze-generation-recursive-division-algorithm). Love mazes ? Don't forget to check out Jamis Buck's [Mazes for programmers](http://www.mazesforprogrammers.com/).



