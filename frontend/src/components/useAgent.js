import { useEffect } from 'react';

const useAgent = () => {
  const getAvailableRow = (board, col) => {
    for (let row = board.length - 1; row >= 0; row--) {
      if (board[row][col] === 0) {
        return row;
      }
    }
    return -1;
  };

  const calculateBestMove = () => {
    return Math.floor(Math.random() * 7);
  };

  return { calculateBestMove };
};

export default useAgent;