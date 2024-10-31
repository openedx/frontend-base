import merge from 'lodash.merge';
import PropTypes from 'prop-types';
import { MessageFormatElement } from 'react-intl';
import Cookies from 'universal-cookie';

import { getConfig } from '../config';
import { publish } from '../subscriptions';

const cookies = new Cookies();
const rtlLocales = [
  'ar', // Arabic
  'he', // Hebrew
  'fa', // Farsi (not currently supported)
  'fa-ir', // Farsi Iran
  'ur', // Urdu (not currently supported)
];

let messages: Record<string, Record<string, string> | Record<string, MessageFormatElement[]> | undefined>;

/**
 * @memberof module:Internationalization
 *
 * Prior versions of react-intl (our primary implementation of the i18n service) included a
 * PropTypes-based 'shape' for its `intl` object.  This has since been removed.  For legacy
 * compatibility, we include an `intlShape` export that is set to PropTypes.object.  Usage of this
 * export is deprecated.
 *
 * @deprecated
 */
export const intlShape = PropTypes.object;

/**
 * @memberof module:Internationalization
 */
export const LOCALE_TOPIC = 'LOCALE';

/**
 * @memberof module:Internationalization
 */
export const LOCALE_CHANGED = `${LOCALE_TOPIC}.CHANGED`;

/**
 *
 * @memberof module:Internationalization
 * @returns {Cookies}
 */
export function getCookies() {
  return cookies;
}

/**
 * Some of our dependencies function on primary language subtags, rather than full locales.
 * This function strips a locale down to that first subtag.  Depending on the code, this
 * may be 2 or more characters.
 *
 * @param {string} code
 * @memberof module:Internationalization
 */
export function getPrimaryLanguageSubtag(code) {
  return code.split('-')[0];
}

/**
 * Finds the closest supported locale to the one provided.  This is done in three steps:
 *
 * 1. Returning the locale itself if its exact language code is supported.
 * 2. Returning the primary language subtag of the language code if it is supported (ar for ar-eg,
 * for instance).
 * 3. Returning 'en' if neither of the above produce a supported locale.
 *
 * @param {string} locale
 * @returns {string}
 * @memberof module:Internationalization
 */
export function findSupportedLocale(locale) {
  if (messages === undefined) {
    throw new Error('findSupportedLocale called before configuring i18n. Call configure with messages first.');
  }

  if (messages[locale] !== undefined) {
    return locale;
  }

  if (messages[getPrimaryLanguageSubtag(locale)] !== undefined) {
    return getPrimaryLanguageSubtag(locale);
  }

  return 'en';
}

/**
 * Get the locale from the cookie or, failing that, the browser setting.
 * Gracefully fall back to a more general primary language subtag or to English (en)
 * if we don't support that language.
 *
 * @param {string|undefined} locale If a locale is provided, returns the closest supported locale. Optional.
 * @throws An error if i18n has not yet been configured.
 * @returns {string}
 * @memberof module:Internationalization
 */
export function getLocale(locale?: string) {
  if (messages === null) {
    throw new Error('getLocale called before configuring i18n. Call configure with messages first.');
  }

  // 1. Explicit application request
  if (locale !== undefined) {
    return findSupportedLocale(locale);
  }
  // 2. User setting in cookie

  const cookieLangPref = cookies.get(getConfig().LANGUAGE_PREFERENCE_COOKIE_NAME);
  if (cookieLangPref) {
    return findSupportedLocale(cookieLangPref.toLowerCase());
  }
  // 3. Browser language (default)
  // Note that some browers prefer upper case for the region part of the locale, while others don't.
  // Thus the toLowerCase, for consistency.
  // https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/language
  return findSupportedLocale(globalThis.navigator.language.toLowerCase());
}

export function getLocalizedLanguageName(locale) {
  const localizedName = (new Intl.DisplayNames([locale], { type: 'language' })).of(locale);

  if (localizedName === undefined) {
    throw new Error(`Unsupported locale: ${locale}`);
  }

  return `${localizedName.charAt(0).toLocaleUpperCase(locale)}${localizedName.slice(1)}`;
}

export function getSupportedLanguageList() {
  const locales = Object.keys(messages);
  locales.push('en'); // 'en' is not in the messages object because it's the default.
  locales.sort();

  return locales.map((locale) => ({
    code: locale,
    name: getLocalizedLanguageName(locale),
  }));
}

export function updateLocale() {
  handleRtl();
  publish(LOCALE_CHANGED);
}

/**
 * Returns messages for the provided locale, or the user's preferred locale if no argument is
 * provided.
 *
 * @param {string} [locale=getLocale()]
 * @memberof module:Internationalization
 */
export function getMessages(locale = getLocale()) {
  if (messages === undefined) {
    throw new Error('getMessages called before configuring i18n. Call configure with messages first.');
  }

  return messages[locale];
}

/**
 * Determines if the provided locale is a right-to-left language.
 *
 * @param {string} locale
 * @memberof module:Internationalization
 */
export function isRtl(locale) {
  return rtlLocales.includes(locale);
}

/**
 * Handles applying the RTL stylesheet and "dir=rtl" attribute to the html tag if the current locale
 * is a RTL language.
 *
 * @memberof module:Internationalization
 */
export function handleRtl() {
  if (isRtl(getLocale())) {
    globalThis.document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');
  } else {
    globalThis.document.getElementsByTagName('html')[0].setAttribute('dir', 'ltr');
  }
}

/**
 *
 *
 * @param {Object} newMessages
 * @returns {Object}
 * @memberof module:Internationalization
 */
export function mergeMessages(newMessages) {
  const msgs = Array.isArray(newMessages) ? merge({}, ...newMessages) : newMessages;
  messages = merge(messages, msgs);

  return messages;
}

interface ConfigureI18nOptions {
  messages: Record<string, Record<string, string>>[] | Record<string, Record<string, string>>,
}

/**
 * Configures the i18n library with messages for your application.
 *
 * Logs a warning if it detects a locale it doesn't expect (as defined by the supportedLocales list
 * above), or if an expected locale is not provided.
 *
 * @param {Object} options
 * @param {Object} options.messages
 * @memberof module:Internationalization
 */
export function configure(options: ConfigureI18nOptions) {
  messages = Array.isArray(options.messages) ? merge({}, ...options.messages) : options.messages;

  handleRtl();
}
