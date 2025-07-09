import { NextRequest, NextResponse } from 'next/server';
import { firestore as db } from '@/lib/firebaseAdmin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get('clerkId');

    if (!clerkId) {
      return NextResponse.json({ error: 'Falta clerkId' }, { status: 400 });
    }

    const snapshot = await db.collection('userGames')
      .where('clerkId', '==', clerkId)
      .get();

    const userGames = snapshot.docs.map(doc => doc.data());

    return NextResponse.json({ success: true, userGames });
  } catch (error) {
    console.error('Error al obtener juegos del usuario:', error);
    return NextResponse.json({ error: 'Error inesperado al obtener juegos' }, { status: 500 });
  }
}
