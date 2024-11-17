export function useAgent() {
  const getAvailableRow = (board, col) => {
    for (let row = board.length - 1; row >= 0; row--) {
      if (board[row][col] === 0) {
        return row;
      }
    }
    return -1;
  };

  const calculateBestMove = (board, player) => {
    return Math.floor(Math.random() * 7);
  };

  const agentMoveTest = (board, player, dropPiece) => {
    const bestMove = calculateBestMove(board, player);
    setTimeout(() => {
      dropPiece(bestMove);
    }, 500);
  };

  const makeAgentMove = async (board, player, dropPiece) => {
    const response = await fetch("http://localhost:5000/api/move", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ board, player }),
    });
    
    const data = await response.json();
    console.log(data);
    dropPiece(data.move);
  }

  return { makeAgentMove, agentMoveTest };
}