import { App } from '@openedx/frontend-base';

const config: App = {
  routes: [{
    path: '/plugins',
    lazy: async () => {
      const { default: Component } = await import('./PluginPage');
      return {
        Component,
      };
    },
  }]
};

export default config;
