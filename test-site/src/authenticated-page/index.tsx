import { App, LinkMenuItem, WidgetOperationTypes } from '@openedx/frontend-base';

const config: App = {
  appId: 'test-authenticated-page-app',
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
      slotId: 'org.openedx.frontend.slot.header.primaryLinks.v1',
      id: 'authenticatedPageLink',
      op: WidgetOperationTypes.APPEND,
      element: (
        <LinkMenuItem label="Authy Page" url="/authenticated" variant="navLink" />
      )
    }
  ],
};

export default config;
