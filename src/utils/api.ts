export async function lanzarJuego(gameId: string) {
  const res = await fetch('https://82aa21c82b66.ngrok-free.app/api/lanzar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gameId }),
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}
