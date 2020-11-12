import React, { Component } from 'react';
import { dijkstra, getNodesInShortestPathOrder } from '../Algorithms/Dijkstra';
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

    visualizeDijkstra() {
        document.body.style.pointerEvents = "none";
        document.getElementById("navbar").style.opacity = 0.5;
        const { grid } = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
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
                    <button className="item" onClick={() => { this.visualizeDijkstra() }} style={{ border: "none" }}>Visualize Dijkstra</button>
                    <button className="item" onClick={() => { this.clearBoard() }} style={{ border: "none" }}>Clear Board</button>
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
                <div class="ui left labeled button" style={{ fontSize: "0.8rem", marginTop: "1rem", marginLeft: "0.5rem" }}>
                    <a class="ui basic label" style={{ backgroundColor: "black", color: "white" }} href="https://github.com/RishabhSood">
                        <i class="github icon"></i> RishabhSood
                    </a>
                    <a class="ui icon button" href="https://github.com/RishabhSood/sortingAlgosVisualizer">
                        <i class="fork icon"></i>
                    </a>
                </div>
                <div class="ui left labeled button" style={{ fontSize: "0.8rem" }}>
                    <div class="ui basic label" style={{ backgroundColor: "#0072b1", color: "white" }}>
                        <i class="linkedin icon"></i> RishabhSood
                    </div>
                    <a class="ui icon button" href="https://www.linkedin.com/in/rishabh-sood-6312931a1/">
                        <i class="user plus icon"></i>
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