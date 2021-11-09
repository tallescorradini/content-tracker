function makeThumbnail(thumbnail = []) {
  return {
    url: thumbnail.url,
    width: parseInt(thumbnail.width) || undefined,
    height: parseInt(thumbnail.height) || undefined,
  };
}

function makeChannels(channels = []) {
  return channels.map((channel) => ({
    id: channel.id,
    title: channel.title,
    thumbnail: makeThumbnail(channel.thumbnail),
    url: channel.url,
    videoCount: channel.videoCount,
    lastAccess: channel.lastAccess,
    hiddenActivities: channel.hiddenActivities || [],
  }));
}

export function makeFolders(folders = []) {
  return folders.map((folder) => ({
    name: folder.name,
    slug: folder.slug,
    channels: makeChannels(folder.channels),
  }));
}
