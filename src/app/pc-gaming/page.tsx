// src/app/pc-gaming/page.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic'; // <-- ¡Añade esta importación!

// --- ¡IMPORTANTE! Modifica cómo importas RFB ---
// Ya no importamos RFB directamente al principio del archivo.
// Lo importaremos dinámicamente dentro del componente.

export default function PcGamingPage() {
  const rfbRef = useRef<any | null>(null); // Cambiamos a 'any' temporalmente para evitar errores de tipo si RFB no está definido aún
  const vncCanvasRef = useRef<HTMLDivElement>(null);
  const [vmStatus, setVmStatus] = useState<'off' | 'starting' | 'running' | 'error'>('off');

  // --- Configuración para la conexión noVNC a través de websockify/Ngrok ---
  // ¡USA LA URL EXACTA QUE TE DIO NGROK, CAMBIANDO 'tcp://' a 'wss://'!
  // Por ejemplo, si Ngrok te dio tcp://4.tcp.ngrok.io:17565, aquí sería:
  const VNC_WEBSOCKET_URL = 'wss://4.tcp.ngrok.io:17565'; // <--- ¡REEMPLAZA CON TU URL NGROK REAL!
  // -----------------------------------------------------------------

  // Creamos un componente dinámico para RFB que solo se cargará en el cliente
  const DynamicRFB = dynamic(async () => {
    // Importa RFB SOLO cuando sea necesario y en el lado del cliente
    const { default: RFB } = await import('@novnc/novnc/lib/rfb');
    return RFB;
  }, { ssr: false }); // <-- ¡Esto es CRUCIAL! No lo renderices en el servidor

  // Ahora, dentro de tu función startVmAndStream, usa 'DynamicRFB' en lugar de 'RFB'
  const startVmAndStream = async () => {
    setVmStatus('starting');
    console.log('Attempting to connect to VNC via:', VNC_WEBSOCKET_URL);

    if (!vncCanvasRef.current) {
      console.error('VNC canvas ref is not available.');
      setVmStatus('error');
      return;
    }

    try {
      // Clean up existing RFB instance if any
      if (rfbRef.current) {
        rfbRef.current.disconnect();
        rfbRef.current = null;
      }

      // Asegúrate de que DynamicRFB se ha cargado
      if (typeof DynamicRFB === 'function') { // Verificar que es el componente/función cargado
        // Instancia RFB utilizando el componente dinámico cargado
        const rfb = new DynamicRFB(vncCanvasRef.current, VNC_WEBSOCKET_URL, {
          wsProtocols: ['binary', 'base64'],
          shared: true,
          credentials: { password: '' }
        });

        rfb.addEventListener('connect', () => {
          console.log('VNC Connected!');
          setVmStatus('running');
        });

        rfb.addEventListener('disconnect', (e) => {
          console.log('VNC Disconnected:', e.detail.clean ? 'Clean' : 'Dirty');
          setVmStatus('off');
        });

        rfb.addEventListener('securityfailure', () => {
          console.error('VNC Security Failure!');
          setVmStatus('error');
        });

        rfb.addEventListener('desktopname', (e) => {
          console.log('VNC Desktop Name:', e.detail.name);
        });

        rfbRef.current = rfb;
      } else {
        console.error("DynamicRFB did not load correctly. It's not a function.");
        setVmStatus('error');
      }

    } catch (error) {
      console.error('Error connecting to VNC:', error);
      setVmStatus('error');
    }
  };

  // ... (el resto de tu componente, como stopVmStream y el JSX del return)
  const stopVmStream = () => {
    if (rfbRef.current) {
      rfbRef.current.disconnect();
      rfbRef.current = null;
      setVmStatus('off');
      console.log('VNC stream stopped.');
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-8">StreamVerse</h1>

      <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg overflow-hidden p-4">
        {/* Aquí es donde noVNC renderizará la pantalla de la VM */}
        <div ref={vncCanvasRef} className="w-full bg-black flex items-center justify-center" style={{ aspectRatio: '16/9', minHeight: '400px', border: '2px solid #333' }}>
          {vmStatus === 'off' && <p className="text-gray-400">Presiona "Start PC" para iniciar el stream.</p>}
          {vmStatus === 'starting' && <p className="text-blue-400">Iniciando conexión...</p>}
          {vmStatus === 'error' && <p className="text-red-500">Error al conectar. Verifica la VM y la configuración.</p>}
          {/* Cuando está 'running', noVNC toma el control del div */}
        </div>

        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={startVmAndStream}
            disabled={vmStatus === 'starting' || vmStatus === 'running'}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start PC
          </button>
          <button
            onClick={stopVmStream}
            disabled={vmStatus === 'off' || vmStatus === 'starting'}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Stop PC
          </button>
        </div>
        <p className="mt-4 text-sm text-gray-400 text-center">Current Status: {vmStatus}</p>
      </div>

      {/* Navegación básica - puedes expandir esto */}
      <nav className="mt-8">
        <ul className="flex space-x-6">
          <li><a href="/" className="text-gray-300 hover:text-white">Home</a></li>
          <li><a href="/lista-de-juegos" className="text-gray-300 hover:text-white">Lista de Juegos</a></li>
          <li><a href="/biblioteca" className="text-gray-300 hover:text-white">Biblioteca</a></li>
          <li><a href="/tienda" className="text-gray-300 hover:text-white">Tienda</a></li>
        </ul>
      </nav>
    </div>
  );
}
