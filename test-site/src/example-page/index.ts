import { App } from '@openedx/frontend-base';

const config: App = {
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
