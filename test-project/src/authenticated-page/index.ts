import { ApplicationModuleConfig } from "@openedx/frontend-base";

const config: ApplicationModuleConfig = {
  route: {
    path: '/authenticated',
    lazy: async () => {
      const { default: Component } = await import('./AuthenticatedPage');
      return {
        Component,
      }
    },
  },
  header: {
    primaryLinks: [
      {
        label: 'Authenticated Page Link',
        url: '#',
      },
    ]
  }
};

export default config;
