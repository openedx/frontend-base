import { App, SlotOperationTypes } from '../types';
import Footer from './footer/Footer';
import { Header } from './header';

const config: App = {
  slots: [
    {
      slotId: 'frontend.shell.header.widget',
      id: 'default.header',
      op: SlotOperationTypes.APPEND,
      component: Header,
    },
    {
      slotId: 'frontend.shell.footer.widget',
      id: 'default.footer',
      op: SlotOperationTypes.APPEND,
      component: Footer,
    },
  ]
};

export default config;
