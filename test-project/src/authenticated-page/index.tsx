import { App, LinkMenuItem } from '@openedx/frontend-base';
import { SlotOperationTypes } from '@openedx/frontend-base/types';
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
      op: SlotOperationTypes.APPEND,
      element: (
        <LinkMenuItem label="Authenticated Page Link" url="#" variant="navLink" />
      )
    }
  ],
  messages,
};

export default config;
