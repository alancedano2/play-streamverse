import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function POST(req: Request) {
  try {
    const { clerkId, username, gameId, gameName } = await req.json();

    if (!clerkId || !gameId || !gameName) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    const userGameRef = admin.firestore().collection('userGames').doc(`${clerkId}_${gameId}`);

    await userGameRef.set(
      {
        clerkId,
        username,
        gameId,
        gameName,
        addedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return NextResponse.json({ success: true, message: 'Juego guardado/actualizado en la biblioteca' });
  } catch (error) {
    console.error('Error inesperado al guardar el juego en Firebase:', error);
    return NextResponse.json({ error: 'Error inesperado al guardar el juego' }, { status: 500 });
  }
}
