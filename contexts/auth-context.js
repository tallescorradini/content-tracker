import { createContext, useContext, useState, useEffect } from "react";

import { firebaseService } from "../services/firebase";
import { makeUser } from "./models/user";

export const AuthContext = createContext();

function _getAuthenticationError(errorCode) {
  let error;
  switch (errorCode) {
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/email-already-in-use":
    case "auth/network-request-failed":
      error = errorCode;
      break;
    default:
      error = "auth/default";
      break;
  }

  return error;
}

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState();

  async function signup(email, password) {
    try {
      await firebaseService.auth.createUser({ email, password });
    } catch (err) {
      return _getAuthenticationError(err.code);
    }
  }

  async function login(email, password) {
    try {
      await firebaseService.auth.signIn(email, password);
    } catch (err) {
      return _getAuthenticationError(err.code);
    }
  }

  useEffect(() => {
    firebaseService.auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(makeUser(user));
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ signup, login, userId: user?.id }}>
      {children}
    </AuthContext.Provider>
  );
}
