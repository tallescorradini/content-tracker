import React, { useContext, useState } from "react";
import axios from "axios";

const FavoritesContext = React.createContext();

export function useFavorites() {
  return useContext(FavoritesContext);
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  function _getChannelId(url) {
    if (!url) return;
    const [channelId] = url.split("/").slice(-1);

    return channelId;
  }

  async function addFavorite(url) {
    const channelId = _getChannelId(url);

    const { data } = await axios.get("/api/favorites", {
      params: { channelId: channelId },
    });

    setFavorites((prev) => [...prev, data]);
  }

  const value = { addFavorite, favorites };
  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
