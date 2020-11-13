//Dijkstra and A*
export function dijkstraANDastar(grid, startNode, finishNode, isDijkstra) {
    for (const row of grid) {
        for (const node of row) {
            node.heuristic = Math.floor(Math.sqrt(Math.pow(Math.abs(node.row - finishNode.row), 2) + Math.pow(Math.abs(node.col - finishNode.col), 2)))
        }
    }
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid);
    while (!!unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes, isDijkstra);
        const closestNode = unvisitedNodes.shift();
        if (closestNode.isWall) continue;
        if (closestNode.distance === Infinity) return visitedNodesInOrder;
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);
        if (closestNode === finishNode) return visitedNodesInOrder;
        updateUnvisitedNeighbors(closestNode, grid);
    }
}

//Depth First Search
export function depthFirstSearch(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    startNode.isVisited = true;
    const unvisitedNodes = getAllNodes(grid);
    sortNodesByDistance(unvisitedNodes, true);
    visitedNodesInOrder.push(unvisitedNodes.shift());
    let nodeCount = unvisitedNodes.length;
    let currentNode = visitedNodesInOrder[visitedNodesInOrder.length - 1];
    let neighbors = getNeighbors(currentNode, grid);
    while (nodeCount--) {
        neighbors = neighbors.filter(neighbor => !neighbor.isWall);
        if (neighbors.length) {
            const latestNode = neighbors.shift();
            latestNode.isVisited = true;
            latestNode.previousNode = currentNode;
            visitedNodesInOrder.push(latestNode);
            if (latestNode === finishNode) {
                return visitedNodesInOrder;
            }
            currentNode = visitedNodesInOrder[visitedNodesInOrder.length - 1];
            neighbors = getNeighbors(currentNode, grid);
        }
        else {
            while (neighbors.length === 0) {
                currentNode = currentNode.previousNode;
                if (currentNode === null)
                    return visitedNodesInOrder;
                neighbors = getNeighbors(currentNode, grid);
            }
        }
    }
    return visitedNodesInOrder;
}

//utility functions
function sortNodesByDistance(unvisitedNodes, isDijkstra) {
    if (isDijkstra)
        unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
    else
        unvisitedNodes.sort((nodeA, nodeB) => (nodeA.distance + nodeA.heuristic) - (nodeB.distance + nodeB.heuristic));
}

function updateUnvisitedNeighbors(node, grid) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        neighbor.distance = node.distance + 1;
        neighbor.previousNode = node;
    }
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}

//backtrack and return path
export function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}