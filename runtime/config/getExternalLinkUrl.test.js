import { getExternalLinkUrl, setSiteConfig } from '.';

describe('getExternalLinkUrl', () => {
  afterEach(() => {
    // Reset config after each test to avoid cross-test pollution
    setSiteConfig({});
  });

  it('should return the url passed in when externalLinkUrlOverrides is not set', () => {
    setSiteConfig({});
    const url = 'https://foo.example.com';
    expect(getExternalLinkUrl(url)).toBe(url);
  });

  it('should return the url passed in when externalLinkUrlOverrides does not have the url mapping', () => {
    setSiteConfig({
      externalLinkUrlOverrides: {
        'https://bar.example.com': 'https://mapped.example.com',
      },
    });
    const url = 'https://foo.example.com';
    expect(getExternalLinkUrl(url)).toBe(url);
  });

  it('should return the mapped url when externalLinkUrlOverrides has the url mapping', () => {
    const url = 'https://foo.example.com';
    const mappedUrl = 'https://mapped.example.com';
    setSiteConfig({ externalLinkUrlOverrides: { [url]: mappedUrl } });
    expect(getExternalLinkUrl(url)).toBe(mappedUrl);
  });

  it('should handle empty externalLinkUrlOverrides object', () => {
    setSiteConfig({ externalLinkUrlOverrides: {} });
    const url = 'https://foo.example.com';
    expect(getExternalLinkUrl(url)).toBe(url);
  });

  it('should guard against empty string argument', () => {
    const fallbackResult = '#';
    setSiteConfig({ externalLinkUrlOverrides: { foo: 'bar' } });
    expect(getExternalLinkUrl(undefined)).toBe(fallbackResult);
  });

  it('should guard against non-string argument', () => {
    const fallbackResult = '#';
    setSiteConfig({ externalLinkUrlOverrides: { foo: 'bar' } });
    expect(getExternalLinkUrl(null)).toBe(fallbackResult);
    expect(getExternalLinkUrl(42)).toBe(fallbackResult);
  });

  it('should not throw if externalLinkUrlOverrides is not an object', () => {
    setSiteConfig({ externalLinkUrlOverrides: null });
    const url = 'https://foo.example.com';
    expect(getExternalLinkUrl(url)).toBe(url);
    setSiteConfig({ externalLinkUrlOverrides: 42 });
    expect(getExternalLinkUrl(url)).toBe(url);
  });

  it('should work with multiple mappings', () => {
    setSiteConfig({
      externalLinkUrlOverrides: {
        'https://a.example.com': 'https://mapped-a.example.com',
        'https://b.example.com': 'https://mapped-b.example.com',
      },
    });
    expect(getExternalLinkUrl('https://a.example.com')).toBe(
      'https://mapped-a.example.com',
    );
    expect(getExternalLinkUrl('https://b.example.com')).toBe(
      'https://mapped-b.example.com',
    );
    expect(getExternalLinkUrl('https://c.example.com')).toBe(
      'https://c.example.com',
    );
  });
});
