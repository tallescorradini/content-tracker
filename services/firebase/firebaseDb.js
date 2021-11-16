import { ref, set, child, get } from "firebase/database";

import { database } from "./firebaseApp";

export function updateFoldersData(userId, data) {
  set(ref(database, `${userId}`), {
    folders: data,
  });
}

export async function getFoldersData(userId) {
  const dbRef = ref(database);
  try {
    const snapshot = await get(child(dbRef, `${userId}`));

    if (!snapshot.exists()) return { data: [] };

    return { data: snapshot.val() };
  } catch (error) {
    console.log(error);
  }
}

export async function updateUserYoutubeId(userId, userYoutubeId) {
  set(ref(database, `users/${userId}`), {
    youtubeId: userYoutubeId,
  });
}

export async function getUserData(userId) {
  const dbRef = ref(database);
  try {
    const snapshot = await get(child(dbRef, `users/${userId}`));

    if (!snapshot.exists()) return { data: null };

    return { data: snapshot.val() };
  } catch (error) {
    console.log(error);
  }
}
