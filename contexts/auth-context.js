import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

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

export function withAuth({
  publicRoute,
  restrictedRoute = false,
  privateRoute = false,
} = {}) {
  // function composition to get type of route as a parameter
  return (Component) => {
    // function to return the high order component
    function HOC(props) {
      // to decide what should happen after authentication is done
      const { user, isDoneAuthenticating } = useContext(AuthContext);
      const router = useRouter();
      const [showComponent, setShowComponent] = useState(false);

      useEffect(() => {
        if (!isDoneAuthenticating) return null;

        if (privateRoute && user?.type === "UNKNOWN")
          return router.push("/login");
        if (restrictedRoute && user?.type === "USER")
          return router.replace("/favorites");

        setShowComponent(true);
      }, [isDoneAuthenticating, user?.type]);

      return showComponent ? <Component {...props} /> : null;
    }
    return HOC;
  };
}

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [isDoneAuthenticating, setIsDoneAuthenticating] = useState(false);

  async function signup(email, password) {
    try {
      if (!user?.youtubeId) throw new Error("auth/missing-youtube-id");
      const userId = await firebaseService.auth.createUser({ email, password });
      await firebaseService.db.updateUserYoutubeId(userId, user?.youtubeId);
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

  async function loginAsGuest(youtubeId) {
    return new Promise((resolve) => {
      setUser(makeUser({ youtubeId }), resolve());
    });
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
        const userId = userAuth.uid;

        const { data } = await firebaseService.db.getUserData(userId);
        if (!data) return;

        const user = makeUser({ id: userId, youtubeId: data.youtubeId });

        setUser((prevState) => ({ ...prevState, ...user }));
      } else {
        setUser();
      }
      setIsDoneAuthenticating(true);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signup,
        login,
        user,
        userId: user?.id,
        logout,
        isDoneAuthenticating,
        loginAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
