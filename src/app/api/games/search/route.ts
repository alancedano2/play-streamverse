import { NextResponse } from 'next/server';

// Definimos interfaces para la estructura esperada de los datos de RAWG API
interface PlatformDetail {
  name: string;
}

interface Platform {
  platform: PlatformDetail;
}

interface RawgGameResult {
  id: number; // El ID de RAWG es numérico
  name: string;
  background_image: string | null;
  platforms?: Platform[]; // 'platforms' puede ser opcional
}

// Interfaz para el formato de juego que tu front-end espera
interface GameData {
  id: string;
  name: string;
  logoUrl: string;
  platform: string;
  status: string; // Asumiendo que 'Desconocido' es un string
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const rawgApiKey = process.env.RAWG_API_KEY;

  if (!rawgApiKey) {
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

    const data: { results: RawgGameResult[] } = await response.json(); // Tipamos la respuesta

    const games: GameData[] = data.results.map((game: RawgGameResult) => ({ // Usamos RawgGameResult
      id: game.id.toString(), // Convertimos a string para compatibilidad con tu interfaz Game
      name: game.name,
      logoUrl: game.background_image || '/placeholder-game.png',
      platform: game.platforms?.map((p: Platform) => p.platform.name).join(', ') || 'N/A', // Usamos Platform
      status: 'Desconocido',
    }));

    return NextResponse.json(games);
  } catch (error) {
    console.error('Server error during RAWG search API call:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
