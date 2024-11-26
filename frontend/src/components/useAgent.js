const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export function useAgent() {
  const makeAgentMove = async (agent, config, board, player, dropPiece) => {

    const payload = {
      agent,
      config,
      board,
      player,
    };

    const url = `${API_URL}/move`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    dropPiece(data.move);
  };

  return { makeAgentMove };
}
