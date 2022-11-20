export function generateUUID() {
  return Number(Math.random().toString().substr(2, 5) + Date.now()).toString(36);
}
