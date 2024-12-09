import { useState } from 'react';
import './styles.css';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = '●';
    } else {
      nextSquares[i] = '○';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? '●' : '○');
  }

  // 创建15*15的棋盘
  const renderBoard = () => {
    const rows = [];
    for (let i = 0; i < 15; i++) {
      const cells = [];
      for (let j = 0; j < 15; j++) {
        const index = i * 15 + j;
        cells.push(
          <Square
            key={index}
            value={squares[index]}
            onSquareClick={() => handleClick(index)}
          />
        );
      }
      rows.push(
        <div key={i} className="board-row">
          {cells}
        </div>
      );
    }
    return rows;
  };

  return (
    <>
      <div className="status">{status}</div>
      <div className="board">{renderBoard()}</div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(225).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const size = 15;
  // 检查所有可能的五子连线
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const directions = [
        [0, 1],   // 水平
        [1, 0],   // 垂直
        [1, 1],   // 对角线
        [1, -1],  // 反对角线
      ];

      for (const [dx, dy] of directions) {
        let count = 1;
        const value = squares[row * size + col];
        if (!value) continue;

        // 检查一个方向上的连续五子
        for (let step = 1; step < 5; step++) {
          const newRow = row + step * dx;
          const newCol = col + step * dy;
          
          if (
            newRow < 0 || newRow >= size ||
            newCol < 0 || newCol >= size ||
            squares[newRow * size + newCol] !== value
          ) {
            break;
          }
          count++;
        }

        if (count === 5) {
          return value;
        }
      }
    }
  }
  return null;
}
