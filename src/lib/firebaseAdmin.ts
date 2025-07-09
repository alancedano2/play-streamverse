import * as admin from 'firebase-admin';
import path from 'path';

// Define las variables de entorno necesarias para Vercel
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY;
const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL;

// Ruta al archivo de la cuenta de servicio para desarrollo local
const serviceAccountFileName = 'playstreamverse-firebase-adminsdk-fbsvc-c6c31c9a33.json'; // Tu nombre de archivo exacto
const serviceAccountPath = path.resolve(process.cwd(), 'credentials', serviceAccountFileName);

let app: admin.app.App;

try {
  app = admin.app(); // Intenta obtener la app por defecto si ya está inicializada
} catch (error: any) {
  if (error.code === 'app/no-app' || !admin.apps.length) {
    // Si no hay una app inicializada, la inicializamos
    try {
      if (process.env.NODE_ENV === 'production' && FIREBASE_PROJECT_ID && FIREBASE_PRIVATE_KEY && FIREBASE_CLIENT_EMAIL) {
        // En producción (Vercel), usa variables de entorno
        // Reemplaza '\\n' por '\n' porque Vercel puede escapar los saltos de línea
        const privateKey = FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
        app = admin.initializeApp({
          credential: admin.credential.cert({
            projectId: FIREBASE_PROJECT_ID,
            privateKey: privateKey,
            clientEmail: FIREBASE_CLIENT_EMAIL,
          }),
        });
      } else {
        // En desarrollo local, usa el archivo JSON
        app = admin.initializeApp({
          credential: admin.credential.cert(serviceAccountPath),
        });
      }
      app = admin.app(); // Aseguramos que 'app' se asigne después de la inicialización exitosa
    } catch (initError: any) {
      console.error('Error al inicializar Firebase Admin SDK:', initError.stack);
      throw initError; // Re-lanza si la inicialización falló
    }
  } else {
    // Otros errores inesperados al intentar obtener la app
    console.error('Error inesperado al intentar obtener la app de Firebase:', error.stack);
    throw error;
  }
}

const db = admin.firestore();

export { db };
