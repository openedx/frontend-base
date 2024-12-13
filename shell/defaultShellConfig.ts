import { App, WidgetOperationTypes } from '../types';
import Footer from './footer/Footer';
import { Header } from './header';

const config: App = {
  slots: [
    {
      slotId: 'frontend.shell.header.widget',
      id: 'default.header',
      op: WidgetOperationTypes.APPEND,
      component: Header,
    },
    {
      slotId: 'frontend.shell.footer.widget',
      id: 'default.footer',
      op: WidgetOperationTypes.APPEND,
      component: Footer,
    },
  ]
};

export default config;
