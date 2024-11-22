import React, { useEffect, useState } from "react";
import { UseConnect4 } from "./UseConnect4";
import { useAgent } from "./useAgent";
import ConfigPanel from "./ConfigPanel";

function App() {
  const { board, status, player, dropPiece, setUserTurn, newGame, Board } =
    UseConnect4();
  const { makeAgentMove } = useAgent();
  const [playerAgents, setPlayerAgents] = useState({
    1: "human",
    2: "lookahead",
  });
  const [config, setConfig] = useState({
    size: "6x7",
    inARow: 4,
  });

  const handleAgentChange = (e, player) => {
    const value = e.target.value;
    setPlayerAgents((prev) => ({ ...prev, [player]: value }));
  };

  const handleBoardSizeChange = (size) => {
    // Implement the logic to change the board size
    setConfig((prev) => ({ ...prev, ["size"]: size }));
  };

  const handleInARowChange = (inARow) => {
    // Implement the logic to change the in a row value
    setConfig((prev) => ({ ...prev, ["inARow"]: inARow }));
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
    <div>
      <h1 style={{ margin: 0 }}>Connect 4</h1>
      <div className="app-container">
      <Board />
        <ConfigPanel
          players={[1, 2]}
          turn={player}
          status={status}
          agents={playerAgents}
          config={config}
          onAgentChange={handleAgentChange}
          newGame={newGame}
          onBoardSizeChange={handleBoardSizeChange}
          onInARowChange={handleInARowChange}
        />
      </div>
    </div>
  );
}

export default App;
