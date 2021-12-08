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
  restrictedRoute = false,
  privateRoute = false,
} = {}) {
  // function composition to get type of route as a parameter
  return (Component) => {
    // function to return the high order component
    function HOC(props) {
      // to decide what should happen after authentication is done
      const { user } = useContext(AuthContext);
      const router = useRouter();
      const [showComponent, setShowComponent] = useState(false);

      useEffect(() => {
        console.log(`withAuth ${router.pathname}`, { user });

        if (privateRoute) {
          if (showComponent) return; // once page is shown, no need to check for user

          if (user === undefined) return; // when page is acessed manually or refreshed
          if (user === null) return router.push("/login");
          if (user.type === "USER" || user.type === "GUEST")
            return setShowComponent(true);
        }

        if (restrictedRoute) {
          if (!user) return setShowComponent(true);
          if (user.type === "USER") return router.replace("/favorites");
        }
      }, [user]);

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
  const router = useRouter();

  async function signup(email, password) {
    try {
      if (!user?.youtubeId) throw new Error("auth/missing-youtube-id");
      const userId = await firebaseService.auth.createUser({ email, password });
      await firebaseService.db.updateUserYoutubeId(userId, user?.youtubeId);
    } catch (err) {
      return _getAuthenticationError(err.code);
    }
  }

  async function login(email, password, { redirectUri }) {
    try {
      const { userId } = await firebaseService.auth.signIn(email, password);
      const { data } = await firebaseService.db.getUserData(userId);
      if (!data) return;
      const user = makeUser({ id: userId, youtubeId: data.youtubeId });

      setUser(user, router.push(redirectUri));
    } catch (err) {
      console.log(err);
      return _getAuthenticationError(err.code);
    }
  }

  async function loginAsGuest(youtubeId, { redirectUri }) {
    setUser(makeUser({ youtubeId }), router.push(redirectUri));
  }

  async function logout({ redirectUri }) {
    try {
      await firebaseService.auth.signOut();
      setUser(null, router.replace(redirectUri));
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    firebaseService.auth.onAuthStateChanged(async (userAuth) => {
      if (user !== undefined) return;

      if (userAuth) {
        const userId = userAuth.uid;
        const { data } = await firebaseService.db.getUserData(userId);
        if (!data) return;
        setUser(makeUser({ id: userId, youtubeId: data.youtubeId }));
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
        user,
        userId: user?.id,
        logout,
        loginAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
