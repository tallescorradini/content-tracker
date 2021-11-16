import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";

import { firebaseService } from "../services/firebase";
import { makeFolders, makeFolder } from "./models/folders";
import { useAuth } from "./auth-context";

const FavoritesContext = React.createContext();

export function useFavorites() {
  return useContext(FavoritesContext);
}

export function FavoritesProvider({ children }) {
  const [folders, setFolders] = useState([]);
  const [notifications, setNotifications] = useState({});
  const { userId, userYoutubeId } = useAuth();

  function _getChannelId(url) {
    if (!url) return;
    const [channelId] = url.split("/").slice(-1);

    return channelId;
  }

  function _removeDuplicates(array) {
    return [...new Set(array)];
  }

  async function addFolder(folderName) {
    const folder = makeFolder({
      name: folderName,
    });

    setFolders((prevFolders) => [...prevFolders, folder]);

    return folder;
  }

  function _getUncategorizedFolder() {
    return folders.filter((folder) => folder.name === "Uncategorized")[0];
  }

  function _removeFromUncategorizedFolder(channelIdsToFilterOut = []) {
    setFolders((prevfolders) =>
      prevfolders.map((folder) => {
        if (folder.name !== "Uncategorized") return folder;

        const updatedChannels = folder.channels.filter(
          (channel) => !channelIdsToFilterOut.includes(channel.id)
        );

        return { ...folder, channels: updatedChannels };
      })
    );
  }

  function addFavorite(channelIds = [], folderName) {
    const uncategorizedChannels = _getUncategorizedFolder().channels;

    const channels = uncategorizedChannels.filter((channel) =>
      channelIds.includes(channel.id)
    );

    setFolders((prevfolders) =>
      prevfolders.map((folder) => {
        if (folder.name !== folderName) return folder;

        return { ...folder, channels: [...folder.channels, ...channels] };
      })
    );

    _removeFromUncategorizedFolder(channelIds);
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

  function _addToUncategorizedFolder(channelToAdd) {
    setFolders((prevfolders) =>
      prevfolders.map((folder) => {
        if (folder.name !== "Uncategorized") return folder;

        return { ...folder, channels: [...folder.channels, channelToAdd] };
      })
    );
  }

  function removeFavorite(channel, folderName) {
    const channelId = channel.id;
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

    _addToUncategorizedFolder(channel);
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

  async function addUncategorizedFolder(userChannelId) {
    const { data: channels } = await axios.get("/api/subscriptions", {
      params: { userChannelId: userChannelId },
    });

    const folder = makeFolder({
      name: "Uncategorized",
      channels: channels,
    });

    setFolders([folder]);
  }

  async function _updateFolders(currentFolders = [], userYoutubeId) {
    // fetch current_subscriptions
    const { data: subscriptions } = await axios.get("/api/subscriptions", {
      params: {
        userChannelId: userYoutubeId,
      },
    });

    let uncategorized = subscriptions;

    // loop folders
    const updatedFolders = currentFolders.map((currentFolder) => ({
      ...currentFolder,
      channels: currentFolder.channels.filter((channel) => {
        const isCurrentSubscription = subscriptions.some(
          (subscription) => subscription.id === channel.id
        );

        // remove channel if not subscribed anymore
        if (!isCurrentSubscription) return false;

        uncategorized = uncategorized.filter(
          (subscription) => subscription.id !== channel.id
        );

        // otherwise keep channel
        return true;
      }),
    }));

    return updatedFolders.map((folder) => {
      if (folder.name !== "Uncategorized") return folder;

      return { ...folder, channels: [...folder.channels, ...uncategorized] };
    });
  }

  useEffect(() => {
    // new user and has provided an youtubeId
    if (!userId && userYoutubeId) {
      addUncategorizedFolder(userYoutubeId);
      return;
    }

    // new user and did not provide an youtubeId
    if (!userId || !userYoutubeId) return;

    // user is logged in
    firebaseService.db.getFoldersData(userId).then(async ({ data }) => {
      if (!data) return;
      const folders = makeFolders(data.folders);
      const updatedFolders = await _updateFolders(folders, userYoutubeId);
      setFolders(updatedFolders);
      _getNotifications(updatedFolders);
    });
  }, [userId, userYoutubeId]);

  useEffect(() => {
    if (!userId) return;
    if (folders.length < 1) return;

    firebaseService.db.updateFoldersData(userId, folders);
  }, [userId, folders]);

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
    addUncategorizedFolder,
  };
  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
