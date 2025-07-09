import { auth } from '@clerk/nextjs'; // o donde sea que lo importas

export default function HomePage() {
  const user = auth(); // Usa la función aunque sea por ahora

  return (
    <main>
      <h1>Bienvenido</h1>
      {/* Puedes mostrar info del usuario si quieres */}
      {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
    </main>
  );
}
