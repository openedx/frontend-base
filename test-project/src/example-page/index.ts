import { ApplicationModuleConfig } from "@openedx/frontend-base";

const config: ApplicationModuleConfig = {
  routes: [
    {
      path: '/',
      lazy: async () => {
        const { default: Component } = await import('./ExamplePage');
        return {
          Component,
        }
      },
    }
  ]
};

export default config;
