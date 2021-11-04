import { initializeApp } from "firebase/app";

import { getDatabase, ref, set } from "firebase/database";
import { child, get } from "firebase/database";

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

const database = getDatabase();

function updateFoldersData(userId = "userId", data) {
  const db = database;
  set(ref(db, `${userId}`), {
    folders: data,
  });
}

async function getFoldersData(userId = "userId") {
  const dbRef = ref(database);
  try {
    const snapshot = await get(child(dbRef, `${userId}`));

    if (!snapshot.exists()) return { data: [] };

    return { data: snapshot.val() };
  } catch (error) {
    console.log(error);
  }
}

export const firebase = { updateFoldersData, getFoldersData };
