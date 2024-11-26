import React, { useEffect, useState } from "react";
import { UseConnect4 } from "./components/UseConnect4";
import { useAgent } from "./components/useAgent";
import ConfigPanel from "./components/ConfigPanel";

function App() {
  const { makeAgentMove } = useAgent();
  const [config, setConfig] = useState({
    cols: 7,
    rows: 6,
    inARow: 4,
  });

  const [playerAgents, setPlayerAgents] = useState({
    1: "human",
    2: "lookahead",
  });

  const { board, status, player, dropPiece, setUserTurn, newGame, Board } =
    UseConnect4(config);

  const handleAgentChange = (e, player) => {
    const value = e.target.value;
    setPlayerAgents((prev) => ({ ...prev, [player]: value }));
  };

  const handleBoardSizeChange = (size) => {
    const cols = parseInt(size.split("x")[1], 10);
    const rows = parseInt(size.split("x")[0], 10);
    setConfig((prev) => ({ ...prev, rows, cols }));
  };

  const handleInARowChange = (inARow) => {
    setConfig((prev) => ({ ...prev, inARow: parseInt(inARow, 10) }));
  };

  useEffect(() => {
    newGame();
  }, [config]);

  useEffect(() => {
    if (status === 0 && player === 2) {
      if (playerAgents[2] === "human") {
        setUserTurn(true);
      } else {
        makeAgentMove(playerAgents[2], config, board, player , dropPiece);
      }
    }

    if (status === 0 && player === 1) {
      if (playerAgents[1] === "human") {
        setUserTurn(true);
      } else {
        makeAgentMove(playerAgents[1], config, board, player, dropPiece);
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
