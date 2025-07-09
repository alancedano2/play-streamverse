import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin'; // Importa tu instancia de Firestore
import * as admin from 'firebase-admin'; // Importa admin para el tipo Timestamp

// Define la interfaz para cómo se almacenan los UserGames en Firestore
interface FirestoreUserGame {
  id?: string; // El ID del documento de Firestore puede ser opcional al inicializar, pero lo añadimos al objeto
  clerkId: string;
  username: string;
  gameId: string;
  gameName: string;
  addedAt: admin.firestore.Timestamp; // Usamos el tipo Timestamp de Firebase Admin SDK
  // Puedes añadir más campos si los almacenas en tu colección 'userGames'
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

    // Tipamos explícitamente el array userGames con la nueva interfaz
    const userGames: FirestoreUserGame[] = [];
    userGamesSnapshot.forEach(doc => {
      // Al añadir, aseguramos que el ID del documento también se incluya y que los datos coincidan con la interfaz
      userGames.push({ id: doc.id, ...(doc.data() as FirestoreUserGame) });
    });

    return NextResponse.json({ success: true, data: userGames });
  } catch (error: any) { // Tipamos 'error' como 'any' en el catch para evitar linting warnings si no se usa instanceOf
    console.error('Error al obtener juegos del usuario desde Firebase:', error);
    return NextResponse.json({ error: 'Error al obtener los juegos del usuario', details: error.message || 'No details' }, { status: 500 });
  }
}
