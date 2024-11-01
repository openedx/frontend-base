// TODO: Do something better than using the array index here.
/* eslint-disable react/no-array-index-key */
import { LabeledMenu } from '../../types';
import LinkGridItem from './LinkGridItem';

interface LinkGridProps {
  items: LabeledMenu[],
}
export default function LinkGrid({ items }: LinkGridProps) {
  return (
    <div className="d-flex flex-wrap column-gap-6 row-gap-4">
      {items.map((menu, subItemsIndex) => (
        <div key={subItemsIndex} className="d-flex flex-grow-1 flex-column gap-2 small">
          <div className="mb-1 font-weight-bold">{menu.label}</div>
          {menu.links.map((item, index) => (
            <LinkGridItem key={index} item={item} />
          ))}
        </div>
      ))}
    </div>
  );
}
