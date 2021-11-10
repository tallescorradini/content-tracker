import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";

import { firebase } from "../services/firebase";
import { makeFolders, makeFolder } from "./interfaces/folders";

const FavoritesContext = React.createContext();

export function useFavorites() {
  return useContext(FavoritesContext);
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

    const folder = makeFolder({
      name: folderName,
      channels: channels,
    });

    setFolders((prevFolders) => [...prevFolders, folder]);

    return folder;
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

        const filteredActivities = data.activities.filter(
          (activity) => !channel.hiddenActivities?.includes(activity.id)
        );

        setNotifications((prev) => ({
          ...prev,
          [channel.id]: {
            activities: filteredActivities,
            totalNotifications: filteredActivities?.length || 0,
          },
        }));
      });
    });
  }

  function getFolderBySlug(slug) {
    return folders.filter((folder) => folder.slug === slug)[0];
  }

  function updateFolderName({ oldName, newName }) {
    let updatedSlug;

    setFolders((prevfolders) =>
      prevfolders.map((prevFolder) => {
        if (prevFolder.name === oldName) {
          const updatedFolder = makeFolder({ ...prevFolder, name: newName });
          updatedSlug = updatedFolder.slug;
          return updatedFolder;
        }
        return prevFolder;
      })
    );
    return { updatedSlug: updatedSlug };
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

  function onAccessNewActivity(activity) {
    const { id: activityId, channelId } = activity;

    setFolders((prevFolders) =>
      prevFolders.map((folder) => ({
        ...folder,
        channels: folder.channels.map((channel) => {
          if (channel.id !== channelId) return channel;

          const hiddenActivities = _removeDuplicates([
            ...channel.hiddenActivities,
            activityId,
          ]);

          setNotifications((prevNotifications) => {
            const filteredActivities = prevNotifications[
              channel.id
            ].activities.filter(
              (activity) => !hiddenActivities.includes(activity.id)
            );
            return {
              ...prevNotifications,
              [channel.id]: {
                ...prevNotifications[channel.id],
                activities: filteredActivities,
                totalNotifications: filteredActivities.length,
              },
            };
          });

          return {
            ...channel,
            hiddenActivities: hiddenActivities,
          };
        }),
      }))
    );
  }

  function getChannel(channelId) {
    // check all folders because channels data is not denormalized
    const filteredFolders = folders.filter(
      (folder) =>
        folder.channels.filter((channel) => channel.id === channelId)[0]
    );

    const channel = filteredFolders[0]?.channels.filter(
      (channel) => channel.id === channelId
    )[0];

    return channel;
  }

  function deleteFolder(folderName) {
    setFolders((prevFolder) =>
      prevFolder.filter((folder) => folder.name !== folderName)
    );
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
    onAccessNewActivity,
    notifications,
    getChannel,
    deleteFolder,
  };
  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
