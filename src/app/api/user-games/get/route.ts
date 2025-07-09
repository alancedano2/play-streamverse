import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await request.json();

  return new Response(JSON.stringify({ success: true, data }));
}
