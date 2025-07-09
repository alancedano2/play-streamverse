import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin'; // Importa tu instancia de Firestore (la base de datos)
import * as admin from 'firebase-admin'; // <--- ¡AÑADE ESTA LÍNEA! Es necesaria para el tipo 'admin.firestore.Timestamp'

// Define la interfaz para cómo se almacenan los UserGames en Firestore
interface FirestoreUserGame {
  id?: string;
  clerkId: string;
  username: string;
  gameId: string;
  gameName: string;
  addedAt: admin.firestore.Timestamp; // Ahora 'admin' estará definido para este tipo
  // Puedes añadir más campos si los almacenas en tu colección 'userGames'
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get('clerkId');

    if (!clerkId) {
      return NextResponse.json({ error: 'Falta el ID del usuario (clerkId)' }, { status: 400 });
    }

    // Asegúrate de usar 'db.collection' aquí, no 'admin.firestore().collection'
    const userGamesSnapshot = await db.collection('userGames') // <--- ¡ASEGÚRATE DE USAR 'db.collection' AQUÍ!
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
