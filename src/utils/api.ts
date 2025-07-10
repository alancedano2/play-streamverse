export async function lanzarJuego(gameId: string) {
  const response = await fetch("https://20f204adf8c1.ngrok-free.app/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "6E4B866CF3FA4724757FC96A9369F",
    },
    body: JSON.stringify({ game: gameId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al lanzar el juego");
  }

  return await response.json();
}
