import {
  configure,
  getCookies,
  getLocale,
  getMessages,
  getPrimaryLanguageSubtag,
  handleRtl,
  isRtl,
  patchMessages,
} from './lib';

jest.mock('universal-cookie');

describe('lib', () => {
  describe('getPrimaryLanguageSubtag', () => {
    it('should work for primary language subtags', () => {
      expect(getPrimaryLanguageSubtag('en')).toEqual('en');
      expect(getPrimaryLanguageSubtag('ars')).toEqual('ars');
      expect(getPrimaryLanguageSubtag('a')).toEqual('a');
    });

    it('should work for longer language codes', () => {
      expect(getPrimaryLanguageSubtag('en-us')).toEqual('en');
      expect(getPrimaryLanguageSubtag('es-419')).toEqual('es');
      expect(getPrimaryLanguageSubtag('zh-hans-CN')).toEqual('zh');
    });
  });

  describe('getLocale', () => {
    beforeEach(() => {
      configure({
        messages: {
          'es-419': {},
          de: {},
          'en-us': {},
        },
      });
    });

    it('should return a supported locale as supplied', () => {
      expect(getLocale('es-419')).toEqual('es-419');
      expect(getLocale('en-us')).toEqual('en-us');
    });

    it('should return the supported primary language tag of a not-quite-supported locale', () => {
      expect(getLocale('de-de')).toEqual('de');
    });

    it('should return en if the locale is not supported at all', () => {
      expect(getLocale('oh-no')).toEqual('en');
    });

    it('should look up a locale in the language preference cookie if one was not supplied', () => {
      getCookies().get = jest.fn(() => 'es-419');
      expect(getLocale()).toEqual('es-419');

      getCookies().get = jest.fn(() => 'pl');
      expect(getLocale()).toEqual('en');

      getCookies().get = jest.fn(() => 'de-bah');
      expect(getLocale()).toEqual('de');
    });
    it('should fallback to the browser locale if the cookie does not exist', () => {
      getCookies().get = jest.fn(() => null);
      expect(getLocale()).toEqual(global.navigator.language.toLowerCase());
    });
  });

  describe('getMessages', () => {
    beforeEach(() => {
      configure({
        messages: {
          'es-419': { message: 'es-hah' },
          de: { message: 'de-hah' },
          'en-us': { message: 'en-us-hah' },
        },
      });

      getCookies().get = jest.fn(() => 'es-419'); // Means the cookie will be set to es-419
    });

    it('should return the messages for the provided locale', () => {
      expect(getMessages('en-us').message).toEqual('en-us-hah');
    });

    it('should return the messages for the preferred locale if no argument is passed', () => {
      expect(getMessages().message).toEqual('es-hah');
    });
  });

  describe('isRtl', () => {
    it('should be true for RTL languages', () => {
      expect(isRtl('ar')).toBe(true);
      expect(isRtl('he')).toBe(true);
      expect(isRtl('fa')).toBe(true);
      expect(isRtl('fa-ir')).toBe(true);
      expect(isRtl('ur')).toBe(true);
    });

    it('should be false for anything else', () => {
      expect(isRtl('en')).toBe(false);
      expect(isRtl('blah')).toBe(false);
      expect(isRtl('es-419')).toBe(false);
      expect(isRtl('de')).toBe(false);
      expect(isRtl('ru')).toBe(false);
    });
  });

  describe('handleRtl', () => {
    let setAttribute;
    beforeEach(() => {
      setAttribute = jest.fn();

      global.document.getElementsByTagName = jest.fn(() => [
        {
          setAttribute,
        },
      ]);
    });

    it('should do the right thing for non-RTL languages', () => {
      getCookies().get = jest.fn(() => 'es-419');
      configure({
        messages: {
          'es-419': { message: 'es-hah' },
        },
      });

      handleRtl();
      expect(setAttribute).toHaveBeenCalledWith('dir', 'ltr');
    });

    it('should do the right thing for RTL languages', () => {
      getCookies().get = jest.fn(() => 'ar');
      configure({
        messages: {
          ar: { message: 'ar-hah' },
        },
      });

      handleRtl();
      expect(setAttribute).toHaveBeenCalledWith('dir', 'rtl');
    });
  });
});

describe('patchMessages', () => {
  it('should merge objects', () => {
    configure({
      messages: {
        ar: { message: 'ar-hah' },
      },
    });
    const result = patchMessages({ en: { foo: 'bar' }, de: { buh: 'baz' }, jp: { gah: 'wut' } });
    expect(result).toEqual({
      ar: { message: 'ar-hah' },
      en: { foo: 'bar' },
      de: { buh: 'baz' },
      jp: { gah: 'wut' },
    });
  });

  it('should merge objects from an array', () => {
    configure({
      messages: {
        ar: { message: 'ar-hah' },
      },
    });
    const result = patchMessages([{ foo: 'bar' }, { buh: 'baz' }, { gah: 'wut' }]);
    expect(result).toEqual({
      ar: { message: 'ar-hah' },
      foo: 'bar',
      buh: 'baz',
      gah: 'wut',
    });
  });

  it('should merge nested objects from an array', () => {
    configure({
      messages: {
        en: { init: 'initial' },
        es: { init: 'inicial' },
      },
    });
    const messages = [
      {
        en: { hello: 'hello' },
        es: { hello: 'hola' },
      },
      {
        en: { goodbye: 'goodbye' },
        es: { goodbye: 'adiós' },
      },
    ];

    const result = patchMessages(messages);
    expect(result).toEqual({
      en: {
        init: 'initial',
        hello: 'hello',
        goodbye: 'goodbye',
      },
      es: {
        init: 'inicial',
        hello: 'hola',
        goodbye: 'adiós',
      },
    });
  });

  it('should return an empty object if no messages', () => {
    configure({
      messages: {},
    });
    expect(patchMessages(undefined)).toEqual({});
    expect(patchMessages(null)).toEqual({});
    expect(patchMessages([])).toEqual({});
    expect(patchMessages({})).toEqual({});
  });

  it('should return the original object if no messages', () => {
    configure({
      messages: { en: { hello: 'world ' } },
    });
    expect(patchMessages(undefined)).toEqual({ en: { hello: 'world ' } });
    expect(patchMessages(null)).toEqual({ en: { hello: 'world ' } });
    expect(patchMessages([])).toEqual({ en: { hello: 'world ' } });
    expect(patchMessages({})).toEqual({ en: { hello: 'world ' } });
  });
});
