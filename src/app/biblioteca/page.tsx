// src/app/biblioteca/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { games, Game } from '@/data/games'; // <-- ¡Modifica esta línea! // Asegúrate de que esta interfaz Game es compatible con los datos de Firebase
import { useUser } from '@clerk/nextjs';

// Define una interfaz para los juegos de la biblioteca del usuario, incluyendo campos de Firebase
interface UserGame extends Game {
  clerkId: string;
  username: string;
  addedAt: {
    _seconds: number;
    _nanoseconds: number;
  }; // Firebase Timestamp
  id: string; // El ID del documento de Firestore
  gameId: string; // ID del juego de la data/games o RAWG
  gameName: string; // Nombre del juego
  // Añade aquí cualquier otro campo que guardes en Firebase si es necesario
}

export default function BibliotecaPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [activeTab, setActiveTab] = useState<'myGames' | 'requestGame'>('myGames');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [requestMessage, setRequestMessage] = useState<string | null>(null);
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Nuevo estado para los juegos de la biblioteca del usuario
  const [userGames, setUserGames] = useState<UserGame[]>([]);
  const [loadingUserGames, setLoadingUserGames] = useState<boolean>(true);
  const [userGamesError, setUserGamesError] = useState<string | null>(null);

  // --- Lógica para Cargar Juegos del Usuario desde Firebase ---
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
        // Los datos de los juegos se guardaron con gameName y gameId.
        // La URL de la imagen (logoUrl) no se guarda en Firebase actualmente.
        // Necesitaremos fusionar los datos de los juegos guardados con la data original para tener la logoUrl.
        const gamesFromFirebase: UserGame[] = data.data;

        // Si tienes la data original de los juegos (en '@/data/games'), puedes fusionarlos
        // para obtener detalles como 'logoUrl', 'platform', etc.
        const mergedGames = gamesFromFirebase.map(ug => {
          // Busca el juego original en tu data/games
          const originalGame = games.find(g => String(g.id) === String(ug.gameId)); // Asegúrate de comparar como string
          return {
            ...ug,
            logoUrl: originalGame?.logoUrl || '/path/to/default-logo.png', // Fallback si no se encuentra la imagen
            platform: originalGame?.platform || 'Desconocido', // Fallback
            status: originalGame?.status || 'Desconocido', // Fallback
            // Otros campos del objeto Game original que necesites mostrar
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

    fetchUserGames();
  }, [user, isLoaded, isSignedIn]); // Re-ejecuta cuando el usuario o su estado de carga cambie

  // --- El resto de tus funciones existentes ---
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
    };
  }, []);

  const handleGameSelection = async (gameName: string) => {
    console.log("handleGameSelection called for:", gameName);

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

  // --- Renderizado del componente ---
  return (
    <div className="min-h-screen bg-[#1A1A1D] text-[#E0E0E0] p-8 pt-28 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-[#008CFF]">Mi Biblioteca</h1>

      {/* Contenedor de Pestañas */}
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

      {/* Contenido de las Pestañas */}
      <div className="w-full max-w-6xl">
        {activeTab === 'myGames' && (
          <div className="bg-[#282A31] rounded-md border border-[#3A3D44] shadow-lg p-8 text-center min-h-[400px] flex flex-col justify-center items-center">
            {loadingUserGames && <p className="text-xl text-[#00ADB5]">Cargando tus juegos...</p>}
            {userGamesError && <p className="text-xl text-red-500">Error: {userGamesError}</p>}

            {!loadingUserGames && !userGamesError && (
              userGames.length > 0 ? (
                // Si hay juegos, los mostramos en una cuadrícula
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {userGames.map((game) => (
                    <div key={game.id} className="bg-[#1A1A1D] rounded-md border border-[#3A3D44] shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                      <div className="relative w-full aspect-video overflow-hidden">
                        <Image
                          src={game.logoUrl || '/path/to/default-logo.png'} // Usar logoUrl de la data original o un fallback
                          alt={game.gameName}
                          fill
                          style={{ objectFit: 'cover' }}
                          className="rounded-t-md"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                        />
                        {/* Puedes añadir una "nota" si la recuperas o la añades a la data del usuario */}
                        {game.status !== 'Disponible' && ( // Ejemplo de cómo mostrar una advertencia de disponibilidad
                           <span className="absolute top-2 right-2 bg-yellow-600 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
                             No Disponible
                           </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h2 className="text-xl font-semibold mb-2 text-[#00ADB5]">{game.gameName}</h2>
                        <p className="text-sm text-[#B0B0B0] mb-3">{game.platform}</p> {/* Mostrar plataforma del juego original */}
                        <p className="text-xs text-[#777]">Añadido: {new Date(game.addedAt._seconds * 1000).toLocaleDateString()}</p>
                        {/* Aquí puedes añadir botones o enlaces para ver detalles, jugar, etc. */}
                        <button className="mt-4 w-full bg-[#008CFF] text-white py-2 px-4 rounded-md hover:bg-[#00A0FF] font-semibold transition">
                            Ver Detalles
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Mensaje si no hay juegos en la biblioteca
                <div className="text-center">
                  <p className="text-xl text-[#00ADB5] mb-4">¡Tu biblioteca está esperando juegos!</p>
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

            {/* Cuadro de búsqueda */}
            <div className="relative max-w-lg mx-auto mb-6">
              <input
                type="text"
                placeholder="Escribe el nombre del juego..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-3 rounded-md bg-[#3F4147] border border-[#4F555F] text-[#E0E0E0] placeholder-[#B0B0B0] focus:outline-none focus:border-[#008CFF]"
              />
              {/* Indicador de carga */}
              {loadingSearch && searchTerm.length > 2 && (
                <div className="absolute z-20 top-full left-0 w-full p-2 text-center text-[#008CFF] font-semibold">Cargando...</div>
              )}

              {/* Cuadro de sugerencias de búsqueda (aparece al escribir) */}
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
              {/* Mensaje si no hay resultados */}
              {!loadingSearch && searchTerm.length > 2 && searchResults.length === 0 && (
                <div className="absolute z-10 w-full bg-[#282A31] border border-[#3A3D44] rounded-md mt-1 shadow-lg p-3 text-[#B0B0B0] text-center">
                  No se encontraron resultados para "{searchTerm}".
                </div>
              )}
            </div>

            {/* Mensaje de notificación al usuario */}
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
    </div>
  );
}