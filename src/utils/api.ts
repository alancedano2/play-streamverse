export async function lanzarJuego(gameId: string) {
  const response = await fetch('/api/proxy-lanzar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gameId }),
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Respuesta no válida del servidor.');
  }

  if (!response.ok) {
    throw new Error(data.error || 'Error desconocido');
  }

  return data;
}
