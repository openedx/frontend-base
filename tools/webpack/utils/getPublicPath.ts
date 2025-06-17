export default function getPublicPath(defaultPath = 'auto') {
  return process.env.PUBLIC_PATH ?? defaultPath;
}
