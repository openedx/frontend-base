import { Button } from '@openedx/paragon';
import { LayoutOperationTypes, WidgetOperationTypes } from '../../../runtime';
import { App, } from '../../../types';
import LinkMenuItem from '../../menus/LinkMenuItem';

const config: App = {
  slots: [
    {
      slotId: 'frontend.shell.footer.desktop.top.ui',
      id: 'footer.booyah.revealed',
      op: WidgetOperationTypes.APPEND,
      element: (
        <Button>I are button</Button>
      )
    },
    {
      slotId: 'frontend.shell.footer.desktop.top.ui',
      op: LayoutOperationTypes.OPTIONS,
      options: {
        label: 'I Reveal Buttons',
      }
    },
    {
      slotId: 'frontend.shell.footer.desktop.top.ui',
      id: 'footer.booyah.revealed.linky',
      op: WidgetOperationTypes.APPEND,
      element: (
        <Button>I Are Another Button</Button>
      )
    },
    {
      slotId: 'frontend.shell.footer.desktop.centerLinks.first.ui',
      id: 'footer.booyah.centerLinks.first.1',
      op: WidgetOperationTypes.APPEND,
      element: (
        <LinkMenuItem label="Link 1" url="#" />
      )
    },
  ]
};

export default config;
