import { createContext, useContext } from "react";

import { firebaseService } from "../services/firebase";

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
  async function signup(email, password) {
    try {
      await firebaseService.auth.createUser({ email, password });
    } catch (err) {
      return _getAuthenticationError(err.code);
    }
  }

  return (
    <AuthContext.Provider value={{ signup }}>{children}</AuthContext.Provider>
  );
}
