// src/app/biblioteca/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { games, Game } from '@/data/games';
import { useUser } from '@clerk/nextjs';
import { lanzarJuego } from '@/utils/api';

interface UserGame extends Game {
  clerkId: string;
  username: string;
  addedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  id: string;
  gameId: string;
  gameName: string;
  status: 'Disponible' | 'No disponible' | 'Desconocido';
}

interface TutorialModalProps {
  game: UserGame;
  onClose: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ game, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
    <div className="bg-[#1A1A1D] rounded-lg shadow-xl border border-[#3A3D44] max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-[#E0E0E0] hover:text-[#008CFF] text-3xl font-bold p-1 rounded-full"
      >
        &times;
      </button>
      <div className="p-8 text-center">
        <h2 className="text-3xl font-bold mb-4 text-[#008CFF]">Información para {game.gameName}</h2>
        <div className="aspect-video w-full mb-6 bg-[#282A31] rounded-md overflow-hidden flex items-center justify-center text-[#B0B0B0]">
          {/* Video frame is kept empty, can be used for embedded content later */}
        </div>
        <p className="text-lg text-[#B0B0B0] mb-6">
          Para poder disfrutar de tus juegos en la nube, es necesario que descargues e instales Moonlight.
        </p>
        <Link
          href="https://github.com/moonlight-stream/moonlight-qt/releases/download/v6.1.0/MoonlightSetup-6.1.0.exe"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#008CFF] text-white py-3 px-6 rounded-md hover:bg-[#00A0FF] font-semibold text-xl transition-colors duration-200"
        >
          Descargar Moonlight
        </Link>
        <p className="text-sm text-[#777] mt-4">
          Una vez que hayas instalado Moonlight, vuelve a esta página para lanzar tu juego.
        </p>
      </div>
    </div>
  </div>
);

