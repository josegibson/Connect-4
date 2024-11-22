import React, { useEffect, useState } from "react";
import { UseConnect4 } from "./UseConnect4";
import { useAgent } from "./useAgent";
import PlayerPanel from "./PlayerPanel";

function App() {
  const { board, status, player, dropPiece, setUserTurn, newGame, Board } =
    UseConnect4();
  const { makeAgentMove } = useAgent();
  const [playerAgents, setPlayerAgents] = useState({
    1: "human",
    2: "lookahead",
  });

  const handleAgentChange = (e, player) => {
    const value = e.target.value;
    setPlayerAgents((prev) => ({ ...prev, [player]: value }));
  };

  useEffect(() => {
    console.log(playerAgents);
    if (status === 0 && player === 2) {
      if (playerAgents[2] === "human") {
        setUserTurn(true);
      } else {
        makeAgentMove(board, player, dropPiece, playerAgents[2]);
      }
    }

    if (status === 0 && player === 1) {
      if (playerAgents[1] === "human") {
        setUserTurn(true);
      } else {
        makeAgentMove(board, player, dropPiece, playerAgents[1]);
      }
    }
  }, [status, player]);

  return (
    <div className="app-container">
      <PlayerPanel
        player={1}
        turn={player}
        status={status}
        agent={playerAgents[1]}
        onAgentChange={(e) => handleAgentChange(e, 1)}
      />
      <div className="board-container">
        <h1>Connect 4</h1>
        <Board />
        <button onClick={() => newGame()}>New Game</button>
      </div>
      <PlayerPanel
        player={2}
        turn={player}
        status={status}
        agent={playerAgents[2]}
        onAgentChange={(e) => handleAgentChange(e, 2)}
      />
    </div>
  );
}

export default App;
