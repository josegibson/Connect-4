import React from "react";

function PlayerPanel({ player, turn, status, onAgentChange, agent }) {
  return (
    <div className="player-panel">
      <div className={`display-tile player-${player} ${turn === player ? "active" : ""}`}></div>
      <div>
        <div style={{ textAlign: 'start' }}>
          <label htmlFor={`difficulty-${player}`} style={{ fontSize: 'small', margin: 0 }}>Played by </label>
          <div>
            <button 
              className={agent === "random" ? "active-tab" : "outlined"} 
              onClick={() => onAgentChange({ target: { value: "random" } }, player)}
            >
              Random
            </button>
            <button 
              className={agent === "lookahead" ? "active-tab" : "outlined"} 
              onClick={() => onAgentChange({ target: { value: "lookahead" } }, player)}
            >
              LookAhead
            </button>
            <button 
              className={agent === "human" ? "active-tab" : "outlined"} 
              onClick={() => onAgentChange({ target: { value: "human" } }, player)}
            >
              Human
            </button>
          </div>
        </div>
        <h2 style={{ margin: 0 }}>
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