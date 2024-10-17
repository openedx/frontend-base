import { ApplicationModuleConfig } from "@openedx/frontend-base";

const config: ApplicationModuleConfig = {
  routes: [
    {
      path: '/authenticated',
      lazy: async () => {
        const { default: Component } = await import('./AuthenticatedPage');
        return {
          Component,
        }
      },
    }
  ]
};

export default config;
