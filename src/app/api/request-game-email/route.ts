// src/app/api/request-game-email/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Inicializa el cliente de Resend con tu clave API
const resend = new Resend(process.env.RESEND_API_KEY); // <-- Usa la clave de RESEND_API_KEY del .env.local

// LÍNEAS DE DIAGNÓSTICO: Esto aparecerá en tu terminal cuando el servidor inicie o cuando esta ruta sea accedida
console.log("--------------------------------------------------");
console.log("DEBUG: Iniciando API Route de Solicitud de Juego");
console.log("DEBUG: RESEND_API_KEY cargada:", process.env.RESEND_API_KEY ? "Cargada y presente" : "NO CARGADA o undefined");
console.log("DEBUG: ADMIN_EMAIL cargado:", process.env.ADMIN_EMAIL ? "Cargado y presente" : "NO CARGADO o undefined");
console.log("--------------------------------------------------");


export async function POST(request: Request) {
  console.log("DEBUG: Solicitud POST recibida para request-game-email."); // <-- Log al inicio de la función
  try {
    const { gameName, requestedByUsername } = await request.json();

    console.log(`DEBUG: Datos recibidos - Juego: ${gameName}, Solicitante: ${requestedByUsername}`); // <-- Log de los datos recibidos

    if (!gameName || !requestedByUsername) {
      console.log("DEBUG: Error 400 - Nombre de juego o solicitante faltante.");
      return NextResponse.json({ message: 'Game name and requester username are required.' }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.log("DEBUG: Error 500 - ADMIN_EMAIL no configurado.");
      return NextResponse.json({ message: 'Admin email not configured.' }, { status: 500 });
    }

    // Asegúrate de que el 'from' sea una dirección verificada en Resend (onboarding@resend.dev es la más fácil para empezar)
    const emailData = {
      from: `StreamVerse Gaming <onboarding@resend.dev>`,
      to: 'fraelvillegasplay8@gmail.com',
      subject: `¡Nuevo Juego Solicitado en StreamVerse Gaming: ${gameName}!`,
      html: `
        <strong>¡Nuevo Juego Solicitado en StreamVerse Gaming!</strong>
        <p>El usuario <strong>${requestedByUsername}</strong> ha solicitado el juego: <strong>${gameName}</strong>.</p>
        <p>Por favor, considera añadirlo a la plataforma pronto.</p>
        <br/>
        <p>Atentamente,<br/>Equipo de StreamVerse Gaming</p>
      `,
    };

    console.log("DEBUG: Intentando enviar correo con datos:", emailData); // <-- Log de los datos del correo

    await resend.emails.send(emailData);

    console.log(`DEBUG: Correo de solicitud enviado (Resend) para: ${gameName} por ${requestedByUsername}`);
    return NextResponse.json({ message: 'Email sent successfully!' });

  } catch (error) {
    console.error('ERROR CATCHED: Error sending email with Resend:', error); // <-- Log de error más detallado
    // Verifica si el error es de tipo ResendError para obtener más detalles
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ResendError') {
      console.error('Resend specific error details:', JSON.stringify(error, null, 2));
    }
    return NextResponse.json({ message: 'Failed to send email.', error: (error as Error).message }, { status: 500 });
  }
}