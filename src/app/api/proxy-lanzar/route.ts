// src/app/api/proxy-lanzar/route.ts
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const backendUrl = 'https://82aa21c82b66.ngrok-free.app/api/lanzar'; // tu Flask server

  try {
    const res = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    // Intenta parsear JSON, pero si falla, devuelve texto plano
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: 'Fallo al comunicarse con el backend Flask' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
