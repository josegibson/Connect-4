const API_URL = process.env.API_URL || "http://localhost:5000";

export function useAgent() {
  const makeAgentMove = async (board, player, dropPiece, agent) => {
    const response = await fetch(`${API_URL}/api/move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ board: board, player: player, agent: agent }),
    });

    const data = await response.json();
    console.log(data);
    dropPiece(data.move);
  };

  return { makeAgentMove };
}