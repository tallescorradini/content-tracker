import "../styles/globals.css";

import { FavoritesProvider } from "../contexts/favorites-context";

function MyApp({ Component, pageProps }) {
  return (
    <FavoritesProvider>
      <Component {...pageProps} />
    </FavoritesProvider>
  );
}

export default MyApp;
