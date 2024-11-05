import { AppConfigTypes } from '../../types';
import getApp from './getApp';

export default function getAppUrl(appId: string) {
  const app = getApp(appId);
  if (app == null) {
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
