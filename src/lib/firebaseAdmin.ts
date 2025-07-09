import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

// Exporta solo lo que realmente usas. Si necesitas `app`, úsalo o ignóralo.
export const auth = admin.auth();
export const firestore = admin.firestore();
