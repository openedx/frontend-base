interface LinkedLogoProps {
  href: string,
  src: string,
  alt: string,
  [key: string]: any,
}

export default function LinkedLogo({
  href,
  src,
  alt,
  ...props
}: LinkedLogoProps) {
  return (
    <a href={href} {...props}>
      <img className="d-block" src={src} alt={alt} />
    </a>
  );
}
