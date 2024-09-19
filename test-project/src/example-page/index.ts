import { ApplicationModuleConfig, HeaderTypes } from "@openedx/frontend-base";

const config: ApplicationModuleConfig = {
  routes: [
    {
      path: '/',
      lazy: async () => {
        const { default: Component } = await import('./ExamplePage');
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
