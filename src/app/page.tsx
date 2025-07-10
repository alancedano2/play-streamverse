// src/app/page.tsx
'use client'; // This directive is necessary for using client-side hooks like useUser

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter for potential future programmatic navigation

export default function HomePage() {
  const { isLoaded, isSignedIn } = useUser();

  // If Clerk is still loading, you might want to show a loading spinner
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#1A1A1D] text-[#E0E0E0] flex justify-center items-center">
        <p className="text-xl text-[#008CFF]">Cargando...</p>
      </div>
    );
  }

  // If the user is not signed in, show the Sign In/Sign Up buttons
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#1A1A1D] text-[#E0E0E0] flex flex-col justify-center items-center p-8">
        <h1 className="text-4xl font-bold mb-6 text-[#008CFF] text-center">Bienvenido a StreamVerse Games</h1>
        <p className="text-lg text-[#B0B0B0] mb-8 text-center max-w-prose">
          Inicia sesión o regístrate para acceder a tu biblioteca de juegos y empezar a jugar en la nube.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/sign-in" passHref>
            <button className="bg-[#008CFF] text-white py-3 px-8 rounded-md hover:bg-[#00A0FF] font-semibold text-lg transition-colors duration-200 shadow-lg w-full sm:w-auto">
              Iniciar Sesión
            </button>
          </Link>
          <Link href="/sign-up" passHref>
            <button className="bg-green-600 text-white py-3 px-8 rounded-md hover:bg-green-700 font-semibold text-lg transition-colors duration-200 shadow-lg w-full sm:w-auto">
              Registrarse
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // If the user is signed in, display the regular home page content
  return (
    <div className="min-h-screen bg-[#1A1A1D] text-[#E0E0E0] p-8 pt-28 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-[#008CFF]">¡Bienvenido a StreamVerse Games!</h1>

      <p className="text-lg text-[#B0B0B0] text-center mb-10 max-w-3xl">
        Tu destino para disfrutar de tus juegos favoritos en la nube. Explora nuestra biblioteca,
        gestiona tus títulos y sumérgete en una experiencia de juego fluida desde cualquier lugar.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Link href="/lista-juegos" passHref className="group">
          <div className="bg-[#282A31] rounded-lg shadow-xl p-6 text-center border border-[#3A3D44] transition-all duration-300 transform group-hover:scale-105 group-hover:bg-[#3A3D44]">
            <h2 className="text-2xl font-semibold mb-3 text-[#00ADB5] group-hover:text-[#00C2CC]">Explorar Juegos</h2>
            <p className="text-[#B0B0B0]">
              Descubre y añade nuevos juegos a tu biblioteca personal.
            </p>
          </div>
        </Link>

        <Link href="/biblioteca" passHref className="group">
          <div className="bg-[#282A31] rounded-lg shadow-xl p-6 text-center border border-[#3A3D44] transition-all duration-300 transform group-hover:scale-105 group-hover:bg-[#3A3D44]">
            <h2 className="text-2xl font-semibold mb-3 text-[#00ADB5] group-hover:text-[#00C2CC]">Mi Biblioteca</h2>
            <p className="text-[#B0B0B0]">
              Accede y lanza todos los juegos que has añadido a tu colección.
            </p>
          </div>
        </Link>
      </div>

      {/* Optionally, you can add more sections for signed-in users */}
      <div className="mt-16 text-center text-[#B0B0B0]">
        <p>¿Necesitas ayuda para conectar Sunshine? Visita nuestra página de <Link href="/sunshine-connect" className="text-[#008CFF] hover:underline">conexión Sunshine</Link>.</p>
      </div>
    </div>
  );
}
