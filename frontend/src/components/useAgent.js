export function useAgent() {

  const makeAgentMove = async (board, player, dropPiece) => {
    const response = await fetch("http://localhost:5000/api/move", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ board, player }),
    });
    
    const data = await response.json();
    console.log(data);
    dropPiece(data.move);
  }

  return { makeAgentMove };
}