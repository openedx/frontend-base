import { Slot } from '../../runtime';
import CenterLinks from './CenterLinks';
import LeftLinks from './LeftLinks';
import LegalNotices from './LegalNotices';
import PoweredBy from './PoweredBy';
import RevealLinks from './RevealLinks';
import RightLinks from './RightLinks';

export default function Footer() {
  return (
    <footer className="d-flex flex-column align-items-stretch">
      <Slot id="org.openedx.frontend.slot.footer.desktopTop.v1" layout={RevealLinks} />
      <div className="py-3 px-3 d-flex gap-5 justify-content-between align-items-stretch">
        <div className="flex-basis-0 d-flex align-items-start">
          <div className="d-flex gap-3 align-items-center">
            <Slot id="org.openedx.frontend.slot.footer.desktopLeftLinks.v1" layout={LeftLinks} />
          </div>
        </div>
        <div className="flex-grow-1 flex-basis-0 d-flex justify-content-center">
          <div className="d-flex flex-column justify-content-between gap-5">
            <Slot id="org.openedx.frontend.slot.footer.desktopCenterLinks.v1" layout={CenterLinks} />
            <Slot id="org.openedx.frontend.slot.footer.desktopLegalNotices.v1" layout={LegalNotices} />
          </div>
        </div>
        <div className="flex-basis-0 d-flex justify-content-end">
          <div className="d-flex flex-column justify-content-between">
            <Slot id="org.openedx.frontend.slot.footer.desktopRightLinks.v1" layout={RightLinks} />
            <PoweredBy />
          </div>
        </div>
      </div>
    </footer>
  );
}
