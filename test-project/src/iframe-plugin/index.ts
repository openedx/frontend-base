import { ApplicationModuleConfig } from "@openedx/frontend-base";

const config: ApplicationModuleConfig = {
  routes: [
    {
      path: '/iframe-plugin',
      lazy: async () => {
        const { default: Component } = await import('./IframePlugin');
        return {
          Component,
        }
      },
      // children: [
      //   {
      //     path: 'child',
      //     lazy: async () => {
      //       const { default: Component } = await import('./ModuleOneChild');
      //       return {
      //         Component,
      //       }
      //     }
      //   }
      // ]
    }
  ]
};

export default config;
