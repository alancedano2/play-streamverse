import { NextResponse, NextRequest } from 'next/server';
import { admin } from '@/lib/firebaseAdmin';

const firestore = admin.firestore();

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const clerkId = url.searchParams.get('clerkId');

    if (!clerkId) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    const snapshot = await firestore
      .collection('userGames')
      .where('clerkId', '==', clerkId)
      .get();

    const userGames = snapshot.docs.map(doc => doc.data());

    return NextResponse.json({ success: true, userGames });
  } catch (error) {
    console.error('Error fetching user games:', error);
    return NextResponse.json({ error: 'Error inesperado al obtener los juegos' }, { status: 500 });
  }
}
