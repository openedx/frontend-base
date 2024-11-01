import classNames from 'classnames';
import { useContext } from 'react';
import HeaderContext from '../HeaderContext';
import NavLinkItem from '../nav-links/NavLinkItem';

interface AnonymousMenuProps {
  className?: string,
}

export default function AnonymousMenu({ className }: AnonymousMenuProps) {
  const { anonymousLinks } = useContext(HeaderContext);

  return (
    <div className={classNames('d-flex flex-nowrap align-items-center flex-shrink-0 gap-3', className)}>
      {anonymousLinks.map((item, index) => (
        // TODO: Do something better than using the array index here.
        // eslint-disable-next-line react/no-array-index-key
        <NavLinkItem key={index} item={item} />
      ))}
    </div>
  );
}
