import {
  AppProvider
} from '../runtime';
import Slot from '../runtime/slots/Slot';
import DefaultLayout from './DefaultLayout';

export default function Shell() {
  return (
    <AppProvider>
      <Slot id="frontend.shell.layout.widget" layout={DefaultLayout} />
    </AppProvider>
  );
}
