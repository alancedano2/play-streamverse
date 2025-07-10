// src/pages/api/proxy-lanzar.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // URL de tu backend Flask (ngrok)
    const backendUrl = 'https://82aa21c82b66.ngrok-free.app/api/lanzar';

    // Forward del body y headers
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Si necesitas enviar token u otra cosa, lo agregas aquí
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    // Pasar la respuesta del backend al cliente
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error proxy:', error);
    res.status(500).json({ error: 'Error al conectar con backend' });
  }
}
