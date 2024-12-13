import { App, LinkMenuItem, WidgetOperationTypes } from '@openedx/frontend-base';
import messages from './i18n';

const config: App = {
  routes: [{
    path: '/authenticated',
    lazy: async () => {
      const { default: Component } = await import('./AuthenticatedPage');
      return {
        Component,
      };
    },
  }],
  slots: [
    {
      slotId: 'frontend.shell.header.primaryLinks.widget',
      id: 'authenticatedPageLink',
      op: WidgetOperationTypes.APPEND,
      element: (
        <LinkMenuItem label="Authy Page" url="/authenticated" variant="navLink" />
      )
    }
  ],
  messages,
};

export default config;
