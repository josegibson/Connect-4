import { useEffect, useState } from "react";

export const UseConnect4 = () => {

  const createEmptyBoard = () => {
    return Array(6).fill(Array(7).fill(0));
  };

  const [board, setBoard] = useState(createEmptyBoard());
  const [status, setStatus] = useState(0); // 0:active, 1:red, 2:yellow, 3:draw
  const [player, setPlayer] = useState(1); // 1:red, 2:yellow
  const [startingPlayer, setStartingPlayer] = useState(1);

  const newGame = () => {
    const newStartingPlayer = startingPlayer === 1 ? 2 : 1;
    setStartingPlayer(newStartingPlayer);
    setBoard(createEmptyBoard());
    setStatus(0);
    setPlayer(newStartingPlayer);
    console.log("New Game Started with player: " + newStartingPlayer);
  };

  const dropPiece = (column) => {
    if (status !== 0) return false;

    const newBoard = board.map((row) => row.slice());
    for (let i = 5; i >= 0; i--) {
      if (newBoard[i][column] === 0) {
        newBoard[i][column] = player;
        // Check for a win or draw before updating the state
        const newStatus = updateStatus(newBoard, player);
        setBoard(newBoard);
        if (newStatus !== 0) {
          setStatus(newStatus);
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
    if (
      checkHorizontal(currentBoard, currentPlayer) ||
      checkVertical(currentBoard, currentPlayer) ||
      checkDiagonal(currentBoard, currentPlayer)
    ) {
      return currentPlayer;
    }

    if (currentBoard.every((row) => row.every((cell) => cell !== 0))) {
      return 3; // Draw
    }

    return 0; // Game continues
  };

  const checkHorizontal = (currentBoard, currentPlayer) => {
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          currentBoard[i][j] === currentPlayer &&
          currentBoard[i][j + 1] === currentPlayer &&
          currentBoard[i][j + 2] === currentPlayer &&
          currentBoard[i][j + 3] === currentPlayer
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const checkVertical = (currentBoard, currentPlayer) => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 7; j++) {
        if (
          currentBoard[i][j] === currentPlayer &&
          currentBoard[i + 1][j] === currentPlayer &&
          currentBoard[i + 2][j] === currentPlayer &&
          currentBoard[i + 3][j] === currentPlayer
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const checkDiagonal = (currentBoard, currentPlayer) => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          currentBoard[i][j] === currentPlayer &&
          currentBoard[i + 1][j + 1] === currentPlayer &&
          currentBoard[i + 2][j + 2] === currentPlayer &&
          currentBoard[i + 3][j + 3] === currentPlayer
        ) {
          return true;
        }
      }
    }

    for (let i = 3; i < 6; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          currentBoard[i][j] === currentPlayer &&
          currentBoard[i - 1][j + 1] === currentPlayer &&
          currentBoard[i - 2][j + 2] === currentPlayer &&
          currentBoard[i - 3][j + 3] === currentPlayer
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const colour = ["red", "yellow"];

  const Board = () => (
    <div>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              className="cell"
              style={{
                backgroundColor: colour[cell - 1],
              }}
              onClick={() => dropPiece(cellIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );

  return { board, status, player, dropPiece, newGame, updateStatus, Board };
};
