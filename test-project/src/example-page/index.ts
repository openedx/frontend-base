import { ApplicationModuleConfig } from '@openedx/frontend-base';

const config: ApplicationModuleConfig = {
  route: {
    path: '/',
    lazy: async () => {
      const { default: Component } = await import('./ExamplePage');
      return {
        Component,
      }
    },
  }
};

export default config;
