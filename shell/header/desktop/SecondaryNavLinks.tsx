import { useContext } from 'react';
import HeaderContext from '../HeaderContext';
import NavLinks from '../nav-links';

export default function SecondaryNavLinks() {
  const { secondaryLinks } = useContext(HeaderContext);

  return (
    <NavLinks items={secondaryLinks} className="flex-nowrap" />
  );
}
