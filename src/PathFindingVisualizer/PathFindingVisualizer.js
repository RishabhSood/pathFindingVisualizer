import React, { Component } from 'react';
import { dijkstraANDastar, depthFirstSearch, getNodesInShortestPathOrder, recursiveDivisionMaze } from '../Algorithms/algorithms';
import Node from './Node/Node';
import "./PathFindingVisualizer.css";

let START_NODE_ROW = 10;
let START_NODE_COL = 15;
let FINISH_NODE_ROW = 10;
let FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
            startIsSelected: false,
            finishIsSelected: false,
            nodeSize: (window.outerWidth - 20) / 50
        };
    }

    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({ grid });
    }

    clearBoard() {
        window.location.reload();
    }

    clearWeights() {
        const newGrid = this.state.grid;
        for (let row of newGrid) {
            for (let node of row) {
                node.isStart = node.row === START_NODE_ROW && node.col === START_NODE_COL;
                node.isFinish = node.row === FINISH_NODE_ROW && node.col === FINISH_NODE_COL;
                node.distance = Infinity;
                node.heuristic = 0;
                node.isVisited = false;
                node.previousNode = null;
                node.isWall = false;
                node.isWeight = false;
                if (node.isStart) {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node-start';
                    continue;
                }
                if (node.isFinish) {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node-finish';
                    continue;
                }
                document.getElementById(`node-${node.row}-${node.col}`).className = '';
            }
        }
        this.setState({ grid: newGrid });
    }

    clearPath() {
        const newGrid = this.state.grid;
        for (let row of newGrid) {
            for (let node of row) {
                node.isStart = node.row === START_NODE_ROW && node.col === START_NODE_COL;
                node.isFinish = node.row === FINISH_NODE_ROW && node.col === FINISH_NODE_COL;
                node.distance = Infinity;
                node.heuristic = 0;
                node.isVisited = false;
                node.previousNode = null;
                if (node.isWall)
                    continue;
                if (node.isWeight) {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node-weight';
                    continue;
                }
                node.isWall = false;
                if (node.isStart) {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node-start';
                    continue;
                }
                if (node.isFinish) {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node-finish';
                    continue;
                }
                document.getElementById(`node-${node.row}-${node.col}`).className = '';
            }
        }
        this.setState({ grid: newGrid });
    }

    handleMouseDown(row, col) {
        if (row === START_NODE_ROW && col === START_NODE_COL) {
            const newGrid = getNewGridWithStartToggled(this.state.grid, row, col);
            this.setState({ grid: newGrid, mouseIsPressed: true, startIsSelected: true });
            return;
        }
        if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) {
            const newGrid = getNewGridWithFinishToggled(this.state.grid, row, col);
            this.setState({ grid: newGrid, mouseIsPressed: true, finishIsSelected: true });
            return;
        }
        if (document.getElementById("weightToggle").checked === true) {
            const newGrid = getNewGridWithWeightToggled(this.state.grid, row, col);
            this.setState({ grid: newGrid, mouseIsPressed: true });
            return;
        }
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid, mouseIsPressed: true });
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        if (this.state.startIsSelected) {
            const newGrid = getNewGridWithStartToggled(this.state.grid, row, col);
            this.setState({ grid: newGrid });
            return;
        }
        if (this.state.finishIsSelected) {
            const newGrid = getNewGridWithFinishToggled(this.state.grid, row, col);
            this.setState({ grid: newGrid });
            return;
        }
        if (document.getElementById("weightToggle").checked === true) {
            const newGrid = getNewGridWithWeightToggled(this.state.grid, row, col);
            this.setState({ grid: newGrid });
            return;
        }
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid });
    }

    handleMouseUp() {
        this.setState({ mouseIsPressed: false, startIsSelected: false, finishIsSelected: false });
    }

    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i <= nodesInShortestPathOrder.length; i++) {
            if (i === nodesInShortestPathOrder.length) {
                setTimeout(() => {
                    document.body.style.pointerEvents = "all";
                    document.getElementById("navbar").style.opacity = 1;
                    document.getElementById(`node-${START_NODE_ROW}-${START_NODE_COL}`).className = 'node-start';
                    document.getElementById(`node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`).className = 'node-finish';
                }, 10 * (i + 1));
                return;
            }
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                if (node.isWeight)
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node-weight-shortest-path';
                else
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node-shortest-path';
            }, 10 * (i + 1))
        }
    }

    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                if (node.isWeight)
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node-weight-visited';
                else
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node-visited';
            }, 10 * i)
        }
    }

    visualizeDijkstraOrAstar(isDijkstra, isBFS) {
        this.clearPath();
        document.body.style.pointerEvents = "none";
        document.getElementById("navbar").style.opacity = 0.5;
        const { grid } = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dijkstraANDastar(grid, startNode, finishNode, isDijkstra, isBFS);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    animateDFS(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node-visited';
            }, 10 * i)
        }
    }

    visualizeDFS() {
        this.clearPath();
        document.body.style.pointerEvents = "none";
        document.getElementById("navbar").style.opacity = 0.5;
        const { grid } = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = depthFirstSearch(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateDFS(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    generateMaze() {
        this.clearWeights();
        document.body.style.pointerEvents = "none";
        const items = document.getElementsByClassName("item")
        for (const item of items)
            item.style.opacity = 0.5;
        document.getElementById("status").style.display = "flex";
        document.getElementById("status").style.opacity = 1;
        const divisionWalls = [];
        for (let j = 0; j < 50; j++)
            divisionWalls.push([0, j]);
        for (let k = 1; k < 20; k++) {
            divisionWalls.push([k, 49]);
            divisionWalls.push([k, 0]);
        }
        for (let l = 48; l >= 1; l--)
            divisionWalls.push([19, l]);
        recursiveDivisionMaze(2, 17, 2, 47, 0, divisionWalls);

        for (let i = 0; i <= divisionWalls.length; i++) {
            let newGrid = this.state.grid;
            if (i === divisionWalls.length) {
                setTimeout(() => {
                    document.body.style.pointerEvents = "all";
                    const items = document.getElementsByClassName("item")
                    for (const item of items)
                        item.style.opacity = 1;
                    document.getElementById("status").style.display = "none";
                    this.setState({ grid: newGrid });
                }, 10.3 * (i - 1));
                return;
            }
            setTimeout(() => {
                const row = divisionWalls[i][0];
                const col = divisionWalls[i][1];
                const newGrid = this.state.grid;
                if (!newGrid[row][col].isWall && !newGrid[row][col].isStart && !newGrid[row][col].isFinish) {
                    document.getElementById(`node-${row}-${col}`).className = 'node-wall';
                    newGrid[row][col].isWall = true;
                }
            }, 10 * i);
        }
    }

    render() {
        const { grid, mouseIsPressed } = this.state;

        return (
            <>
                <div className="ui stackable menu" id="navbar">
                    <div className="item" style={{ color: "white", backgroundColor: "#1A1A1D" }}>
                        <i class="road icon"></i>Pathfinding Visualizer
                    </div>
                    <button className="item" onClick={() => { this.visualizeDijkstraOrAstar(true, false) }} style={{ border: "none" }}>Visualize Dijkstra</button>
                    <button className="item" onClick={() => { this.visualizeDijkstraOrAstar(false, false) }} style={{ border: "none" }}>Visualize A*</button>
                    <button className="item" onClick={() => { this.visualizeDijkstraOrAstar(true, true) }} style={{ border: "none" }}>Visualize BFS</button>
                    <button className="item" onClick={() => { this.visualizeDFS() }} style={{ border: "none" }}>Visualize DFS</button>
                    <button className="item" onClick={() => { this.clearWeights() }} style={{ border: "none" }}>Clear Weights</button>
                    <button className="item" onClick={() => { this.clearPath() }} style={{ border: "none" }}>Clear Path</button>
                    <button className="item" onClick={() => { this.clearBoard() }} style={{ border: "none" }}>Refresh</button>
                    <div className="item">
                        <div className="ui toggle checkbox">
                            <input type="checkbox" name="public" id="weightToggle" />
                            <label>Drag to add weights</label>
                        </div>
                    </div>
                    <button className="item" onClick={() => { this.generateMaze() }} style={{ border: "none" }}>Generate Maze</button>
                    <button id="status" style={{ border: "none", display: "none", alignItems: "center", backgroundColor: "black", color: "white", position: "relative" }}><div class="loader"></div>Loading Maze .. Please Wait!</button>
                </div>
                <table>
                    <tbody>
                        {grid.map((row, rowIdx) => {
                            return <tr key={rowIdx}>
                                {row.map((node, nodeIdx) => {
                                    const { row, col, isStart, isFinish, isWall, isWeight } = node;
                                    return (
                                        <Node
                                            key={nodeIdx}
                                            row={row}
                                            col={col}
                                            isStart={isStart}
                                            isFinish={isFinish}
                                            isWall={isWall}
                                            isWeight={isWeight}
                                            mouseIsPressed={mouseIsPressed}
                                            onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                            onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                                            onMouseUp={() => this.handleMouseUp()}
                                            nodeSize={this.state.nodeSize}
                                        />
                                    )
                                })}
                            </tr>
                        })}
                    </tbody>
                </table>
                <div className="ui left labeled button" style={{ fontSize: "0.8rem", marginTop: "1rem", marginLeft: "0.5rem" }}>
                    <a className="ui basic label" style={{ backgroundColor: "black", color: "white" }} href="https://github.com/RishabhSood">
                        <i className="github icon"></i> RishabhSood
                    </a>
                    <a className="ui icon button" href="https://github.com/RishabhSood/pathFindingVisualizer">
                        <i className="fork icon"></i>
                    </a>
                </div>
                <div className="ui left labeled button" style={{ fontSize: "0.8rem" }}>
                    <div className="ui basic label" style={{ backgroundColor: "#0072b1", color: "white" }}>
                        <i className="linkedin icon"></i> RishabhSood
                    </div>
                    <a className="ui icon button" href="https://www.linkedin.com/in/rishabh-sood-6312931a1/">
                        <i className="user plus icon"></i>
                    </a>
                </div>
            </>
        );
    }
}
const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
        const currentRow = [];
        for (let col = 0; col < 50; col++) {
            currentRow.push(createNode(col, row));
        }
        grid.push(currentRow);
    }
    return grid;
};

const createNode = (col, row) => {
    return {
        col,
        row,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        heuristic: 0,
        isVisited: false,
        isWall: false,
        isWeight: false,
        previousNode: null,
    };
};

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    if (node.isStart || node.isFinish || node.isWeight)
        return newGrid;
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

const getNewGridWithWeightToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    if (node.isStart || node.isFinish || node.isWall)
        return newGrid;
    const newNode = {
        ...node,
        isWeight: !node.isWeight,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

const getNewGridWithStartToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    let previousStart = newGrid[START_NODE_ROW][START_NODE_COL];
    const change = {
        ...previousStart,
        isStart: false,
    }
    newGrid[START_NODE_ROW][START_NODE_COL] = change;
    START_NODE_ROW = row;
    START_NODE_COL = col;
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: false,
        isWeight: false,
        isStart: true,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};

const getNewGridWithFinishToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    let previousFinish = newGrid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const change = {
        ...previousFinish,
        isFinish: false,
    }
    newGrid[FINISH_NODE_ROW][FINISH_NODE_COL] = change;
    FINISH_NODE_ROW = row;
    FINISH_NODE_COL = col;
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: false,
        isWeight: false,
        isFinish: true,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};