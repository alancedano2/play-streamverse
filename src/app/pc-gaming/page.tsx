// src/app/pc-gaming/page.tsx
'use client'; // ¡Importante para que funcione como Client Component en Next.js!

import React, { useEffect, useRef, useState } from 'react';
// Asegúrate de que noVNC esté instalado y su ruta sea correcta.
// Si lo instalaste con npm/yarn, podría ser algo como 'novnc/lib/rfb'
// O si lo copiaste a tu carpeta public, la ruta dependerá de dónde esté.
// Por ejemplo, si está en public/novnc/core/rfb.js, entonces importarías así:
// import RFB from '../../public/novnc/core/rfb.js'; // Ajusta la ruta según tu proyecto
import RFB from '@novnc/novnc/lib/rfb'; // Ejemplo si lo tienes como paquete npm/yarn

export default function PcGamingPage() {
  const rfbRef = useRef<RFB | null>(null);
  const vncCanvasRef = useRef<HTMLDivElement>(null);
  const [vmStatus, setVmStatus] = useState<'off' | 'starting' | 'running' | 'error'>('off');

  // --- Configuración para la conexión noVNC a través de websockify/Ngrok ---
  // ¡USA LA URL EXACTA QUE TE DIO NGROK, CAMBIANDO 'tcp://' a 'wss://'!
  // Por ejemplo, si Ngrok te dio tcp://4.tcp.ngrok.io:17565, aquí sería:
  const VNC_WEBSOCKET_URL = 'wss://4.tcp.ngrok.io:17565'; // <--- ¡REEMPLAZA CON TU URL NGROK REAL!
  // -----------------------------------------------------------------

  // --- VNC Configuration (estos son puertos estándar de Proxmox) ---
  // VNC port for your Proxmox VM. You might need to adjust this.
  // This is the port that websockify proxies FROM your VM's internal VNC.
  // If your VM's VNC is on 5900, websockify connects to 127.0.0.1:5900 by default.
  // The websockify server itself is listening on 6080.
  // const VNC_PORT = '6080'; // Esto se manejaría implícitamente en la URL de Ngrok
  // const VNC_HOST = 'tu_ip_publica_o_dominio_de_router'; // Esto se reemplaza por Ngrok
  // const VNC_PATH = ''; // noVNC default, usually empty for direct websockify
  // -----------------------------------------------------------------


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

      const rfb = new RFB(vncCanvasRef.current, VNC_WEBSOCKET_URL, {
        wsProtocols: ['binary', 'base64'], // Protocolos recomendados para noVNC
        shared: true, // Permite múltiples conexiones
        credentials: { password: '66116611' } // Si tu VNC no tiene contraseña, déjalo vacío. Sino, pon la de tu VM.
      });

      rfb.addEventListener('connect', () => {
        console.log('VNC Connected!');
        setVmStatus('running');
      });

      rfb.addEventListener('disconnect', (e) => {
        console.log('VNC Disconnected:', e.detail.clean ? 'Clean' : 'Dirty');
        setVmStatus('off');
        // Opcional: Intentar reconectar o mostrar un mensaje al usuario
        if (!e.detail.clean) {
          console.error('VNC connection was not clean. Attempting to reconnect...');
          // setTimeout(startVmAndStream, 5000); // Reintentar después de 5 segundos
        }
      });

      rfb.addEventListener('securityfailure', () => {
        console.error('VNC Security Failure!');
        setVmStatus('error');
      });

      rfb.addEventListener('desktopname', (e) => {
        console.log('VNC Desktop Name:', e.detail.name);
      });

      rfbRef.current = rfb;

    } catch (error) {
      console.error('Error connecting to VNC:', error);
      setVmStatus('error');
    }
  };

  // Función para manejar la detención o desconexión (opcional)
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
