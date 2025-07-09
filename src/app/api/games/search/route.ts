// src/app/api/games/search/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query'); // Término de búsqueda
  const rawgApiKey = process.env.RAWG_API_KEY; // Obtiene la clave API de las variables de entorno

  if (!rawgApiKey) {
    // En un entorno de producción, esto debería ser un error más genérico para el cliente.
    // Pero para desarrollo, es útil saber el error específico.
    console.error("RAWG_API_KEY no configurada en el servidor.");
    return NextResponse.json({ error: 'Server API key not configured' }, { status: 500 });
  }

  if (!query) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

  try {
    const rawgUrl = `https://api.rawg.io/api/games?key=${rawgApiKey}&search=${query}&page_size=10`;

    const response = await fetch(rawgUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching from RAWG API:', response.status, errorText);
      return NextResponse.json({ error: `Failed to fetch from RAWG API: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    const games = data.results.map((game: any) => ({
      id: game.id.toString(),
      name: game.name,
      logoUrl: game.background_image || '/placeholder-game.png',
      platform: game.platforms?.map((p: any) => p.platform.name).join(', ') || 'N/A',
      status: 'Desconocido', // Este estado es de tu DB interna, RAWG no lo provee.
    }));

    return NextResponse.json(games);
  } catch (error) {
    console.error('Server error during RAWG search API call:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}