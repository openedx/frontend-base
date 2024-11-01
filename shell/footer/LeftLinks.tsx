import { useContext } from 'react';

import FooterContext from './FooterContext';
import HyperlinkItem from './HyperlinkItem';

export default function LeftLinks() {
  const { leftLinks } = useContext(FooterContext);

  return (
    <div className="d-flex flex-column">
      {leftLinks.map((item, index) => (
        // TODO: Do something better than using the array index here.
        // eslint-disable-next-line react/no-array-index-key
        <HyperlinkItem key={index} item={item} />
      ))}
    </div>
  );
}
