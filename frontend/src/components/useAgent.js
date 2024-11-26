const API_URL = process.env.REACT_APP_API_URL;

export function useAgent() {
  const makeAgentMove = async (agent, config, board, player, dropPiece) => {
    const response = await fetch(`${API_URL}/move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({"config": config, "board": board, "player": player, "agent": agent }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error making agent move:", errorData.error);
      return;
    }

    const data = await response.json();
    dropPiece(data.move);
  };

  return { makeAgentMove };
}
