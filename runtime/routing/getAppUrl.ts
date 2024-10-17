import { AppConfigTypes } from '../../types';
import { getConfig } from '../config';

export default function getAppUrl(appId: string) {
  const { apps } = getConfig();
  const app = apps[appId];

  if (app === undefined) {
    return null;
  }

  if (app.type === AppConfigTypes.EXTERNAL) {
    return app.url;
  }
  if (app.type === AppConfigTypes.FEDERATED) {
    return app.path;
  }
  if (app.type === AppConfigTypes.INTERNAL) {
    if (app.path !== undefined) {
      return app.path;
    }
    return app.config.route.path;
  }
  return null;
}
