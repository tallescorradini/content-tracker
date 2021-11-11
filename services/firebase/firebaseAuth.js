import {
  // signup
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "./firebaseApp";

export async function createUser({ email, password }) {
  await createUserWithEmailAndPassword(auth, email, password);
}
