import Slot from '../../runtime/slots/Slot';
import { App, WidgetOperationTypes } from '../../types';
import CopyrightNotice from './CopyrightNotice';
import LabeledLinkColumn from './LabeledLinkColumn';
import LanguageMenu from './LanguageMenu';
import Logo from './Logo';

const config: App = {
  slots: [
    // Center links
    {
      slotId: 'frontend.shell.footer.desktop.centerLinks.widget',
      id: 'default.footer.desktop.centerLinks.first',
      op: WidgetOperationTypes.APPEND,
      element: (
        <Slot id="frontend.shell.footer.desktop.centerLinks.first.widget" layout={LabeledLinkColumn} />
      ),
    },
    {
      slotId: 'frontend.shell.footer.desktop.centerLinks.widget',
      id: 'default.footer.desktop.centerLinks.second',
      op: WidgetOperationTypes.APPEND,
      element: (
        <Slot id="frontend.shell.footer.desktop.centerLinks.second.widget" layout={LabeledLinkColumn} />
      ),
    },
    {
      slotId: 'frontend.shell.footer.desktop.centerLinks.widget',
      id: 'default.footer.desktop.centerLinks.third',
      op: WidgetOperationTypes.APPEND,
      element: (
        <Slot id="frontend.shell.footer.desktop.centerLinks.third.widget" layout={LabeledLinkColumn} />
      ),
    },
    {
      slotId: 'frontend.shell.footer.desktop.centerLinks.widget',
      id: 'default.footer.desktop.centerLinks.fourth',
      op: WidgetOperationTypes.APPEND,
      element: (
        <Slot id="frontend.shell.footer.desktop.centerLinks.fourth.widget" layout={LabeledLinkColumn} />
      ),
    },

    // Left Links
    {
      slotId: 'frontend.shell.footer.desktop.leftLinks.widget',
      id: 'default.footer.desktop.leftLinks.Logo',
      op: WidgetOperationTypes.APPEND,
      element: <Logo />,
    },

    // Right Links
    {
      slotId: 'frontend.shell.footer.desktop.rightLinks.widget',
      id: 'default.footer.desktop.rightLinks.languageMenu',
      op: WidgetOperationTypes.APPEND,
      component: LanguageMenu,
    },

    // Copyright Notice
    {
      slotId: 'frontend.shell.footer.desktop.legalNotices.widget',
      id: 'default.footer.desktop.copyrightNotice',
      op: WidgetOperationTypes.APPEND,
      element: (
        <CopyrightNotice />
      ),
    }
  ]
};

export default config;
