import { ref, set, child, get } from "firebase/database";

import { database } from "./firebaseApp";

export function updateFoldersData(userId = "userId", data) {
  set(ref(database, `${userId}`), {
    folders: data,
  });
}

export async function getFoldersData(userId = "userId") {
  const dbRef = ref(database);
  try {
    const snapshot = await get(child(dbRef, `${userId}`));

    if (!snapshot.exists()) return { data: [] };

    return { data: snapshot.val() };
  } catch (error) {
    console.log(error);
  }
}
