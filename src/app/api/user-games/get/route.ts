// src/app/api/user-games/get/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import * as admin from 'firebase-admin';

interface FirestoreUserGame {
  id?: string;
  clerkId: string;
  username: string;
  gameId: string;
  gameName: string;
  addedAt: admin.firestore.Timestamp;
}

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

    const userGames: FirestoreUserGame[] = []; // <--- ¡AQUÍ ESTÁ LA CORRECCIÓN!
    userGamesSnapshot.forEach(doc => {
      userGames.push({ id: doc.id, ...(doc.data() as FirestoreUserGame) });
    });

    return NextResponse.json({ success: true, data: userGames });
  } catch (error: any) {
    console.error('Error al obtener juegos del usuario desde Firebase:', error);
    return NextResponse.json({ error: 'Error al obtener los juegos del usuario', details: error.message || 'No details' }, { status: 500 });
  }
}
