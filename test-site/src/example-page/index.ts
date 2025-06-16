import { App } from '@openedx/frontend-base';

const config: App = {
  appId: 'test-example-page-app',
  routes: [{
    path: '/',
    lazy: async () => {
      const { default: Component } = await import('./ExamplePage');
      return {
        Component,
      };
    },
  }]
};

export default config;
