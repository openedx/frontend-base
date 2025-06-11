import classNames from 'classnames';
import { useMediaQuery } from 'react-responsive';
import { Slot } from '../../../runtime';

export default function DesktopLayout() {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className={classNames(
      'align-items-center justify-content-between px-3',
      isMobile ? 'd-none' : 'd-flex'
    )}
    >
      <div className="d-flex flex-grow-1 align-items-center">
        <Slot id="org.openedx.frontend.slot.header.desktopLeft.v1" />
      </div>
      <div className="d-flex align-items-center">
        <Slot id="org.openedx.frontend.slot.header.desktopRight.v1" />
      </div>
    </div>
  );
}
