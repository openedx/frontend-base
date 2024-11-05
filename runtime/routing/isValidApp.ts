import { getConfig } from '../config';

export default function isValidApp(appId: string) {
  const { apps } = getConfig();
  const appIds = apps.map(app => app.id);
  return appIds.includes(appId);
}
