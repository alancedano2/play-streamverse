// middleware.ts
import { clerkMiddleware, getAuth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware({
  // Opcional: configura las rutas que quieres que proteja el middleware
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
});

// (Opcional) Puedes exportar config para hacer matcher más específicos
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
