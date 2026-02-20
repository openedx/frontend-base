import { IntlProvider } from 'react-intl';
import { Hyperlink, Image } from '@openedx/paragon';
import { getSiteConfig } from '../runtime/config';

interface LogoProps {
  imageUrl?: string,
  destinationUrl?: string,
}

export default function Logo({
  imageUrl = getSiteConfig().headerLogoImageUrl ?? 'https://edx-cdn.org/v3/default/logo.svg',
  destinationUrl
}: LogoProps) {
  const image = (
    <Image src={imageUrl} style={{ maxHeight: '2rem' }} />
  );

  if (destinationUrl === undefined) {
    return image;
  }

  return (
    <IntlProvider locale="en">
      <Hyperlink destination={destinationUrl} className="p-0">
        {image}
      </Hyperlink>
    </IntlProvider>
  );
}
