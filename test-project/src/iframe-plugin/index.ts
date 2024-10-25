import { ApplicationModuleConfig } from '@openedx/frontend-base';

const config: ApplicationModuleConfig = {
  route: {
    path: '/iframe-plugin',
    lazy: async () => {
      const { default: Component } = await import('./IframePlugin');
      return {
        Component,
      };
    },
  }
};

export default config;
