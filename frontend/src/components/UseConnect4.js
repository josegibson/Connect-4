import { useState } from "react";

export const UseConnect4 = (config) => {
  const createEmptyBoard = () => {
    const rows = config.rows;
    const cols = config.cols;
    return Array(rows).fill(Array(cols).fill(0));
  };

  const [board, setBoard] = useState(createEmptyBoard());
  const [status, setStatus] = useState(0); // 0:active, 1:red, 2:yellow, 3:draw
  const [player, setPlayer] = useState(1); // 1:red, 2:yellow
  const [startingPlayer, setStartingPlayer] = useState(1);
  const [winningCells, setWinningCells] = useState([]);
  const [userTurn, setUserTurn] = useState(false);

  const newGame = () => {
    const newStartingPlayer = startingPlayer === 1 ? 2 : 1;
    setStartingPlayer(newStartingPlayer);
    setBoard(createEmptyBoard());
    setStatus(0);
    setPlayer(newStartingPlayer);
    setWinningCells([]);
    console.log("New Game Started with player: " + newStartingPlayer);
  };

  const dropPiece = (column) => {
    if (status !== 0) return false;

    const newBoard = board.map((row) => row.slice());
    for (let i = newBoard.length - 1; i >= 0; i--) {
      if (newBoard[i][column] === 0) {
        newBoard[i][column] = player;
        // Check for a win or draw before updating the state
        const { newStatus, winningCells } = updateStatus(newBoard, player);
        setBoard(newBoard);
        if (newStatus !== 0) {
          setStatus(newStatus);
          setWinningCells(winningCells);
        } else {
          // Switch player
          setPlayer(player === 1 ? 2 : 1);
        }
        return true;
      }
    }
    return false;
  };

  const updateStatus = (currentBoard, currentPlayer) => {
    let winningCells = [];
    if (
      (winningCells = checkHorizontal(currentBoard, currentPlayer)) ||
      (winningCells = checkVertical(currentBoard, currentPlayer)) ||
      (winningCells = checkDiagonal(currentBoard, currentPlayer))
    ) {
      return { newStatus: currentPlayer, winningCells };
    }

    if (currentBoard.every((row) => row.every((cell) => cell !== 0))) {
      return { newStatus: 3, winningCells: [] }; // Draw
    }

    return { newStatus: 0, winningCells: [] }; // Game continues
  };

  const checkHorizontal = (currentBoard, currentPlayer) => {
    for (let i = 0; i < currentBoard.length; i++) {
      for (let j = 0; j <= currentBoard[i].length - config.inARow; j++) {
        if (
          currentBoard[i][j] === currentPlayer &&
          currentBoard[i].slice(j, j + config.inARow).every(cell => cell === currentPlayer)
        ) {
          return Array.from({ length: config.inARow }, (_, k) => [i, j + k]);
        }
      }
    }
    return false;
  };

  const checkVertical = (currentBoard, currentPlayer) => {
    for (let i = 0; i <= currentBoard.length - config.inARow; i++) {
      for (let j = 0; j < currentBoard[i].length; j++) {
        if (
          currentBoard[i][j] === currentPlayer &&
          Array.from({ length: config.inARow }, (_, k) => currentBoard[i + k][j]).every(cell => cell === currentPlayer)
        ) {
          return Array.from({ length: config.inARow }, (_, k) => [i + k, j]);
        }
      }
    }
    return false;
  };

  const checkDiagonal = (currentBoard, currentPlayer) => {
    for (let i = 0; i <= currentBoard.length - config.inARow; i++) {
      for (let j = 0; j <= currentBoard[i].length - config.inARow; j++) {
        if (
          currentBoard[i][j] === currentPlayer &&
          Array.from({ length: config.inARow }, (_, k) => currentBoard[i + k][j + k]).every(cell => cell === currentPlayer)
        ) {
          return Array.from({ length: config.inARow }, (_, k) => [i + k, j + k]);
        }
      }
    }

    for (let i = config.inARow - 1; i < currentBoard.length; i++) {
      for (let j = 0; j <= currentBoard[i].length - config.inARow; j++) {
        if (
          currentBoard[i][j] === currentPlayer &&
          Array.from({ length: config.inARow }, (_, k) => currentBoard[i - k][j + k]).every(cell => cell === currentPlayer)
        ) {
          return Array.from({ length: config.inARow }, (_, k) => [i - k, j + k]);
        }
      }
    }
    return false;
  };

  const handleUserMove = (column) => {
    if (userTurn === false) return;
    dropPiece(column);
    setUserTurn(false);
  };

  const Board = () => (
    <div className="container">
      <div>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, cellIndex) => {
              const isWinningCell = winningCells.some(
                ([winRow, winCol]) =>
                  winRow === rowIndex && winCol === cellIndex
              );
              return (
                <div
                  key={cellIndex}
                  className={`cell player-${cell} ${
                    isWinningCell ? "winning" : ""
                  }`}
                  onClick={() => handleUserMove(cellIndex)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  return {
    board,
    status,
    player,
    dropPiece,
    setUserTurn,
    newGame,
    updateStatus,
    Board,
  };
};
