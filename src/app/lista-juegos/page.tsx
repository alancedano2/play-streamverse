// src/app/lista-juegos/page.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { games, Game } from '@/data/games';
import { useUser } from '@clerk/nextjs'; // Import useUser hook

export default function ListaJuegosPage() {
  const { isLoaded, isSignedIn, user } = useUser(); // Get user status
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loadingAdd, setLoadingAdd] = useState<string | null>(null); // State for loading on specific game add
  const [message, setMessage] = useState<string | null>(null);
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToLibrary = async (game: Game) => {
    if (!isSignedIn || !user) {
      setMessage('Debes iniciar sesión para añadir juegos a tu biblioteca.');
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
      messageTimeoutRef.current = setTimeout(() => setMessage(null), 5000);
      return;
    }

    setLoadingAdd(game.id); // Set loading for this specific game
    setMessage(null); // Clear previous messages

    try {
      const response = await fetch('/api/user-games/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkId: user.id,
          username: user.username || user.firstName || 'Unknown User',
          gameId: String(game.id), // Ensure gameId is a string
          gameName: game.name,
        }),
      });

      if (response.ok) {
        setMessage(`"${game.name}" añadido a tu biblioteca.`);
      } else {
        const errorData = await response.json();
        setMessage(`Error al añadir "${game.name}": ${errorData.error || 'Desconocido'}`);
      }
    } catch (error) {
      setMessage(`Error de conexión al añadir "${game.name}".`);
      console.error('Error adding game to library:', error);
    } finally {
      setLoadingAdd(null); // Stop loading
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
      messageTimeoutRef.current = setTimeout(() => setMessage(null), 5000);
    }
  };

  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  // If Clerk is still loading, show a loading message
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
        <h1 className="text-4xl font-bold mb-6 text-[#008CFF] text-center">Acceso Restringido</h1>
        <p className="text-lg text-[#B0B0B0] mb-8 text-center max-w-prose">
          Debes iniciar sesión o registrarte para ver la lista completa de juegos y añadir a tu biblioteca.
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

  // If the user is signed in, render the actual page content
  return (
    <div className="min-h-screen bg-[#1A1A1D] text-[#E0E0E0] p-8 pt-28 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-[#008CFF]">Lista de Juegos</h1>

      <div className="w-full max-w-3xl mb-8">
        <input
          type="text"
          placeholder="Buscar juegos..."
          className="w-full p-3 rounded-md bg-[#282A31] border border-[#3A3D44] text-[#E0E0E0] placeholder-[#B0B0B0] focus:outline-none focus:border-[#008CFF]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {message && (
        <div className={`p-4 rounded-md mb-6 w-full max-w-lg text-center ${
            message.includes('Error') ? 'bg-red-700 text-red-100 border border-red-600' : 'bg-green-700 text-green-100 border border-green-600'
          }`}>
          {message}
        </div>
      )}

      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {filteredGames.map((game) => (
          <div key={game.id} className="bg-[#1A1A1D] rounded-md border border-[#3A3D44] shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <div className="relative w-full aspect-video overflow-hidden">
              <Image
                src={game.logoUrl}
                alt={game.name}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-t-md"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              />
              {game.status === 'No disponible' && (
                 <span className="absolute top-2 right-2 bg-yellow-600 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
                   No Disponible
                 </span>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 text-[#00ADB5]">{game.name}</h2>
              <p className="text-sm text-[#B0B0B0] mb-3">{game.platform}</p>
              <button
                onClick={() => handleAddToLibrary(game)}
                className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loadingAdd === game.id || game.status === 'No disponible'}
              >
                {loadingAdd === game.id ? 'Añadiendo...' : 'Añadir a Mi Biblioteca'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
