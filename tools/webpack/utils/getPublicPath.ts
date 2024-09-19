export default function getPublicPath(defaultPath: string = '/') {
  return process.env.PUBLIC_PATH || defaultPath;
}
