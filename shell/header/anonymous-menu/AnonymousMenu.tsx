import classNames from 'classnames';
import { useContext } from 'react';
import MenuItem from '../../menus/MenuItem';
import HeaderContext from '../HeaderContext';

interface AnonymousMenuProps {
  className?: string,
}

export default function AnonymousMenu({ className }: AnonymousMenuProps) {
  const { anonymousLinks } = useContext(HeaderContext);

  return (
    <div className={classNames('d-flex flex-nowrap align-items-center flex-shrink-0 gap-3', className)}>
      {anonymousLinks.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}
    </div>
  );
}
