interface LogoProps {
  src: string,
  alt: string
}

export default function Logo({ src, alt, ...attributes }: LogoProps) {
  return (
    <img src={src} alt={alt} {...attributes} />
  );
}
