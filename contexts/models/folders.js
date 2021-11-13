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

function makeChannels(channels = []) {
  return channels.map((channel) => ({
    id: channel.id,
    title: channel.title,
    thumbnailUrl: channel.thumbnailUrl,
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
