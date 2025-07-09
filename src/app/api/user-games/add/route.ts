import { NextResponse, NextRequest } from 'next/server';
import { firestore } from '@/lib/firebaseAdmin';
import * as admin from 'firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { clerkId, username, gameId, gameName } = await request.json();

    if (!clerkId || !gameId || !gameName) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    const userGameRef = firestore.collection('userGames').doc(`${clerkId}_${gameId}`);

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

    return NextResponse.json({ success: true, message: 'Juego guardado/actualizado' });
  } catch (error) {
    console.error('Error inesperado al guardar el juego:', error);
    return NextResponse.json({ error: 'Error inesperado al guardar el juego' }, { status: 500 });
  }
}
