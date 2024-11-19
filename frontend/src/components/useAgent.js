const API_URL = process.env.API_URL;

export function useAgent() {
  const makeAgentMove = async (board, player, dropPiece, agent) => {

    const response_ = await fetch(`${API_URL}/`);
    const json = await response_.json();
    console.log(json);


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