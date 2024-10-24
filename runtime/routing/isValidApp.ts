import { getConfig } from '../config';

export default function isValidApp(appId: string) {
  const { apps } = getConfig();
  const app = apps[appId];

  return app !== undefined;
}
