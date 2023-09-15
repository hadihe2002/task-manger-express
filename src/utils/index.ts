export function removeEmpty(obj: object) {
  Object.keys(obj).forEach((k) => obj[k] == null && delete obj[k]);
}
