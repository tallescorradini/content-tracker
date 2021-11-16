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
  const [userYoutubeId, setUserYoutubeId] = useState();

  async function signup(email, password) {
    try {
      if (!userYoutubeId) throw new Error("auth/missing-youtube-id");
      const userId = await firebaseService.auth.createUser({ email, password });
      await firebaseService.db.updateUserYoutubeId(userId, userYoutubeId);
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

  async function logout() {
    try {
      firebaseService.auth.signOut();
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    firebaseService.auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        const user = makeUser(userAuth);
        setUser(user);

        const { data } = await firebaseService.db.getUserData(user.id);
        setUserYoutubeId(data.youtubeId);
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signup,
        login,
        userId: user?.id,
        logout,
        userYoutubeId,
        setUserYoutubeId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
