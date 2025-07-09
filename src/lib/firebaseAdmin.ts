// src/lib/firebaseAdmin.ts
import * as admin from 'firebase-admin';
import path from 'path';

const serviceAccountFileName = 'playstreamverse-firebase-adminsdk-fbsvc-c6c31c9a33.json';
const serviceAccountPath = path.resolve(process.cwd(), 'credentials', serviceAccountFileName);

// Asegurarse de que la aplicación de Firebase Admin se inicialice solo una vez.
// Next.js a veces puede ejecutar este módulo varias veces en desarrollo.
// Buscamos si ya existe una aplicación con el nombre por defecto.
let app: admin.app.App;

try {
  // Intenta obtener la aplicación por defecto si ya ha sido inicializada
  app = admin.app();
} catch (error: any) {
  // Si no hay una aplicación por defecto (error 'app/no-app'), la inicializamos
  if (error.code === 'app/no-app' || !admin.apps.length) { // Doble chequeo para mayor robustez
    try {
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
      });
    } catch (initError: any) {
      console.error('Error final al inicializar Firebase Admin SDK:', initError.stack);
      throw initError; // Re-lanza si la inicialización falló de nuevo
    }
  } else {
    // Si es otro tipo de error al intentar obtener la app, también lo reportamos
    console.error('Error inesperado al intentar obtener la app de Firebase:', error.stack);
    throw error;
  }
}

// Ahora que sabemos que 'app' está inicializada, podemos obtener el Firestore DB
const db = admin.firestore();

export { db };
