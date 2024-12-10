import classNames from 'classnames';
import Slot from '../../../runtime/slots/Slot';

interface AnonymousMenuProps {
  className?: string,
}

export default function AnonymousMenu({ className }: AnonymousMenuProps) {
  return (
    <div className={classNames('d-flex flex-nowrap align-items-center flex-shrink-0 gap-3', className)}>
      <Slot id="frontend.shell.header.anonymousMenu.widget" />
    </div>
  );
}
