export function makeUser(user) {
  return Object.freeze({
    id: user.uid,
  });
}
