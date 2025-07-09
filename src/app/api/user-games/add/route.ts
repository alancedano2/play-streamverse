import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin'; // Importa tu instancia de Firestore
import * as admin from 'firebase-admin'; // <--- ¡AÑADE ESTA LÍNEA!

export async function POST(req: Request) {
  try {
    const { clerkId, username, gameId, gameName } = await req.json();

    if (!clerkId || !gameId || !gameName) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    const userGameRef = db.collection('userGames').doc(`${clerkId}_${gameId}`);

    await userGameRef.set(
      {
        clerkId,
        username,
        gameId,
        gameName,
        addedAt: admin.firestore.FieldValue.serverTimestamp(), // 'admin' ahora estará definido
      },
      { merge: true }
    );

    return NextResponse.json({ success: true, message: 'Juego guardado/actualizado en la biblioteca' });
  } catch (error: any) {
    console.error('Error inesperado al guardar el juego en Firebase:', error);
    return NextResponse.json({ error: 'Error inesperado al guardar el juego' }, { status: 500 });
  }
}
