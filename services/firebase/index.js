import { ref, set } from "firebase/database";
import { child, get } from "firebase/database";

import { database } from "./firebaseApp";
import * as auth from "./firebaseAuth";

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

export const firebaseService = { auth };
