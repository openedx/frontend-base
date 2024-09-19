import { ApplicationModuleConfig, HeaderTypes } from "@openedx/frontend-base";

const config: ApplicationModuleConfig = {
  routes: [
    {
      path: '/plugins',
      lazy: async () => {
        const { default: Component } = await import('./PluginPage');
        return {
          Component,
          handle: {
            headerId: HeaderTypes.DEFAULT,
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
