import { getConfig } from '../config';

export default function getApp(appId: string) {
  const { apps } = getConfig();

  for (const app of apps) {
    if (app.id === appId) {
      return app;
    }
  }
  return null;
}
