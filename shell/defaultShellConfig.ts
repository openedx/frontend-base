import { WidgetOperationTypes } from '../runtime';
import { App } from '../types';
import Footer from './footer/Footer';
import { Header } from './header';

const config: App = {
  slots: [
    {
      slotId: 'org.openedx.frontend.slot.header.main.v1',
      id: 'org.openedx.frontend.widget.defaultHeader.main.v1',
      op: WidgetOperationTypes.APPEND,
      component: Header,
    },
    {
      slotId: 'org.openedx.frontend.slot.footer.main.v1',
      id: 'org.openedx.frontend.widget.defaultFooter.main.v1',
      op: WidgetOperationTypes.APPEND,
      component: Footer,
    },
  ]
};

export default config;
