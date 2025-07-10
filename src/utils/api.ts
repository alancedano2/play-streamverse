// src/utils/api.ts

export async function lanzarJuego(gameId: string) {
  const response = await fetch('/api/proxy-lanzar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gameId }),
  });
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || 'Error desconocido');
  }
  return response.json();
}
