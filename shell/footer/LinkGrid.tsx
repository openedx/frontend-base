import { LabeledMenuConfig } from '../../types';
import MenuItem from '../menus/MenuItem';

interface LinkGridProps {
  items: LabeledMenuConfig[],
}
export default function LinkGrid({ items }: LinkGridProps) {
  return (
    <div className="d-flex flex-wrap column-gap-6 row-gap-4">
      {items.map((menu) => (
        <div key={menu.id} className="d-flex flex-grow-1 flex-column gap-2 small">
          <div className="mb-1 font-weight-bold">{menu.label}</div>
          {menu.links.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </div>
      ))}
    </div>
  );
}
