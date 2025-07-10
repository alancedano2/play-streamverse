// src/lib/firebaseAdmin.ts (Versión FINAL y ROBUSTA para Vercel)
import * as admin from 'firebase-admin';
import path from 'path';

// Para Vercel (producción)
const FIREBASE_SERVICE_ACCOUNT_BASE64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

// Para desarrollo local
const serviceAccountFileName = 'mi-clave-ultra-nueva.json'; // <--- ¡Asegúrate de que este es el nombre que usas localmente!
const serviceAccountPath = path.resolve(process.cwd(), 'credentials', serviceAccountFileName);

let app: admin.app.App;

try {
  app = admin.app();
} catch (error: any) {
  if (error.code === 'app/no-app' || !admin.apps.length) {
    try {
      if (process.env.NODE_ENV === 'production' && FIREBASE_SERVICE_ACCOUNT_BASE64) {
        // En producción (Vercel), decodifica el JSON de la variable Base64
        const decodedServiceAccount = Buffer.from(FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8');
        const serviceAccountJson = JSON.parse(decodedServiceAccount);
        app = admin.initializeApp({
          credential: admin.credential.cert(serviceAccountJson), // Pasa el objeto JSON decodificado
        });
      } else {
        // En desarrollo local, usa el archivo JSON
        app = admin.initializeApp({
          credential: admin.credential.cert(serviceAccountPath),
        });
      }
      app = admin.app();
    } catch (initError: any) {
      console.error('Error al inicializar Firebase Admin SDK:', initError.stack);
      throw initError;
    }
  } else {
    console.error('Error inesperado al intentar obtener la app de Firebase:', error.stack);
    throw error;
  }
}

const db = admin.firestore();

export { db };
