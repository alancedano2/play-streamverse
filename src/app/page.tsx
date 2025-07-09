'use client';
import { auth } from '@clerk/nextjs';

export default function HomePage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = auth(); // Se mantiene para futuras funciones

  return (
    <main>
      <h1>Bienvenido</h1>
    </main>
  );
}
