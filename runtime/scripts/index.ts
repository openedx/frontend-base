import { getAppConfig, getSiteConfig } from '../config';

export function loadExternalScripts() {
  const apps = getSiteConfig().apps ?? [];
  apps.forEach(app => {
    const config = getAppConfig(app.appId) ?? {};
    (app.externalScripts ?? []).forEach(ExternalScript => {
      const script = new ExternalScript({ config });
      script.loadScript();
    });
  });
}
