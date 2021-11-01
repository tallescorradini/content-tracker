import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

const FavoritesContext = React.createContext();

export function useFavorites() {
  return useContext(FavoritesContext);
}

const DEFAULT_FOLDER_NAME = "Uncategorized";

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [folders, setFolders] = useState([]);

  function _getChannelId(url) {
    if (!url) return;
    const [channelId] = url.split("/").slice(-1);

    return channelId;
  }

  async function addFavorite(url, folderName = DEFAULT_FOLDER_NAME) {
    const channelId = _getChannelId(url);

    const { data: channelData } = await axios.get("/api/favorites", {
      params: { channelId: channelId },
    });

    setFolders((prevfolders) =>
      prevfolders.map((prevFolder) => {
        if (prevFolder.name === folderName) {
          const isIncluded = prevFolder.channels.reduce(
            (result, current) => current.id === channelData.id || result,
            false
          );

          if (!isIncluded)
            prevFolder.channels = [...prevFolder.channels, channelData];
        }
        return prevFolder;
      })
    );
  }

  useEffect(() => {
    // load user folders
    if (folders.length > 0) {
      // setFolders(loadedFolders)
    } else {
      setFolders([{ name: DEFAULT_FOLDER_NAME, channels: [] }]);
    }
  }, [folders]);

  const value = { addFavorite, folders };
  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
