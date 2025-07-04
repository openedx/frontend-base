import { Slot, WidgetOperationTypes } from '../../runtime';
import { App } from '../../types';
import Logo from '../Logo';
import CopyrightNotice from './CopyrightNotice';
import LabeledLinkColumn from './LabeledLinkColumn';
import LanguageMenu from './LanguageMenu';

const app: App = {
  appId: 'org.openedx.frontend.app.footer',
  slots: [
    // Center links
    {
      slotId: 'org.openedx.frontend.slot.footer.desktopCenterLinks.v1',
      id: 'org.openedx.frontend.widget.footer.desktopCenterLink1.v1',
      op: WidgetOperationTypes.APPEND,
      element: (
        <Slot id="org.openedx.frontend.slot.footer.desktopCenterLink1.v1" layout={LabeledLinkColumn} />
      ),
    },
    {
      slotId: 'org.openedx.frontend.slot.footer.desktopCenterLinks.v1',
      id: 'org.openedx.frontend.widget.footer.desktopCenterLink2.v1',
      op: WidgetOperationTypes.APPEND,
      element: (
        <Slot id="org.openedx.frontend.slot.footer.desktopCenterLink2.v1" layout={LabeledLinkColumn} />
      ),
    },
    {
      slotId: 'org.openedx.frontend.slot.footer.desktopCenterLinks.v1',
      id: 'org.openedx.frontend.widget.footer.desktopCenterLink3.v1',
      op: WidgetOperationTypes.APPEND,
      element: (
        <Slot id="org.openedx.frontend.slot.footer.desktopCenterLink3.v1" layout={LabeledLinkColumn} />
      ),
    },
    {
      slotId: 'org.openedx.frontend.slot.footer.desktopCenterLinks.v1',
      id: 'org.openedx.frontend.widget.footer.desktopCenterLink4.v1',
      op: WidgetOperationTypes.APPEND,
      element: (
        <Slot id="org.openedx.frontend.slot.footer.desktopCenterLink4.v1" layout={LabeledLinkColumn} />
      ),
    },

    // Left Links
    {
      slotId: 'org.openedx.frontend.slot.footer.desktopLeftLinks.v1',
      id: 'org.openedx.frontend.widget.footer.desktopLeftLinksLogo.v1',
      op: WidgetOperationTypes.APPEND,
      element: <Logo />,
    },

    // Right Links
    {
      slotId: 'org.openedx.frontend.slot.footer.desktopRightLinks.v1',
      id: 'org.openedx.frontend.widget.footer.desktopRightLinksLanguageMenu.v1',
      op: WidgetOperationTypes.APPEND,
      component: LanguageMenu,
    },

    // Copyright Notice
    {
      slotId: 'org.openedx.frontend.slot.footer.desktopLegalNotices.v1',
      id: 'org.openedx.frontend.widget.footer.desktopCopyrightNotice.v1',
      op: WidgetOperationTypes.APPEND,
      element: (
        <CopyrightNotice />
      ),
    }
  ]
};

export default app;
