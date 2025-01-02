import {
  AppProvider,
  Slot
} from '../runtime';

import DefaultLayout from './DefaultLayout';

export default function Shell() {
  return (
    <AppProvider>
      <Slot id="frontend.shell.layout.ui" layout={DefaultLayout} />
    </AppProvider>
  );
}
