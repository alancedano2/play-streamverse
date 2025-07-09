// middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    /*
     * Proteger todas las rutas excepto las estáticas y favicon.
     * Puedes personalizar esto según tu proyecto.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
