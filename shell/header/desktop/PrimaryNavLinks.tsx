import { useContext } from 'react';
import HeaderContext from '../HeaderContext';
import NavLinks from '../nav-links';

export default function PrimaryNavLinks() {
  const { primaryLinks } = useContext(HeaderContext);

  return (
    <NavLinks items={primaryLinks} className="flex-nowrap" />
  );
}
