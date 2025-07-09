// src/app/layout.tsx
'use client'; // <-- AÑADE ESTA LÍNEA

import type { Metadata } from 'next'; // Mantén este tipo, aunque use client
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Header from '@/components/Header';
import { usePathname } from 'next/navigation'; // <-- AÑADE ESTA LÍNEA

// Importa Font Awesome CSS
import '@fortawesome/fontawesome-free/css/all.min.css';

const inter = Inter({ subsets: ['latin'] });

// metadata no se puede exportar desde un Client Component si está en el archivo principal de layout.tsx
// Si necesitas metadata para todas las páginas, la dejaríamos en un archivo metadata.ts separado,
// o simplemente la quitamos si no es crítica y para simplificar.
// Por ahora, para resolver el "use client" y metadata, la quitamos temporalmente
// Opcional: si la metadata es importante, podríamos envolver todo en un Server Component y poner el ClerkProvider
// y el resto de la app en un Client Component. Pero para simplicidad, la quitamos aquí.
// Si no tienes errores, puedes dejarla. Si da errores por el 'use client', quítala.
/*
export const metadata: Metadata = {
  title: 'Play StreamVerse Gaming',
  description: 'Your ultimate gaming hub',
};
*/

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Obtiene la ruta actual

  // Define las rutas donde el header NO debe aparecer
  const noHeaderRoutes = ['/sign-in', '/sign-up'];
  const showHeader = !noHeaderRoutes.includes(pathname);

  return (
    <ClerkProvider>
      <html lang="es">
        <body className={inter.className}>
          {showHeader && <Header />} {/* <-- Renderiza el Header CONDICIONALMENTE */}
          <div className={showHeader ? "pt-20" : ""}> {/* Añade padding solo si hay header */}
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}