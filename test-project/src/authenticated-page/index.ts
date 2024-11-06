import { ApplicationModuleConfig, createUrlMenuItem } from '@openedx/frontend-base';

const config: ApplicationModuleConfig = {
  route: {
    path: '/authenticated',
    lazy: async () => {
      const { default: Component } = await import('./AuthenticatedPage');
      return {
        Component,
      };
    },
  },
  header: {
    primaryLinks: [
      createUrlMenuItem('Authenticated Page Link', '#'),
    ]
  }
};

export default config;
