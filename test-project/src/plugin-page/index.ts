import { ApplicationModuleConfig } from "@openedx/frontend-base";

const config: ApplicationModuleConfig = {
  route: {
    path: '/plugins',
    lazy: async () => {
      const { default: Component } = await import('./PluginPage');
      return {
        Component,
      }
    },
  }
};

export default config;
