import CenterLinks from './CenterLinks';
import useResolvedFooterConfig from './data/hooks';
import FooterContext from './FooterContext';
import LeftLinks from './LeftLinks';
import LegalNotices from './LegalNotices';
import PoweredBy from './PoweredBy';
import RevealLinks from './RevealLinks';
import RightLinks from './RightLinks';

export default function Footer() {
  const resolvedFooterConfig = useResolvedFooterConfig();

  return (
    <FooterContext.Provider value={resolvedFooterConfig}>
      <footer className="d-flex flex-column align-items-stretch">
        <RevealLinks />
        <div className="py-3 px-3 d-flex gap-5 justify-content-between align-items-stretch">
          <div className="flex-basis-0 d-flex align-items-start">
            <div className="d-flex gap-3 align-items-center">
              <LeftLinks />
            </div>
          </div>
          <div className="flex-grow-1 flex-basis-0 d-flex justify-content-center">
            <div className="d-flex flex-column justify-content-between gap-5">
              <CenterLinks />
              <LegalNotices />
            </div>
          </div>
          <div className="flex-basis-0 d-flex justify-content-end">
            <div className="d-flex flex-column justify-content-between">
              <RightLinks />
              <PoweredBy />
            </div>
          </div>
        </div>
      </footer>
    </FooterContext.Provider>
  );
}
