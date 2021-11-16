import {
  createUserWithEmailAndPassword,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";

import { auth } from "./firebaseApp";

export async function createUser({ email, password }) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  return user.uid;
}

export function onAuthStateChanged(callbackFunction) {
  firebaseOnAuthStateChanged(auth, callbackFunction);
}

export async function signIn(email, password) {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
  await firebaseSignOut(auth);
}
