import { useContext } from 'react';

import MenuItem from '../menus/MenuItem';
import FooterContext from './FooterContext';

export default function LeftLinks() {
  const { leftLinks } = useContext(FooterContext);

  return (
    <div className="d-flex flex-column">
      {leftLinks.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}
    </div>
  );
}
