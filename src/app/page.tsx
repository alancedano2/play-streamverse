import { auth } from '@clerk/nextjs'; // Solo deja 'auth' si no usas UserButton
// import { UserButton, auth } from '@clerk/nextjs'; // Si no se usa, comenta o elimina esta línea entera

export default function Home() {
  // const { userId } = auth(); // Si no se usa userId, comenta o elimina
  return (
    <main className="min-h-screen bg-[#1A1A1D] text-[#E0E0E0] p-8 pt-28 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-[#008CFF]">Bienvenido a StreamVerse Gaming</h1>
      <p className="text-lg text-[#B0B0B0] text-center max-w-2xl mb-12">
        Explora y gestiona tu biblioteca de juegos, descubre nuevos títulos y conéctate con otros jugadores.
      </p>
      {/* <UserButton afterSignOutUrl="/" /> */}{/* Descomentar y usar si quieres el botón */}
    </main>
  );
}
