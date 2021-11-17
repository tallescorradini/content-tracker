import { appWithTranslation } from "next-i18next";

import "../styles/globals.css";
import { FavoritesProvider } from "../contexts/favorites-context";
import { AuthProvider } from "../contexts/auth-context";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Component {...pageProps} />
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default appWithTranslation(MyApp);
