// src/app/lista-juegos/page.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { games, Game } from '@/data/games';
import { useUser } from '@clerk/nextjs';

export default function ListaJuegosPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [addingGameId, setAddingGameId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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
          gameId: game.id,
          gameName: game.name,
          username: user.username || user.firstName || 'Usuario',
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al añadir el juego.');
      }
      setMessage(`"${game.name}" añadido a tu biblioteca.`);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setAddingGameId(null);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1D] text-white p-8 pt-28">
      <h1 className="text-4xl font-bold mb-10 text-[#008CFF] text-center">Lista de Juegos</h1>

      {message && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white py-2 px-6 rounded-lg shadow-lg z-50">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {games.map((game) => (
          <div key={game.id} className="bg-[#282A31] p-4 rounded-lg shadow-md border border-[#3A3D44] flex flex-col items-center">
            <div className="aspect-video relative w-full mb-4">
              <Image src={game.logoUrl} alt={game.name} fill className="object-cover rounded" />
            </div>
            <h2 className="text-xl font-semibold text-[#00ADB5] mb-4">{game.name}</h2>
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
