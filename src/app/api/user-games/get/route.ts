import { NextRequest, NextResponse } from 'next/server';
import { firestore as db } from '@/lib/firebaseAdmin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get('clerkId');

    if (!clerkId) {
      return NextResponse.json({ error: 'Falta el parámetro clerkId' }, { status: 400 });
    }

    // Consulta todos los documentos en userGames cuyo clerkId sea igual al pasado
    const snapshot = await db
      .collection('userGames')
      .where('clerkId', '==', clerkId)
      .get();

    const userGames: Array<{ gameId: string; gameName: string }> = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      userGames.push({
        gameId: data.gameId,
        gameName: data.gameName,
      });
    });

    return NextResponse.json({ success: true, data: userGames });
  } catch (error) {
    console.error('Error al obtener juegos del usuario:', error);
    return NextResponse.json({ error: 'Error interno al obtener juegos' }, { status: 500 });
  }
}
