import classNames from 'classnames';
import { Slot } from '../../../runtime';

interface AnonymousMenuProps {
  className?: string,
}

export default function AnonymousMenu({ className }: AnonymousMenuProps) {
  return (
    <div className={classNames('d-flex flex-nowrap align-items-center flex-shrink-0 gap-3', className)}>
      <Slot id="org.openedx.frontend.slot.header.anonymousMenu.v1" />
    </div>
  );
}
