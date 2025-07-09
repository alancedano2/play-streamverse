import { NextResponse, type NextRequest } from 'next/server';
import { firestore } from '@/lib/firebaseAdmin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get('clerkId');

    if (!clerkId) {
      return NextResponse.json({ error: 'Falta clerkId' }, { status: 400 });
    }

    const snapshot = await firestore.collection('userGames').where('clerkId', '==', clerkId).get();

    const games = snapshot.docs.map(doc => doc.data());

    return NextResponse.json({ success: true, games });
  } catch (error) {
    console.error('Error fetching user games:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
