import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

const FavoritesContext = React.createContext();

export function useFavorites() {
  return useContext(FavoritesContext);
}

const DEFAULT_FOLDER_NAME = "Uncategorized";

function slugify(folderName) {
  return folderName
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
  //
}

export function FavoritesProvider({ children }) {
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
      setFolders([
        {
          name: DEFAULT_FOLDER_NAME,
          slug: slugify(DEFAULT_FOLDER_NAME),
          channels: [],
        },
      ]);
    }
  }, [folders]);

  function getFolderBySlug(slug) {
    return folders.filter((folder) => folder.slug === slug)[0];
  }

  function updateFolderName({ oldName, newName }) {
    setFolders((prevfolders) =>
      prevfolders.map((prevFolder) => {
        if (prevFolder.name === oldName) {
          return { ...prevFolder, name: newName, slug: slugify(newName) };
        }
        return prevFolder;
      })
    );
    return { updatedSlug: slugify(newName) };
  }

  const value = { addFavorite, folders, getFolderBySlug, updateFolderName };
  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
