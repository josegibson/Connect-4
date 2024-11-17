import React, { useEffect } from "react";
import { UseConnect4 } from "./UseConnect4";
import { useAgent } from "./useAgent";

function App() {
  const { board, status, player, dropPiece, newGame, updateStatus, Board } = UseConnect4();
  const { makeAgentMove } = useAgent();

  const getMessages = () => {
    return status + " " + player;
  };

  useEffect(() => {
    if (status === 0 && player === 2) {
      makeAgentMove(board, player, dropPiece);
    }
  }, [status, player]);

  return (
    <div className="App container">
      <h1>Connect 4</h1>
      <div
        className="row"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div className="info-container">
          <h2>{getMessages()}</h2>
          <button onClick={() => newGame()}>New Game</button>
        </div>
        <Board />
      </div>
    </div>
  );
}

export default App;
