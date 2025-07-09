'use client'; // Marcar como Client Component

import React, { useState } from 'react';
import Image from 'next/image';
import { games, Game } from '@/data/games'; // Importa los datos de los juegos
import { useUser } from '@clerk/nextjs'; // Importa useUser para obtener el ID del usuario

export default function ListaJuegosPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [addMessage, setAddMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  const handleAddToLibrary = async (game: Game) => {
    if (!isSignedIn || !user || !user.id || !user.username) {
      setAddMessage('Debes iniciar sesión para añadir juegos a tu biblioteca.');
      setMessageType('error');
      setTimeout(() => setAddMessage(null), 5000);
      return;
    }

    setAddMessage(`Añadiendo "${game.name}"...`);
    setMessageType(null);

    try {
      const response = await fetch('/api/user-games/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkId: user.id,
          username: user.username,
          gameId: game.id,
          gameName: game.name,
          // Puedes incluir el status del juego si quieres almacenarlo en Firebase también
          // status: game.status,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAddMessage(`"${game.name}" ha sido añadido a tu biblioteca.`);
        setMessageType('success');
      } else {
        setAddMessage(`Error al añadir "${game.name}": ${data.error || 'Error desconocido'}`);
        setMessageType('error');
        console.error('Error al añadir juego:', data.error);
      }
    } catch (error) {
      setAddMessage(`Error de conexión al añadir "${game.name}".`);
      setMessageType('error');
      console.error('Network error adding game:', error);
    } finally {
      setTimeout(() => setAddMessage(null), 5000);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1A1A1D] text-white pt-20">
        Cargando usuario...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A1D] text-[#E0E0E0] p-8 pt-28 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-[#008CFF]">Lista de Juegos</h1>
      <p className="text-lg text-[#B0B0B0] text-center max-w-2xl mb-12">
        Explora una vasta colección de juegos disponibles en StreamVerse Gaming.
        ¡Prepárate para nuevas aventuras!
      </p>

      {addMessage && (
        <div className={`mb-4 p-3 rounded-md text-center max-w-md w-full animate-fade-in-down
          ${messageType === 'success' ? 'bg-green-700 bg-opacity-30 text-green-200 border border-green-600' : 'bg-red-700 bg-opacity-30 text-red-200 border border-red-600'}`}
        >
          {addMessage}
        </div>
      )}

      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {games.map((game: Game) => (
          <div key={game.id} className="bg-[#282A31] rounded-md border border-[#3A3D44] shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <div className="relative w-full aspect-video overflow-hidden">
              <Image
                src={game.logoUrl}
                alt={game.name}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-t-md"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              />
              {game.note && (
                <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
                  {game.note}
                </span>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 text-[#00ADB5]">{game.name}</h2>
              <p className="text-sm text-[#B0B0B0] mb-3">{game.platform}</p>
              <div className="flex items-center mb-4">
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${game.status === 'Disponible' ? 'bg-green-600 bg-opacity-20 text-green-300' : 'bg-red-600 bg-opacity-20 text-red-300'}`}>
                  {game.status}
                </span>
              </div>
              {/* Botón "Añadir a la biblioteca" - AHORA SIEMPRE ACTIVO */}
              <button
                onClick={() => handleAddToLibrary(game)}
                className="mt-4 w-full bg-[#008CFF] text-white py-2 px-4 rounded-md hover:bg-[#00A0FF] font-semibold transition"
                // Se eliminó la condición 'disabled={game.status !== 'Disponible'}'
              >
                Añadir a la biblioteca
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}