
import React from "react";

function PlayerPanel({ player, turn, status}) {
  return (
    <div className="player-panel">
      <div className={`display-tile player-${player} ${turn === player ? "active" : ""}`}></div>
      <div className="agents-selector">
        <label htmlFor={`difficulty-${player}`}>Played by </label>
        <select
          id={`played-by-${player}`}
          onChange={(e) => {
            
          }}
        >
          <option value="random">Random</option>
          <option value="lookahead">Look Ahead</option>
          <option value="human">Human</option>
        </select>
        <h2>
          {status === player
            ? "You won!!"
            : status === (player === 1 ? 2 : 1)
            ? "You lost!"
            : status === 3
            ? "It's a draw"
            : ""}
        </h2>
      </div>
    </div>
  );
}

export default PlayerPanel;