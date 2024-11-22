import React from "react";
import Dropdown from "./Dropdown";

function ConfigPanel({
  players,
  turn,
  status,
  onAgentChange,
  agents,
  config,
  newGame,
  onBoardSizeChange,
  onInARowChange,
}) {
  return (
    <div className="container">
      <h4
        className={`display-tile player-${
          status === 1 || status === 2 ? status : ""
        }`}
        style={{ margin: 0 }}
      >
        {status === 1 || status === 2
          ? `Player ${status} won!!`
          : status === 3
          ? "It's a draw"
          : ""}
      </h4>
      <Dropdown
        label="Board Size"
        options={[
          { label: "6x7", value: "6x7" },
          { label: "7x8", value: "7x8" },
          { label: "8x9", value: "8x9" },
        ]}
        selectedOption={config.size}
        onOptionChange={(value) => onBoardSizeChange(value)}
      />
      <Dropdown
        label="In a row"
        options={[
          { label: "4", value: "4" },
          { label: "5", value: "5" },
          { label: "6", value: "6" },
        ]}
        selectedOption={config.inARow}
        onOptionChange={(value) => onInARowChange(value)}
      />
      {players.map((player) => (
        <Dropdown
          className={`player-${player}  ${turn === player ? "active" : ""}`}
          label="Player"
          options={[
            { value: "random", label: "Random" },
            { value: "lookahead", label: "LookAhead" },
            { value: "human", label: "Human" },
          ]}
          selectedOption={agents[player]}
          onOptionChange={(value) =>
            onAgentChange({ target: { value } }, player)
          }
        />
      ))}      
      <button onClick={() => newGame()}>New Game</button>
    </div>
  );
}

export default ConfigPanel;
