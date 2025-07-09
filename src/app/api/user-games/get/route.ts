import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get('clerkId');

    if (!clerkId) {
      return NextResponse.json({ error: 'Falta el parámetro clerkId' }, { status: 400 });
    }

    const snapshot = await admin.firestore()
      .collection('userGames')
      .where('clerkId', '==', clerkId)
      .get();

    const userGames = snapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot) => doc.data());

    return NextResponse.json({ success: true, userGames });
  } catch (error) {
    console.error('Error al obtener los juegos del usuario:', error);
    return NextResponse.json({ error: 'Error al obtener los juegos del usuario' }, { status: 500 });
  }
}
