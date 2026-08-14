import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Handle escaped newlines in the private key string
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

let db: admin.firestore.Firestore;
let auth: admin.auth.Auth;
let storage: admin.storage.Storage;

try {
  db = admin.firestore();
  auth = admin.auth();
  storage = admin.storage();
} catch (error) {
  // Graceful fallback for Next.js build time when env vars are missing
  db = {} as admin.firestore.Firestore;
  auth = {} as admin.auth.Auth;
  storage = {} as admin.storage.Storage;
}

export const adminDb = db;
export const adminAuth = auth;
export const adminStorage = storage;
