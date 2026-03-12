export default function getPublicPath(defaultPath = '/') {
  return process.env.PUBLIC_PATH ?? defaultPath;
}
