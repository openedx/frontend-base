import Slot from '../../runtime/slots/Slot';
import CenterLinks from './CenterLinks';
import LeftLinks from './LeftLinks';
import LegalNotices from './LegalNotices';
import PoweredBy from './PoweredBy';
import RevealLinks from './RevealLinks';
import RightLinks from './RightLinks';

export default function Footer() {
  return (
    <footer className="d-flex flex-column align-items-stretch">
      <Slot id="frontend.shell.footer.desktop.top.widget" layout={RevealLinks} />
      <div className="py-3 px-3 d-flex gap-5 justify-content-between align-items-stretch">
        <div className="flex-basis-0 d-flex align-items-start">
          <div className="d-flex gap-3 align-items-center">
            <Slot id="frontend.shell.footer.desktop.leftLinks.widget" layout={LeftLinks} />
          </div>
        </div>
        <div className="flex-grow-1 flex-basis-0 d-flex justify-content-center">
          <div className="d-flex flex-column justify-content-between gap-5">
            <Slot id="frontend.shell.footer.desktop.centerLinks.widget" layout={CenterLinks} />
            <Slot id="frontend.shell.footer.desktop.legalNotices.widget" layout={LegalNotices} />
          </div>
        </div>
        <div className="flex-basis-0 d-flex justify-content-end">
          <div className="d-flex flex-column justify-content-between">
            <Slot id="frontend.shell.footer.desktop.rightLinks.widget" layout={RightLinks} />
            <PoweredBy />
          </div>
        </div>
      </div>
    </footer>
  );
}
