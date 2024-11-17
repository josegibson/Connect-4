import React, { useEffect } from "react";
import { UseConnect4 } from "./UseConnect4";
import { useAgent } from "./useAgent";
import PlayerPanel from "./PlayerPanel";

function App() {
  const { board, status, player, dropPiece, newGame, Board } = UseConnect4();
  const { makeAgentMove } = useAgent();
  // const [playerAgents, setPlayerAgents] = useState({player1: "human", player2: "human"});

  // const handleAgentChange = (e, player) => {
  //   const value = e.target.value;
  //   setPlayerAgents((prev) => ({...prev, [player]: value}));
  // }

  useEffect(() => {
    if (status === 0 && player === 2) {
      makeAgentMove(board, player, dropPiece);
    }
  }, [status, player]);

  return (
    <div className="app-container">
      <PlayerPanel
        player={1}
        turn={player}
        status={status}
      />
      <div className="board-container">
        <h1 className="heading">Connect 4</h1>
        <Board />
        <button onClick={() => newGame()}>New Game</button>
      </div>
      <PlayerPanel
        player={2}
        turn={player}
        status={status}
      />
    </div>
  );
}

export default App;
