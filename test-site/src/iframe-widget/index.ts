import { App } from '@openedx/frontend-base';

const config: App = {
  appId: 'iframe-test-app',
  routes: [{
    path: '/iframe-plugin',
    lazy: async () => {
      const { default: Component } = await import('./IframeWidget');
      return {
        Component,
      };
    },
  }]
};

export default config;
