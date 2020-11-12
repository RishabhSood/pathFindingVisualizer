import React, { Component } from 'react';
import "./Node.css"

export default class Node extends Component {
    render() {
        const {
            row,
            col,
            isStart,
            isFinish,
            isWall,
            onMouseDown,
            onMouseEnter,
            onMouseUp,
            nodeSize
        } = this.props;
        const extraClassName = isFinish
            ? 'node-finish'
            : isStart
                ? 'node-start'
                : isWall
                    ? 'node-wall'
                    : '';

        return (
            <td id={`node-${row}-${col}`}
                className={extraClassName}
                onMouseDown={() => onMouseDown(row, col)}
                onMouseEnter={() => onMouseEnter(row, col)}
                onMouseUp={() => onMouseUp(row, col)}
                style={{ width: `${nodeSize}px`, height: `${nodeSize}px` }}>
            </td>
        );
    }
}