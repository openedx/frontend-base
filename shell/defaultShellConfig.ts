import { WidgetOperationTypes } from '../runtime';
import { App } from '../types';
import Footer from './footer/Footer';
import { Header } from './header';

const config: App = {
  slots: [
    {
      slotId: 'frontend.shell.header.ui',
      id: 'default.header',
      op: WidgetOperationTypes.APPEND,
      component: Header,
    },
    {
      slotId: 'frontend.shell.footer.ui',
      id: 'default.footer',
      op: WidgetOperationTypes.APPEND,
      component: Footer,
    },
  ]
};

export default config;
