import { Slot } from '../runtime';
import DefaultMain from './DefaultMain';

export default function DefaultLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="flex-grow-0 flex-shrink-0">
        <Slot id="frontend.shell.header.ui" />
      </div>
      <div id="main-content" className="flex-grow-1">
        <Slot id="frontend.shell.main.ui" layout={DefaultMain} />
      </div>
      <div className="flex-grow-0 flex-shrink-0">
        <Slot id="frontend.shell.footer.ui" />
      </div>
    </div>
  );
}
