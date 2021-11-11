import { initializeApp } from "firebase/app";

import { getDatabase } from "firebase/database";
import { getAuth } from "@firebase/auth";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY.toString(),
  authDomain: process.env.FIREBASE_AUTH_DOMAIN.toString(),
  databaseURL: process.env.FIREBASE_DATABASE_URL.toString(),
  projectId: process.env.FIREBASE_PROJECT_ID.toString(),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET.toString(),
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID.toString(),
  appId: process.env.FIREBASE_APP_ID.toString(),
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase();
export const auth = getAuth();
