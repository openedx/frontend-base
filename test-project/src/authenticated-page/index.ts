import { ApplicationModuleConfig } from '@openedx/frontend-base';
import messages from './i18n';

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
  // header: {
  //   primaryLinks: [
  //     createUrlMenuItem('Authenticated Page Link', '#'),
  //   ]
  // },
  messages,
};

export default config;
