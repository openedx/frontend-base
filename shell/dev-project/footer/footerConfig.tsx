import { Button } from '@openedx/paragon';
import { App, LayoutOperationTypes, WidgetOperationTypes } from '../../../types';
import LinkMenuItem from '../../menus/LinkMenuItem';

const config: App = {
  slots: [
    {
      slotId: 'frontend.shell.footer.desktop.top.widget',
      id: 'footer.booyah.revealed',
      op: WidgetOperationTypes.APPEND,
      element: (
        <Button>I are button</Button>
      )
    },
    {
      slotId: 'frontend.shell.footer.desktop.top.widget',
      id: 'footer.booyah.revealed.options',
      op: LayoutOperationTypes.OPTIONS,
      options: {
        label: 'I Reveal Buttons',
      }
    },
    {
      slotId: 'frontend.shell.footer.desktop.top.widget',
      id: 'footer.booyah.revealed.linky',
      op: WidgetOperationTypes.APPEND,
      element: (
        <Button>I Are Another Button</Button>
      )
    },
    {
      slotId: 'frontend.shell.footer.desktop.centerLinks.first.widget',
      id: 'footer.booyah.centerLinks.first.1',
      op: WidgetOperationTypes.APPEND,
      element: (
        <LinkMenuItem label="Link 1" url="#" />
      )
    },
  ]
};

export default config;
