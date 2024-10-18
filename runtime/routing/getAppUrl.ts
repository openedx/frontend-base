import { AppConfigTypes } from '../../types';
import { getConfig } from '../config';
import isValidApp from './isValidApp';

export default function getAppUrl(appId: string) {
  const { apps } = getConfig();
  const app = apps[appId];

  if (!isValidApp(appId)) {
    return '#';
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
  return '#';
}
