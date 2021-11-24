const userStatus = { UNAUTHED: "UNAUTHED", GUEST: "GUEST", AUTHED: "AUTHED" };

export function makeUser(user = { id: "", youtubeId: "" }) {
  return Object.freeze({
    id: user.id || "",
    isAuthed: !!user.id,
    isGuest: !!!user.id && !!user.youtubeId,
    isUnauthed: !!!user.id && !!!user.youtubeId,
  });
}
