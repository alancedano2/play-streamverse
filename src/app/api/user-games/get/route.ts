import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin'; // Importa tu instancia de Firestore

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get('clerkId');

    if (!clerkId) {
      return NextResponse.json({ error: 'Falta el ID del usuario (clerkId)' }, { status: 400 });
    }

    const userGamesSnapshot = await db.collection('userGames')
                                      .where('clerkId', '==', clerkId)
                                      .get();

    const userGames: any[] = [];
    userGamesSnapshot.forEach(doc => {
      userGames.push({ id: doc.id, ...doc.data() });
    });

    return NextResponse.json({ success: true, data: userGames });
  } catch (error) {
    console.error('Error al obtener juegos del usuario desde Firebase:', error);
    return NextResponse.json({ error: 'Error al obtener los juegos del usuario' }, { status: 500 });
  }
}