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
  // --- LÍNEAS DE DIAGNÓSTICO ---
  console.log('--- DIAGNÓSTICO DE VARIABLES DE ENTORNO EN VERCEL ---');
  console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? 'DETECTADO' : 'NO DETECTADO');
  console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? 'DETECTADO' : 'NO DETECTADO');
  console.log('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? 'DETECTADO (contenido no mostrado)' : 'NO DETECTADO');
  console.log('TEST_APP_VARIABLE:', process.env.TEST_APP_VARIABLE ? 'DETECTADO' : 'NO DETECTADO');
  console.log('Valor de TEST_APP_VARIABLE (si detectado):', process.env.TEST_APP_VARIABLE);
  console.log('--- FIN DIAGNÓSTICO ---');
  // --- FIN LÍNEAS DE DIAGNÓSTICO ---

  try {
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get('clerkId');

    if (!clerkId) {
      return NextResponse.json({ error: 'Falta el ID del usuario (clerkId)' }, { status: 400 });
    }

    const userGamesSnapshot = await db.collection('userGames')
                                      .where('clerkId', '==', clerkId)
                                      .get();

    const userGames: FirestoreUserGame[] = [];
    userGamesSnapshot.forEach(doc => {
      userGames.push({ id: doc.id, ...(doc.data() as FirestoreUserGame) });
    });

    return NextResponse.json({ success: true, data: userGames });
  } catch (error: any) {
    console.error('Error al obtener juegos del usuario desde Firebase:', error);
    return NextResponse.json({ error: 'Error al obtener los juegos del usuario', details: error.message || 'No details' }, { status: 500 });
  }
}
