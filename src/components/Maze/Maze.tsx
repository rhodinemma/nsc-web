import React from 'react';
import './Maze.css';

interface Cell {
  type: 'path' | 'obstacle' | 'start' | 'end';
}

interface MazeProps {
  grid: Cell[][];
}

const Maze: React.FC<MazeProps> = ({ grid }) => {
  return (
    <div className="maze">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              className={`cell ${cell.type}`}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Maze;
