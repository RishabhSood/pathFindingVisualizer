//Dijkstra and A*
export function dijkstraANDastar(grid, startNode, finishNode, isDijkstra, isBFS) {
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
        updateUnvisitedNeighbors(closestNode, grid, isBFS);
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
    let neighbors = getUnvisitedNeighbors(currentNode, grid);
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
            neighbors = getUnvisitedNeighbors(currentNode, grid);
        }
        else {
            while (neighbors.length === 0) {
                currentNode = currentNode.previousNode;
                if (currentNode === null)
                    return visitedNodesInOrder;
                neighbors = getUnvisitedNeighbors(currentNode, grid);
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

function updateUnvisitedNeighbors(node, grid, isBFS) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        if (isBFS || !neighbor.isWeight)
            neighbor.distance = node.distance + 1;
        else
            neighbor.distance = node.distance + 5;
        neighbor.previousNode = node;
    }
}

function getUnvisitedNeighbors(node, grid) {
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

//mazeGenerator
export function recursiveDivisionMaze(rowStart, rowEnd, colStart, colEnd, orientation, divisionWalls) {
    if (rowEnd < rowStart || colEnd < colStart) {
        return;
    }

    if (orientation === 0) {
        let possibleRows = [];
        for (let number = rowStart; number <= rowEnd; number += 2) {
            possibleRows.push(number);
        }
        let possibleCols = [];
        for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
            possibleCols.push(number);
        }
        let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
        let randomColIndex = Math.floor(Math.random() * possibleCols.length);
        let currentRow = possibleRows[randomRowIndex];
        let colRandom = possibleCols[randomColIndex];
        for (let i = colStart - 1; i <= colEnd + 1; i++) {
            if (i === colRandom)
                continue;
            divisionWalls.push([currentRow, i]);
        }
        if (currentRow - 2 - rowStart > colEnd - colStart) {
            recursiveDivisionMaze(rowStart, currentRow - 2, colStart, colEnd, orientation, divisionWalls);
        } else {
            recursiveDivisionMaze(rowStart, currentRow - 2, colStart, colEnd, 1, divisionWalls);
        }
        if (rowEnd - (currentRow + 2) > colEnd - colStart) {
            recursiveDivisionMaze(currentRow + 2, rowEnd, colStart, colEnd, orientation, divisionWalls);
        } else {
            recursiveDivisionMaze(currentRow + 2, rowEnd, colStart, colEnd, 1, divisionWalls);
        }
    } else {
        let possibleCols = [];
        for (let number = colStart; number <= colEnd; number += 2) {
            possibleCols.push(number);
        }
        let possibleRows = [];
        for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
            possibleRows.push(number);
        }
        let randomColIndex = Math.floor(Math.random() * possibleCols.length);
        let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
        let currentCol = possibleCols[randomColIndex];
        let rowRandom = possibleRows[randomRowIndex];
        for (let i = rowStart - 1; i <= rowEnd + 1; i++) {
            if (i === rowRandom)
                continue;
            divisionWalls.push([i, currentCol]);
        }
        if (rowEnd - rowStart > currentCol - 2 - colStart) {
            recursiveDivisionMaze(rowStart, rowEnd, colStart, currentCol - 2, 0, divisionWalls);
        } else {
            recursiveDivisionMaze(rowStart, rowEnd, colStart, currentCol - 2, orientation, divisionWalls);
        }
        if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
            recursiveDivisionMaze(rowStart, rowEnd, currentCol + 2, colEnd, 0, divisionWalls);
        } else {
            recursiveDivisionMaze(rowStart, rowEnd, currentCol + 2, colEnd, orientation, divisionWalls);
        }
    }
}