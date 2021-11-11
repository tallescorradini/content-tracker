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
}

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

export function makeFolder(folder = {}) {
  return {
    name: folder.name,
    slug: slugify(folder.name),
    channels: makeChannels(folder.channels),
  };
}

export function makeFolders(folders = []) {
  return folders.map((folder) => ({
    name: folder.name,
    slug: folder.slug,
    channels: makeChannels(folder.channels),
  }));
}
