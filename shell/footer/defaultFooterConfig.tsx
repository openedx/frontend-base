import { Slot, WidgetOperationTypes } from '../../runtime';
import { App } from '../../types';
import Logo from '../Logo';
import CopyrightNotice from './CopyrightNotice';
import LabeledLinkColumn from './LabeledLinkColumn';
import LanguageMenu from './LanguageMenu';

const config: App = {
  slots: [
    // Center links
    {
      slotId: 'org.openedx.frontend.slot.footer.desktopCenterLinks.v1',
      id: 'default.footer.desktop.centerLinks.first',
      op: WidgetOperationTypes.APPEND,
      element: (
        <Slot id="org.openedx.frontend.slot.footer.desktopCenterLink1.v1" layout={LabeledLinkColumn} />
      ),
    },
    {
      slotId: 'org.openedx.frontend.slot.footer.desktopCenterLinks.v1',
      id: 'default.footer.desktop.centerLinks.second',
      op: WidgetOperationTypes.APPEND,
      element: (
        <Slot id="org.openedx.frontend.slot.footer.desktopCenterLink2.v1" layout={LabeledLinkColumn} />
      ),
    },
    {
      slotId: 'org.openedx.frontend.slot.footer.desktopCenterLinks.v1',
      id: 'default.footer.desktop.centerLinks.third',
      op: WidgetOperationTypes.APPEND,
      element: (
        <Slot id="org.openedx.frontend.slot.footer.desktopCenterLink3.v1" layout={LabeledLinkColumn} />
      ),
    },
    {
      slotId: 'org.openedx.frontend.slot.footer.desktopCenterLinks.v1',
      id: 'default.footer.desktop.centerLinks.fourth',
      op: WidgetOperationTypes.APPEND,
      element: (
        <Slot id="org.openedx.frontend.slot.footer.desktopCenterLink4.v1" layout={LabeledLinkColumn} />
      ),
    },

    // Left Links
    {
      slotId: 'org.openedx.frontend.slot.footer.desktopLeftLinks.v1',
      id: 'default.footer.desktop.leftLinks.Logo',
      op: WidgetOperationTypes.APPEND,
      element: <Logo />,
    },

    // Right Links
    {
      slotId: 'org.openedx.frontend.slot.footer.desktopRightLinks.v1',
      id: 'default.footer.desktop.rightLinks.languageMenu',
      op: WidgetOperationTypes.APPEND,
      component: LanguageMenu,
    },

    // Copyright Notice
    {
      slotId: 'org.openedx.frontend.slot.footer.desktopLegalNotices.v1',
      id: 'default.footer.desktop.copyrightNotice',
      op: WidgetOperationTypes.APPEND,
      element: (
        <CopyrightNotice />
      ),
    }
  ]
};

export default config;
