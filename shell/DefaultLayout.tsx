import Slot from '../runtime/slots/Slot';
import DefaultMain from './DefaultMain';

export default function DefaultLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="flex-grow-0 flex-shrink-0">
        <Slot id="frontend.shell.header.widget" />
      </div>
      <div id="main-content" className="flex-grow-1">
        <Slot id="frontend.shell.main.widget" layout={DefaultMain} />
      </div>
      <div className="flex-grow-0 flex-shrink-0">
        <Slot id="frontend.shell.footer.widget" />
      </div>
    </div>
  );
}
