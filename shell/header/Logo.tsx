import { Hyperlink, Image } from '@openedx/paragon';

interface LogoProps {
  imageUrl?: string,
  destinationUrl?: string | null,
}

export default function Logo({
  imageUrl = 'https://edx-cdn.org/v3/default/logo.svg',
  destinationUrl = null
}: LogoProps) {
  const image = (
    <Image src={imageUrl} style={{ maxHeight: '2rem' }} />
  );

  if (destinationUrl === null) {
    return image;
  }

  return (
    <Hyperlink destination={destinationUrl} className="p-0">
      {image}
    </Hyperlink>
  );
}
