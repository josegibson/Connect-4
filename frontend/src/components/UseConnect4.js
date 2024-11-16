import { useState } from "react";

export const UseConnect4 = () => {
  const [board, setBoard] = useState(Array(6).fill(Array(7).fill(null)));
  const [status, setStatus] = useState("active");
  const [player, setPlayer] = useState("Red");

  const resetBoard = () => {
    setBoard(Array(6).fill(Array(7).fill(null)));
    setPlayer("Red");
    setStatus("active");
  };

  const dropPiece = (column) => {

    if (status !== "active") return;

    const newBoard = board.map((row) => row.slice());
    let index = null;
    for (let i = 5; i >= 0; i--) {
      if (newBoard[i][column] === null) {
        newBoard[i][column] = player;
        index = i;
        break;
      }
    }
    setBoard(newBoard);

    checkWinner(index, column);

    setPlayer(player === "Red" ? "Yellow" : "Red");
  };

  const checkWinner = (row, column) => {

    const directions = [
      { x: 0, y: 1 }, // vertical
      { x: 1, y: 0 }, // horizontal
      { x: 1, y: 1 }, // diagonal down-right
      { x: 1, y: -1 }, // diagonal up-right
    ];

    for (let { x, y } of directions) {
      let count = 1;

      for (let i = 1; i < 4; i++) {
        const newRow = row + i * y;
        const newCol = column + i * x;
        if (
          newRow < 0 ||
          newRow >= 6 ||
          newCol < 0 ||
          newCol >= 7 ||
          board[newRow][newCol] !== player
        )
          break;
        count++;
      }

      for (let i = 1; i < 4; i++) {
        const newRow = row - i * y;
        const newCol = column - i * x;
        if (
          newRow < 0 ||
          newRow >= 6 ||
          newCol < 0 ||
          newCol >= 7 ||
          board[newRow][newCol] !== player
        )
          break;
        count++;
      }

      if (count >= 4) {
        setStatus(player)
        return status;
      }
    }
  };

  return { board, status, player, dropPiece, resetBoard };
};
