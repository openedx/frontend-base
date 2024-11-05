import { useContext } from 'react';
import { Divider } from '../../../runtime';
import { createComponentMenuItem } from '../../menus/data/configHelpers';
import HeaderContext from '../HeaderContext';
import NavLinks from '../nav-links';

export default function MobileNavLinks() {
  const { primaryLinks, secondaryLinks } = useContext(HeaderContext);

  const allLinks = [
    ...primaryLinks,
  ];

  if (primaryLinks.length > 0 && secondaryLinks.length > 0) {
    allLinks.push(createComponentMenuItem(<Divider />));
  }

  allLinks.push(...secondaryLinks);

  return (
    <NavLinks items={allLinks} className="flex-column" />
  );
}
