// src/utils/api.ts

export async function lanzarJuego(gameId: string) {
  const NGROK_URL = "https://85ed7ac043b9.ngrok-free.app"; // Reemplaza si cambia

  try {
    const response = await fetch(`${NGROK_URL}/api/lanzar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gameId }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Error desconocido');
    }

    return result;
  } catch (error: any) {
    console.error('Error lanzando juego desde frontend:', error);
    throw new Error(error.message || 'Error al lanzar juego');
  }
}
