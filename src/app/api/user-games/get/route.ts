import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Si realmente no conoces el tipo, usa `unknown` y verifica antes de usarlo
  const data: unknown = await request.json();

  if (typeof data !== 'object' || data === null) {
    return new Response('Invalid data', { status: 400 });
  }

  // Aquí puedes hacer casting tras validar `data`
  type Payload = { userId: string; };
  const payload = data as Payload;

  return new Response(JSON.stringify({ userGames: [], userId: payload.userId }));
}
