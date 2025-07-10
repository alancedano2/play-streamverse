// src/app/lista-juegos/page.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { games, Game } from '@/data/games';
import { useUser } from '@clerk/nextjs';

export default function ListaJuegosPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [message, setMessage] = useState<string | null>(null);
  const [addingGameId, setAddingGameId] = useState<string | null>(null);

  const handleAddToLibrary = async (game: Game) => {
    if (!isSignedIn || !user) {
      setMessage('Debes iniciar sesión para añadir juegos.');
      setTimeout(() => setMessage(null), 4000);
      return;
    }

    setAddingGameId(game.id);
    try {
      const response = await fetch('/api/user-games/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: user.id,
          username: user.username || user.firstName || 'Usuario',
          gameId: game.id,
          gameName: game.name,
          logoUrl: game.logoUrl,
          platform: game.platform,
          status: game.status,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al añadir el juego.');
      }

      setMessage(`✅ "${game.name}" añadido a tu biblioteca.`);
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setAddingGameId(null);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1D] text-white p-8 pt-28">
      {message && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-700 text-white py-2 px-6 rounded-lg shadow-lg z-50">
          {message}
        </div>
      )}

      <h1 className="text-4xl font-bold text-center mb-10 text-[#008CFF]">Lista de Juegos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-[#282A31] p-4 rounded-lg shadow-md border border-[#3A3D44] flex flex-col justify-between"
          >
            <div className="relative w-full aspect-video mb-4">
              <Image
                src={game.logoUrl || '/placeholder.jpg'}
                alt={game.name}
                fill
                className="object-cover rounded"
              />
              {game.status !== 'Disponible' && (
                <span className="absolute top-2 right-2 bg-yellow-600 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
                  No Disponible
                </span>
              )}
            </div>

            <h2 className="text-xl font-semibold text-[#00ADB5] mb-1">{game.name}</h2>
            <p className="text-sm text-[#B0B0B0] mb-2">{game.platform || 'Plataforma desconocida'}</p>
            <p className="text-xs text-[#777] mb-4">Estado: {game.status || 'Desconocido'}</p>

            <button
              disabled={addingGameId === game.id}
              onClick={() => handleAddToLibrary(game)}
              className={`w-full py-2 rounded-md font-semibold transition ${
                addingGameId === game.id
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-[#008CFF] hover:bg-[#00A0FF]'
              }`}
            >
              {addingGameId === game.id ? 'Añadiendo...' : 'Añadir a la Biblioteca'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
