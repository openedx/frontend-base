import { IntlProvider } from 'react-intl';
import { Hyperlink, Image } from '@openedx/paragon';
import { getSiteConfig } from '../runtime/config';
import { getLinkProps, resolveRouteByRole } from '../runtime/routing';
import { homeRole } from './constants';

interface LogoProps {
  imageUrl?: string;
  destinationUrl?: string;
}

export default function Logo({
  imageUrl = getSiteConfig().headerLogoImageUrl ?? 'https://edx-cdn.org/v3/default/logo.svg',
  destinationUrl = resolveRouteByRole(homeRole)?.url ?? '/'
}: LogoProps) {
  const image = (
    <Image src={imageUrl} style={{ maxHeight: '2rem' }} />
  );

  if (destinationUrl === undefined) {
    return image;
  }

  // A path in this site is a react-router Link, so the navigation stays in the client.
  return (
    <IntlProvider locale="en">
      <Hyperlink {...getLinkProps(destinationUrl)} className="p-0">
        {image}
      </Hyperlink>
    </IntlProvider>
  );
}
