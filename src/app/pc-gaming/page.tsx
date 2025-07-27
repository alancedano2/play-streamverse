// src/app/pc-gaming/page.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';

// ¡IMPORTANTE! Hemos eliminado:
// import dynamic from 'next/dynamic';
// Y cualquier importación directa de RFB

// Asegúrate de que RFB esté disponible globalmente (declaración de tipo para TypeScript)
declare global {
  interface Window {
    RFB: any; // o el tipo RFB si tienes una definición de tipos para noVNC global
  }
}

export default function PcGamingPage() {
  const rfbRef = useRef<any | null>(null);
  const vncCanvasRef = useRef<HTMLDivElement>(null);
  const [vmStatus, setVmStatus] = useState<'off' | 'starting' | 'running' | 'error'>('off');

  const VNC_WEBSOCKET_URL = 'wss://4.tcp.ngrok.io:17565'; // <--- ¡REEMPLAZA CON TU URL NGROK REAL!

  // Nuevo useEffect para cargar el script de noVNC
  useEffect(() => {
    // Solo carga si noVNC no está ya disponible
    if (typeof window.RFB === 'undefined') {
      const script = document.createElement('script');
      // Ajusta la ruta a donde pusiste rfb.js en tu carpeta public/
      // Ejemplo: si lo pusiste en public/novnc-static/rfb.js
      script.src = '/novnc-static/rfb.js';
      script.type = 'module'; // <----------------- ¡ESTA ES LA LÍNEA NUEVA!
      script.onload = () => {
        console.log('noVNC script loaded successfully.');
        // Opcional: Ahora que RFB está en window, puedes ejecutar una acción
      };
      script.onerror = (error) => {
        console.error('Failed to load noVNC script:', error);
        setVmStatus('error');
      };
      document.body.appendChild(script);
    }

    // Limpieza al desmontar el componente
    return () => {
      if (rfbRef.current) {
        rfbRef.current.disconnect();
        rfbRef.current = null;
      }
      // Opcional: Si quieres, puedes remover el script también, aunque no siempre es necesario
      // const script = document.querySelector('script[src="/novnc-static/rfb.js"]');
      // if (script) script.remove();
    };
  }, []); // El array vacío asegura que se ejecuta una sola vez al montar

  const startVmAndStream = async () => {
    setVmStatus('starting');
    console.log('Attempting to connect to VNC via:', VNC_WEBSOCKET_URL);

    if (!vncCanvasRef.current) {
      console.error('VNC canvas ref is not available.');
      setVmStatus('error');
      return;
    }

    // Asegúrate de que RFB esté disponible en el objeto global window
    if (typeof window.RFB === 'undefined') {
      console.error('noVNC script not loaded yet. Please wait or check script path.');
      setVmStatus('error');
      return;
    }

    try {
      if (rfbRef.current) {
        rfbRef.current.disconnect();
        rfbRef.current = null;
      }

      // Ahora accedemos a RFB desde window
      const rfb = new window.RFB(vncCanvasRef.current, VNC_WEBSOCKET_URL, {
        wsProtocols: ['binary', 'base64'],
        shared: true,
        credentials: { password: '' }
      });

      rfb.addEventListener('connect', () => {
        console.log('VNC Connected!');
        setVmStatus('running');
      });

      rfb.addEventListener('disconnect', (e: { detail: { clean: boolean; message?: string } }) => {
        console.log('VNC Disconnected:', e.detail.clean ? 'Clean' : 'Dirty');
        setVmStatus('off');
      });

      rfb.addEventListener('securityfailure', () => {
        console.error('VNC Security Failure!');
        setVmStatus('error');
      });

      rfb.addEventListener('desktopname', (e: { detail: { name: string } }) => {
        console.log('VNC Desktop Name:', e.detail.name);
      });

      rfbRef.current = rfb;

    } catch (error) {
      console.error('Error connecting to VNC:', error);
      setVmStatus('error');
    }
  };

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
        <div ref={vncCanvasRef} className="w-full bg-black flex items-center justify-center" style={{ aspectRatio: '16/9', minHeight: '400px', border: '2px solid #333' }}>
          {vmStatus === 'off' && <p className="text-gray-400">Presiona "Start PC" para iniciar el stream.</p>}
          {vmStatus === 'starting' && <p className="text-blue-400">Iniciando conexión...</p>}
          {vmStatus === 'error' && <p className="text-red-500">Error al conectar. Verifica la VM y la configuración.</p>}
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
