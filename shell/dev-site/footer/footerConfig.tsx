import { Button } from '@openedx/paragon';
import { LayoutOperationTypes, WidgetOperationTypes } from '../../../runtime';
import { App, } from '../../../types';
import LinkMenuItem from '../../menus/LinkMenuItem';

const config: App = {
  slots: [
    {
      slotId: 'org.openedx.frontend.slot.footer.desktopTop.v1',
      id: 'footer.booyah.revealed',
      op: WidgetOperationTypes.APPEND,
      element: (
        <Button>I are button</Button>
      )
    },
    {
      slotId: 'org.openedx.frontend.slot.footer.desktopTop.v1',
      op: LayoutOperationTypes.OPTIONS,
      options: {
        label: 'I Reveal Buttons',
      }
    },
    {
      slotId: 'org.openedx.frontend.slot.footer.desktopTop.v1',
      id: 'footer.booyah.revealed.linky',
      op: WidgetOperationTypes.APPEND,
      element: (
        <Button>I Are Another Button</Button>
      )
    },
    {
      slotId: 'org.openedx.frontend.slot.footer.desktopCenterLink1.v1',
      id: 'footer.booyah.centerLinks.first.1',
      op: WidgetOperationTypes.APPEND,
      element: (
        <LinkMenuItem label="Link 1" url="#" />
      )
    },
  ]
};

export default config;
