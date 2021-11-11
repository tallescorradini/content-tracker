export function makeUser(user) {
  return Object.freeze({
    userId: user.uid,
  });
}
