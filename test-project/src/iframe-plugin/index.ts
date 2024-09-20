import { ApplicationModuleConfig, HeaderTypes } from "@openedx/frontend-base";

const config: ApplicationModuleConfig = {
  routes: [
    {
      path: '/iframe-plugin',
      lazy: async () => {
        const { default: Component } = await import('./IframePlugin');
        return {
          Component,
          handle: {
            headerId: HeaderTypes.NONE,
          }
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
