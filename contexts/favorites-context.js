import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";

import { firebase } from "../services/firebase";
import { makeFolders } from "./interfaces/folders";

const FavoritesContext = React.createContext();

export function useFavorites() {
  return useContext(FavoritesContext);
}

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
  const [notifications, setNotifications] = useState({});

  function _getChannelId(url) {
    if (!url) return;
    const [channelId] = url.split("/").slice(-1);

    return channelId;
  }

  function _removeDuplicates(array) {
    return [...new Set(array)];
  }

  async function addFolder(folderName, channelUrls = []) {
    const channelIds = _removeDuplicates(
      channelUrls.map((channelUrl) => _getChannelId(channelUrl))
    );

    const channels = await Promise.all(
      channelIds.map(async (channelId) => {
        const { data } = await axios.get("/api/favorites", {
          params: { channelId: channelId },
        });
        const channelData = {
          ...data,
          lastAccess: new Date().toISOString(),
        };
        return channelData;
      })
    );

    const folder = {
      name: folderName,
      slug: slugify(folderName),
      channels: channels,
    };

    setFolders((prevFolders) => [...prevFolders, folder]);
  }

  async function addFavorite(url, folderName) {
    const channelId = _getChannelId(url);

    const { data } = await axios.get("/api/favorites", {
      params: { channelId: channelId },
    });

    const channelData = { ...data, lastAccess: new Date().toISOString() };

    setFolders((prevfolders) =>
      prevfolders.map((folder) => {
        if (folder.name !== folderName) return folder;

        const isIncluded = folder.channels.reduce(
          (result, current) => current.id === channelData.id || result,
          false
        );

        if (isIncluded) return folder;
        return { ...folder, channels: [...folder.channels, channelData] };
      })
    );
  }

  function _getNotifications(folders) {
    folders.forEach((folder) => {
      folder.channels?.forEach(async (channel) => {
        const { data } = await axios.get(`/api/${channel.id}`, {
          params: { publishedAfter: channel.lastAccess },
        });
        setNotifications((prev) => ({
          ...prev,
          [channel.id]: data.totalNotifications,
        }));
      });
    });
  }

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

  async function removeFavorite(channelId, folderName) {
    if (!channelId) return;

    setFolders((prevfolders) =>
      prevfolders.map((prevFolder) => {
        if (prevFolder.name === folderName) {
          return {
            ...prevFolder,
            channels: prevFolder.channels.filter(
              (channel) => channel.id !== channelId
            ),
          };
        }
        return prevFolder;
      })
    );
  }

  function _updateLastAccess(channelId) {
    setFolders((prevFolders) =>
      prevFolders.map((folder) => ({
        ...folder,
        channels: folder.channels.map((channel) => {
          if (channel.id !== channelId) return channel;
          return { ...channel, lastAccess: new Date().toISOString() };
        }),
      }))
    );
  }

  function _updateChannelNotification(channelId) {
    setNotifications((prev) => ({ ...prev, [channelId]: 0 }));
  }

  function onAccessChannel(channelId) {
    _updateLastAccess(channelId);
    _updateChannelNotification(channelId);
  }

  useEffect(() => {
    firebase.getFoldersData("userId").then(({ data }) => {
      if (!data) return;

      setFolders(makeFolders(data.folders));
      _getNotifications(data.folders);
    });
  }, []);

  useEffect(() => {
    if (folders.length < 1) return;

    firebase.updateFoldersData("userId", folders);
  }, [folders]);

  const value = {
    addFolder,
    addFavorite,
    removeFavorite,
    folders,
    getFolderBySlug,
    updateFolderName,
    onAccessChannel,
    notifications,
  };
  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
