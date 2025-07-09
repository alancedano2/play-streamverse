// src/components/Header.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useUser, UserButton } from '@clerk/nextjs';

export default function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full p-4 bg-[#1A1A1D]">
      <div className="max-w-7xl mx-auto bg-[#1C1E20] rounded-xl shadow-lg py-4 px-6 sm:px-8 flex items-center justify-between">
        {/* Sección Izquierda: Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Play StreamVerse Logo"
              width={170}
              height={50}
              className="cursor-pointer"
            />
          </Link>
        </div>

        {/* Sección Central: Navegación */}
        <nav className="hidden md:flex space-x-6 text-[#B0B0B0] text-lg font-medium">
          <Link href="/" className="hover:text-[#008CFF] transition-colors"> {/* Home */}
            <span className="flex items-center space-x-1"><i className="fas fa-home"></i> <span>Home</span></span>
          </Link>
          <Link href="/lista-juegos" className="hover:text-[#008CFF] transition-colors"> {/* Lista de Juegos */}
            <span className="flex items-center space-x-1"><i className="fas fa-list"></i> <span>Lista de Juegos</span></span>
          </Link>
          <Link href="/biblioteca" className="hover:text-[#008CFF] transition-colors"> {/* Biblioteca */}
            <span className="flex items-center space-x-1"><i className="fas fa-book"></i> <span>Biblioteca</span></span>
          </Link>
          <Link href="/tienda" className="hover:text-[#008CFF] transition-colors"> {/* Tienda */}
            <span className="flex items-center space-x-1"><i className="fas fa-store"></i> <span>Tienda</span></span>
          </Link>
        </nav>

        {/* Sección Derecha: Iconos y Botón de Usuario */}
        <div className="flex items-center space-x-4">
          <button className="text-[#B0B0B0] hover:text-[#008CFF] transition-colors text-xl">
            <i className="fas fa-search"></i>
          </button>
          {isSignedIn && (
            <UserButton afterSignOutUrl="/sign-in" />
          )}
        </div>
      </div>
    </header>
  );
}
