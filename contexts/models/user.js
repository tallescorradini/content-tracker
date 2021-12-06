export function makeUser({ id: userId, youtubeId } = {}) {
  return Object.freeze({
    id: userId || "",
    youtubeId: youtubeId || "",
    type: !!userId ? "USER" : !!youtubeId ? "GUEST" : "UNKNOWN",
  });
}
