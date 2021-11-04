function makeThumbnail(data) {
  const thumbnail = data?.thumbnail || {};

  return {
    url: thumbnail.url,
    width: parseInt(thumbnail.width) || undefined,
    height: parseInt(thumbnail.height) || undefined,
  };
}

function makeChannels(data) {
  const channels = data?.channels || [];

  return channels.map((channel) => ({
    id: channel.id,
    title: channel.title,
    thumbnail: makeThumbnail(channel.thumbnail),
    url: channel.url,
    videoCount: channel.videoCount,
    lastAccess: channel.lastAccess,
  }));
}

export function makeFolders(data) {
  const folders = data?.folders || [];

  return folders.map((folder) => ({
    name: folder.name,
    slug: folder.slug,
    channels: makeChannels(folder.channels),
  }));
}
