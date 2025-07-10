'use client';

import React, { useState } from 'react';

export default function SunshineConnect() {
  const [ip, setIp] = useState('');
  const [port, setPort] = useState('');
  const [status, setStatus] = useState('Desconectado');
  const [error, setError] = useState<string | null>(null);

  const handleConnect = () => {
    if (!ip || !port) {
      setError('Por favor, ingresa IP y puerto válidos.');
      return;
    }
    setError(null);
    setStatus(`Intentando conectar a Sunshine en ${ip}:${port}...`);

    // Aquí pondrías la lógica real para conectar con Sunshine
    // Por ejemplo, una llamada API, websocket o librería

    setTimeout(() => {
      setStatus('Conectado (simulado)');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#1A1A1D] text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl mb-8 text-[#008CFF] font-bold">Conexión Sunshine Streaming</h1>
      
      <div className="w-full max-w-md bg-[#282A31] p-6 rounded-lg shadow-lg">
        <label className="block mb-2 font-semibold text-[#00ADB5]">IP Pública / Local</label>
        <input
          type="text"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="Ej: 209.91.235.179"
          className="w-full mb-4 p-2 rounded bg-[#3A3D44] text-white focus:outline-none"
        />

        <label className="block mb-2 font-semibold text-[#00ADB5]">Puerto</label>
        <input
          type="text"
          value={port}
          onChange={(e) => setPort(e.target.value)}
          placeholder="Ej: 47989"
          className="w-full mb-6 p-2 rounded bg-[#3A3D44] text-white focus:outline-none"
        />

        <button
          onClick={handleConnect}
          className="w-full bg-[#008CFF] hover:bg-[#00A0FF] py-2 rounded font-semibold transition"
        >
          Conectar
        </button>

        {error && <p className="mt-4 text-red-500">{error}</p>}
        <p className="mt-4 text-[#00ADB5] font-semibold">{status}</p>
      </div>
    </div>
  );
}
