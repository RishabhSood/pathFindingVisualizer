import React, { Component } from 'react';
import { dijkstraANDastar, getNodesInShortestPathOrder } from '../Algorithms/Dijkstra';
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
            finishIsSelected: false
        };
    }

    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({ grid });
    }

    clearBoard() {
        window.location.reload();
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
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node-shortest-path';
            }, 10 * i)
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
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node-visited';
            }, 10 * i)
        }
    }

    visualizeDijkstraOrAstar(isDijkstra) {
        document.body.style.pointerEvents = "none";
        document.getElementById("navbar").style.opacity = 0.5;
        const { grid } = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dijkstraANDastar(grid, startNode, finishNode, isDijkstra);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    render() {
        const { grid, mouseIsPressed } = this.state;

        return (
            <>
                <div className="ui stackable menu" id="navbar">
                    <div className="item">
                        <i class="road icon"></i>Pathfinding Visualizer
                    </div>
                    <button className="item" onClick={() => { this.visualizeDijkstraOrAstar(true) }} style={{ border: "none" }}>Visualize Dijkstra</button>
                    <button className="item" onClick={() => { this.visualizeDijkstraOrAstar(false) }} style={{ border: "none" }}>Visualize A*</button>
                    <button className="item" onClick={() => { this.clearBoard() }} style={{ border: "none" }}>Clear Board</button>
                    <button className="item" onClick={() => { this.clearPath() }} style={{ border: "none" }}>Clear Path</button>
                </div>
                <table>
                    <tbody>
                        {grid.map((row, rowIdx) => {
                            return <tr key={rowIdx}>
                                {row.map((node, nodeIdx) => {
                                    const { row, col, isStart, isFinish, isWall } = node;
                                    return (
                                        <Node
                                            key={nodeIdx}
                                            row={row}
                                            col={col}
                                            isStart={isStart}
                                            isFinish={isFinish}
                                            isWall={isWall}
                                            mouseIsPressed={mouseIsPressed}
                                            onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                            onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                                            onMouseUp={() => this.handleMouseUp()}
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
                    <a className="ui icon button" href="https://github.com/RishabhSood/sortingAlgosVisualizer">
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
        previousNode: null,
    };
};

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
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
        isFinish: true,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};