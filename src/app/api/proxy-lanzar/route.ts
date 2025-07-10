// src/app/api/proxy-lanzar/route.ts
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.gameId) {
      return new Response(JSON.stringify({ error: 'Falta gameId en el body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch('https://85ed7ac043b9.ngrok-free.app/api/lanzar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gameId: body.gameId }),
    });

    const contentType = res.headers.get('content-type') || '';

    let responseData;
    if (contentType.includes('application/json')) {
      responseData = await res.json();
    } else {
      responseData = { status: await res.text() };
    }

    return new Response(JSON.stringify(responseData), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error en proxy-lanzar:', error);
    return new Response(JSON.stringify({ error: 'Error en el proxy: ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
