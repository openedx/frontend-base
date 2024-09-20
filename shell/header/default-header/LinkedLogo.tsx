interface LinkedLogoProps {
  href: string,
  src: string,
  alt: string,
}

export default function LinkedLogo({
  href,
  src,
  alt,
  ...attributes
}: LinkedLogoProps) {
  return (
    <a href={href} {...attributes}>
      <img className="d-block" src={src} alt={alt} />
    </a>
  );
}
