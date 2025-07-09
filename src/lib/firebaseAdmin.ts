import { admin } from '@/lib/firebaseAdmin';

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export { admin };
