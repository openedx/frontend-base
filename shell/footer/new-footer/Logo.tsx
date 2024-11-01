import { Hyperlink, Image } from '@openedx/paragon';
import { useContext } from 'react';
import FooterContext from './FooterContext';

export default function Logo() {
  const { logoDestinationUrl, logoUrl } = useContext(FooterContext);

  const image = (
    <Image src={logoUrl} style={{ maxHeight: '2rem' }} />
  );

  if (logoDestinationUrl === null) {
    return image;
  }

  return (
    <Hyperlink destination={logoDestinationUrl} className="p-0">
      {image}
    </Hyperlink>
  );
}
