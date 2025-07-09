// src/app/page.tsx
'use client'; // Esto indica que es un Client Component

import { useUser, UserButton } from "@clerk/nextjs"; // Importa hooks y componentes de Clerk
import Link from "next/link"; // Para enlaces de navegación

export default function HomePage() {
  // Usa el hook useUser para obtener la información del usuario logueado
  const { isSignedIn, user, isLoaded } = useUser();

  // Muestra un estado de carga mientras Clerk carga la sesión
  if (!isLoaded) {
    return (
      // Asegúrate de que este cargador tenga suficiente padding desde la parte superior
      <div className="flex items-center justify-center min-h-screen bg-[#1A1A1D] text-white pt-20">
        Cargando...
      </div>
    );
  }

  return (
    // Contenido de la página principal (debajo del header)
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-8 bg-[#1A1A1D] text-[#E0E0E0]">
      {isSignedIn ? (
        <>
          <h2 className="text-4xl font-bold mb-4 text-[#008CFF]">¡Bienvenido, {user.username || user.firstName || "Jugador"}!</h2>
          <p className="text-lg mb-8 text-[#B0B0B0]">Este es el panel principal de StreamVerse Gaming.</p>
          <div className="bg-[#282A31] p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-[#00ADB5]">Tu Aventura Comienza Aquí</h3>
            <p className="mb-4">Explora una vasta colección de juegos, conecta con otros jugadores y no te pierdas ningún stream.</p>
            <Link href="#" className="bg-[#008CFF] text-white py-2 px-4 rounded-md hover:bg-[#00A0FF] font-semibold transition">
              Explorar Juegos
            </Link>
          </div>
        </>
      ) : (
        // Mensaje si no está logueado (aunque la protección de ruta lo redirigirá)
        <>
          <h2 className="text-4xl font-bold mb-4 text-[#008CFF]">Únete a la Diversión</h2>
          <p className="text-lg mb-8 text-[#B0B0B0]">Inicia sesión o regístrate para acceder a todas las funciones.</p>
          <div className="space-x-4">
            <Link href="/sign-in" className="bg-[#008CFF] text-white py-3 px-6 rounded-lg hover:bg-[#00A0FF] font-semibold transition">
              Iniciar Sesión
            </Link>
            <Link href="/sign-up" className="bg-[#00ADB5] text-white py-3 px-6 rounded-lg hover:bg-[#00CCDA] font-semibold transition">
              Registrarse
            </Link>
          </div>
        </>
      )}
    </main>
  );
}