export default function BibliotecaPage() {
  const { user, isLoaded, isSignedIn } = useUser(); // Get user status

  const [activeTab, setActiveTab] = useState<'myGames' | 'requestGame'>('myGames');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [requestMessage, setRequestMessage] = useState<string | null>(null);
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [userGames, setUserGames] = useState<UserGame[]>([]);
  const [loadingUserGames, setLoadingUserGames] = useState<boolean>(true);
  const [userGamesError, setUserGamesError] = useState<string | null>(null);

  const [selectedGameForTutorial, setSelectedGameForTutorial] = useState<UserGame | null>(null);

  const [toast, setToast] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchUserGames = async () => {
      if (!isLoaded || !isSignedIn || !user || !user.id) {
        setUserGames([]);
        setLoadingUserGames(false);
        return;
      }

      setLoadingUserGames(true);
      setUserGamesError(null);

      try {
        const response = await fetch(`/api/user-games/get?clerkId=${user.id}`);

        if (!response.ok) {
          const errorData = await response.json();
          setUserGamesError(errorData.error || 'Error desconocido al cargar los juegos.');
          setUserGames([]);
          console.error('Error fetching user games:', errorData);
          return;
        }

        const data = await response.json();
        const gamesFromFirebase: UserGame[] = data.data;

        const mergedGames = gamesFromFirebase.map(ug => {
          const originalGame = games.find(g => String(g.id) === String(ug.gameId));
          return {
            ...ug,
            logoUrl: originalGame?.logoUrl || '/path/to/default-logo.png',
            platform: originalGame?.platform || 'Desconocido',
            status: originalGame?.status || 'Desconocido',
          };
        });

        setUserGames(mergedGames);
      } catch (error) {
        setUserGamesError('Error de conexión al cargar tus juegos.');
        console.error('Network error fetching user games:', error);
        setUserGames([]);
      } finally {
        setLoadingUserGames(false);
      }
    };

    // Only fetch if user is signed in
    if (isSignedIn) {
      fetchUserGames();
    }
  }, [user, isLoaded, isSignedIn]);


  const handleCloseTutorialModal = () => {
    setSelectedGameForTutorial(null);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setLoadingSearch(true);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      if (value.length > 2) {
        try {
          const response = await fetch(`/api/games/search?query=${encodeURIComponent(value)}`);

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching from local API:', errorData.error);
            setSearchResults([]);
            setLoadingSearch(false);
            return;
          }

          const data: Game[] = await response.json();
          setSearchResults(data);
        } catch (error) {
          console.error('Error during client-side fetch to local API:', error);
          setSearchResults([]);
        } finally {
          setLoadingSearch(false);
        }
      } else {
        setSearchResults([]);
        setLoadingSearch(false);
      }
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const handleGameSelection = async (gameName: string) => {
    setSearchTerm(gameName);
    setSearchResults([]);

    const requesterUsername = user?.username || user?.firstName || 'Usuario Desconocido';

    try {
      const response = await fetch('/api/request-game-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameName, requestedByUsername: requesterUsername }),
      });

      if (response.ok) {
        setRequestMessage(`"${gameName}" ha sido solicitado. Se le notificará al administrador para que pronto esté el juego.`);
      } else {
        const errorData = await response.json();
        setRequestMessage(`Error al solicitar "${gameName}": ${errorData.message || 'Error desconocido'}`);
        console.error('Error al enviar solicitud de juego por email:', errorData);
      }
    } catch (error) {
      setRequestMessage(`Error de conexión al solicitar "${gameName}".`);
      console.error('Network error requesting game:', error);
    } finally {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
      messageTimeoutRef.current = setTimeout(() => {
        setRequestMessage(null);
      }, 5000);
    }
  };

  const handleLanzar = async (game: UserGame) => {
    setSelectedGameForTutorial(game); // Open tutorial modal (now download prompt)
    setToast(`Mostrando información para: ${game.gameName}`);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToast(null), 4000);
  };

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
          Debes iniciar sesión o registrarte para acceder a tu biblioteca personal.
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
      {toast && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white py-2 px-6 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}

      <h1 className="text-4xl font-bold mb-8 text-[#008CFF]">Mi Biblioteca</h1>

      <div className="flex justify-center mb-8 bg-[#282A31] rounded-xl p-2 gap-2 max-w-lg w-full">
        <button
          onClick={() => setActiveTab('myGames')}
          className={`flex-1 text-center py-3 rounded-lg font-semibold transition-all duration-300
            ${activeTab === 'myGames' ? 'bg-[#008CFF] text-white shadow-md' : 'text-[#B0B0B0] hover:text-white hover:bg-[#3A3D44]'}`}
        >
          My Games
        </button>
        <button
          onClick={() => setActiveTab('requestGame')}
          className={`flex-1 text-center py-3 rounded-lg font-semibold transition-all duration-300
            ${activeTab === 'requestGame' ? 'bg-[#008CFF] text-white shadow-md' : 'text-[#B0B0B0] hover:text-white hover:bg-[#3A3D44]'}`}
        >
          Pedir Juego
        </button>
      </div>

      <div className="w-full max-w-6xl">
        {activeTab === 'myGames' && (
          <div className="bg-[#282A31] rounded-md border border-[#3A3D44] shadow-lg p-8 text-center min-h-[400px] flex flex-col justify-center items-center">
            {loadingUserGames && <p className="text-xl text-[#00ADB5]">Cargando tus juegos...</p>}
            {userGamesError && <p className="text-xl text-red-500">Error: {userGamesError}</p>}

            {!loadingUserGames && !userGamesError && (
              userGames.length > 0 ? (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {userGames.map((game) => (
                    <div key={game.id} className="bg-[#1A1A1D] rounded-md border border-[#3A3D44] shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                      <div className="relative w-full aspect-video overflow-hidden">
                        <Image
                          src={game.logoUrl || '/path/to/default-logo.png'}
                          alt={game.gameName}
                          fill
                          style={{ objectFit: 'cover' }}
                          className="rounded-t-md"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                        />
                        {game.status !== 'Disponible' && (
                           <span className="absolute top-2 right-2 bg-yellow-600 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
                             No Disponible
                           </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h2 className="text-xl font-semibold mb-2 text-[#00ADB5]">{game.gameName}</h2>
                        <p className="text-sm text-[#B0B0B0] mb-3">{game.platform}</p>
                        <p className="text-xs text-[#777]">Añadido: {new Date(game.addedAt._seconds * 1000).toLocaleDateString()}</p>
                        <button
                          onClick={() => handleLanzar(game)}
                          className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 font-semibold transition"
                        >
                          Lanzar Juego
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-xl text-[#00ADB5] mb-4">{`¡Tu biblioteca está esperando juegos!`}</p>
                  <p className="text-[#B0B0B0]">
                    Añade tus favoritos desde la <Link href="/lista-juegos" className="text-[#008CFF] hover:underline">Lista de Juegos</Link> para empezar a construir tu colección.
                  </p>
                </div>
              )
            )}
          </div>
        )}

        {activeTab === 'requestGame' && (
          <div className="bg-[#282A31] rounded-md border border-[#3A3D44] shadow-lg p-8 min-h-[400px]">
            <h2 className="text-2xl font-bold mb-6 text-[#00ADB5] text-center">Busca un Juego para Pedir</h2>

            <div className="relative max-w-lg mx-auto mb-6">
              <input
                type="text"
                placeholder="Escribe el nombre del juego..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-3 rounded-md bg-[#3F4147] border border-[#4F555F] text-[#E0E0E0] placeholder-[#B0B0B0] focus:outline-none focus:border-[#008CFF]"
              />
              {loadingSearch && searchTerm.length > 2 && (
                <div className="absolute z-20 top-full left-0 w-full p-2 text-center text-[#008CFF] font-semibold">Cargando...</div>
              )}

              {!loadingSearch && searchTerm.length > 2 && searchResults.length > 0 && (
                <div className="absolute z-10 w-full bg-[#282A31] border border-[#3A3D44] rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map(game => (
                    <div key={game.id} className="flex items-center p-3 hover:bg-[#3A3D44] cursor-pointer"
                      onClick={() => handleGameSelection(game.name)}
                    >
                      {game.logoUrl && (
                        <Image src={game.logoUrl} alt={game.name} width={50} height={30} className="rounded mr-3 object-cover" />
                      )}
                      <span className="text-[#E0E0E0]">{game.name}</span>
                    </div>
                  ))}
                </div>
              )}
              {!loadingSearch && searchTerm.length > 2 && searchResults.length === 0 && (
                <div className="absolute z-10 w-full bg-[#282A31] border border-[#3A3D44] rounded-md mt-1 shadow-lg p-3 text-[#B0B0B0] text-center">
                  No se encontraron resultados para "{searchTerm}".
                </div>
              )}
            </div>

            {requestMessage && (
              <div className="mt-6 p-4 bg-green-700 bg-opacity-30 text-green-200 rounded-md border border-green-600 text-center max-w-lg mx-auto animate-fade-in-down">
                {requestMessage}
              </div>
            )}

            <div className="text-center mt-4">
              <p className="text-[#B0B0B0] mb-4">Selecciona un juego de la lista para pedirlo.</p>
            </div>
          </div>
        )}
      </div>

      {selectedGameForTutorial && (
        <TutorialModal game={selectedGameForTutorial} onClose={handleCloseTutorialModal} />
      )}
    </div>
  );
}
