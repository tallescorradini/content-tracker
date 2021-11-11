import {
  createUserWithEmailAndPassword,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "./firebaseApp";

export async function createUser({ email, password }) {
  await createUserWithEmailAndPassword(auth, email, password);
}

export function onAuthStateChanged(callbackFunction) {
  firebaseOnAuthStateChanged(auth, callbackFunction);
}

export async function signIn(email, password) {
  await signInWithEmailAndPassword(auth, email, password);
}
