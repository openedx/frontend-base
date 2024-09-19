import { ApplicationModuleConfig, HeaderTypes } from "@openedx/frontend-base";

const config: ApplicationModuleConfig = {
  routes: [
    {
      path: '/authenticated',
      lazy: async () => {
        const { default: Component } = await import('./AuthenticatedPage');
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
