interface BrandNavProps {
  studioBaseUrl: string,
  logo: string,
  logoAltText: string,
}

export default function BrandNav({ studioBaseUrl, logo, logoAltText }: BrandNavProps) {
  return (
    <a href={studioBaseUrl}>
      <img
        src={logo}
        alt={logoAltText}
        className="d-block logo"
      />
    </a>
  );
}
