// src/app/page.tsx
import { currentUser } from '@clerk/nextjs/server';

export default async function HomePage() {
  const user = await currentUser();

  if (!user) {
    return (
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Bienvenido a StreamVerse</h1>
        <p>Por favor, inicia sesión para continuar.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Hola, {user.firstName} 👋</h1>
      <p>Bienvenido a tu biblioteca de juegos.</p>
    </main>
  );
}
