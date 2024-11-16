import React from "react";
import { UseConnect4 } from "./UseConnect4";

function App() {
  const { board, status, player, dropPiece, resetBoard } = UseConnect4();

  const getMessages = () => {
    switch (status) {
      case 'active':
        return `${player}'s turn`;
        break;
      case 'draw':
        return 'It\'s a Draw!';
        break;

      default:
        return `${status} wins!`;
        break;
    }
  }

  return (
    <div className="App container">
      <h1>Connect 4</h1>
      <div
        className="row"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div className="info-container">
          <h2>{getMessages()}</h2>
          <button onClick={() => resetBoard()}>New Game</button>
        </div>
        <div>
          {board.map((row, i) => (
            <div key={i} className="row">
              {row.map((cell, j) => (
                <div
                  key={j}
                  className="cell"
                  onClick={() => dropPiece(j)}
                  style={{ backgroundColor: cell }}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
