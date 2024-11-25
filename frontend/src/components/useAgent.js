const API_URL = process.env.REACT_APP_API_URL;

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
    dropPiece(data.move);
  };

  const updateConfig = async (config) => {
    const response = await fetch(`${API_URL}/api/config`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({columns: config.cols, rows: config.rows, inarow: config.inARow}),
    });

    const data = await response.json();
    console.log(data);
  };

  const getConfig = async () => {
    const response = await fetch(`${API_URL}/api/config`, {
      method: "GET",
    });

    const data = await response.json();
    console.log(data);
    return data;
  };

  return { makeAgentMove, updateConfig, getConfig };
}
