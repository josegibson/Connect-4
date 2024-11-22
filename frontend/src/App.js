import React, { useState } from "react";
import ConfigPanel from "./components/ConfigPanel";

function App() {
  const [players, setPlayers] = useState(["Player 1", "Player 2"]);
  const [turn, setTurn] = useState(0);
  const [status, setStatus] = useState(0);
  const [agents, setAgents] = useState({ "Player 1": "human", "Player 2": "human" });
  const [boardSize, setBoardSize] = useState("6x7");
  const [inARow, setInARow] = useState(4);

  const onAgentChange = (value, player) => {
    setAgents((prevAgents) => ({ ...prevAgents, [player]: value }));
  };

  const newGame = () => {
    setTurn(0);
    setStatus(0);
  };

  const onBoardSizeChange = (size) => {
    setBoardSize(size);
  };

  const onInARowChange = (value) => {
    setInARow(Number(value));
  };

  return (
    <div className="App">
      <ConfigPanel
        players={players}
        turn={turn}
        status={status}
        onAgentChange={onAgentChange}
        agents={agents}
        newGame={newGame}
        onBoardSizeChange={onBoardSizeChange}
        onInARowChange={onInARowChange}
        player={players[turn]}
        boardSize={boardSize}
        inARow={inARow}
      />
    </div>
  );
}

export default App;