import { WidgetOperationTypes } from '../../runtime';
import Slot from '../../runtime/slots/Slot';
import { App } from '../../types';
import Logo from '../Logo';
import CopyrightNotice from './CopyrightNotice';
import LabeledLinkColumn from './LabeledLinkColumn';
import LanguageMenu from './LanguageMenu';

const config: App = {
  slots: [
    // Center links
    {
      slotId: 'frontend.shell.footer.desktop.centerLinks.ui',
      id: 'default.footer.desktop.centerLinks.first',
      op: WidgetOperationTypes.APPEND,
      element: (
        <Slot id="frontend.shell.footer.desktop.centerLinks.first.ui" layout={LabeledLinkColumn} />
      ),
    },
    {
      slotId: 'frontend.shell.footer.desktop.centerLinks.ui',
      id: 'default.footer.desktop.centerLinks.second',
      op: WidgetOperationTypes.APPEND,
      element: (
        <Slot id="frontend.shell.footer.desktop.centerLinks.second.ui" layout={LabeledLinkColumn} />
      ),
    },
    {
      slotId: 'frontend.shell.footer.desktop.centerLinks.ui',
      id: 'default.footer.desktop.centerLinks.third',
      op: WidgetOperationTypes.APPEND,
      element: (
        <Slot id="frontend.shell.footer.desktop.centerLinks.third.ui" layout={LabeledLinkColumn} />
      ),
    },
    {
      slotId: 'frontend.shell.footer.desktop.centerLinks.ui',
      id: 'default.footer.desktop.centerLinks.fourth',
      op: WidgetOperationTypes.APPEND,
      element: (
        <Slot id="frontend.shell.footer.desktop.centerLinks.fourth.ui" layout={LabeledLinkColumn} />
      ),
    },

    // Left Links
    {
      slotId: 'frontend.shell.footer.desktop.leftLinks.ui',
      id: 'default.footer.desktop.leftLinks.Logo',
      op: WidgetOperationTypes.APPEND,
      element: <Logo />,
    },

    // Right Links
    {
      slotId: 'frontend.shell.footer.desktop.rightLinks.ui',
      id: 'default.footer.desktop.rightLinks.languageMenu',
      op: WidgetOperationTypes.APPEND,
      component: LanguageMenu,
    },

    // Copyright Notice
    {
      slotId: 'frontend.shell.footer.desktop.legalNotices.ui',
      id: 'default.footer.desktop.copyrightNotice',
      op: WidgetOperationTypes.APPEND,
      element: (
        <CopyrightNotice />
      ),
    }
  ]
};

export default config;
