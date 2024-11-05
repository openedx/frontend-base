import { useContext } from 'react';

import MenuItem from '../menus/MenuItem';
import FooterContext from './FooterContext';

export default function RightLinks() {
  const { rightLinks } = useContext(FooterContext);

  return (
    <div className="d-flex flex-column gap-3 align-items-end flex-grow-1 justify-content-between">
      {rightLinks.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}
    </div>
  );
}
