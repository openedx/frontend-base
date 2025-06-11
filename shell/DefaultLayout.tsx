import { Slot } from '../runtime';
import DefaultMain from './DefaultMain';

export default function DefaultLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="flex-grow-0 flex-shrink-0">
        <Slot id="org.openedx.frontend.slot.header.main.v1" />
      </div>
      <div id="main-content" className="flex-grow-1">
        <Slot id="org.openedx.frontend.slot.content.main.v1" layout={DefaultMain} />
      </div>
      <div className="flex-grow-0 flex-shrink-0">
        <Slot id="org.openedx.frontend.slot.footer.main.v1" />
      </div>
    </div>
  );
}
