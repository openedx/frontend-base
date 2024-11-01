import { useContext } from 'react';

import FooterContext from './FooterContext';
import LinkGrid from './LinkGrid';

export default function CenterLinks() {
  const { centerLinks } = useContext(FooterContext);

  return (
    <LinkGrid items={centerLinks} />
  );
}
