import { Image, NavLink } from '@openedx/paragon';

import { useContext } from 'react';
import HeaderContext from './HeaderContext';

export default function Logo() {
  const { logoDestinationUrl, logoUrl } = useContext(HeaderContext);

  return (
    <NavLink href={logoDestinationUrl} className="p-0">
      <Image src={logoUrl} style={{ maxHeight: '2rem' }} />
    </NavLink>
  );
}
