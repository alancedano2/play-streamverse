// src/lib/firebaseAdmin.ts
import * as admin from 'firebase-admin';
import path from 'path';

const serviceAccountFileName = 'playstreamverse-firebase-adminsdk-fbsvc-c6c31c9a33.json';
const serviceAccountPath = path.resolve(process.cwd(), 'credentials', serviceAccountFileName);

let app: admin.app.App; // Declara la variable para la aplicación de Firebase Admin, pero no es necesario exportarla

try {
  app = admin.app();
} catch (error: any) { // Tipar 'error' como 'any' aquí
  if (error.code === 'app/no-app' || !admin.apps.length) {
    try {
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
      });
    } catch (initError: any) { // Tipar 'initError' como 'any' aquí
      console.error('Error final al inicializar Firebase Admin SDK:', initError.stack);
      throw initError;
    }
  } else {
    console.error('Error inesperado al intentar obtener la app de Firebase:', error.stack);
    throw error;
  }
}

const db = admin.firestore();

export { db }; // Solo exportamos 'db', no 'app' si no se usa fuera
