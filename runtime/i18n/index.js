/**
 * #### Import members from **@openedx/frontend-base**
 * The i18n module relies on react-intl and re-exports all of that package's exports.
 *
 * For each locale we want to support, react-intl needs 1) the locale-data, which includes
 * information about how to format numbers, handle plurals, etc., and 2) the translations, as an
 * object holding message id / translated string pairs.  A locale string and the messages object are
 * passed into the IntlProvider element that wraps your element hierarchy.
 *
 * Note that react-intl has no way of checking if the translations you give it actually have
 * anything to do with the locale you pass it; it will happily use whatever messages object you pass
 * in.  However, if the locale data for the locale you passed into the IntlProvider was not
 * correctly installed with addLocaleData, all of your translations will fall back to the default
 * (in our case English), *even if you gave IntlProvider the correct messages object for that
 * locale*.
 *
 * Messages are provided to this module via the configureI18n() function below.
 *
 *
 * @module Internationalization
 * @see {@link https://github.com/openedx/frontend-base/blob/master/docs/how_tos/i18n.rst}
 * @see {@link https://formatjs.io/docs/react-intl/components/ Intl} for components exported from this module.
 *
 */

/**
 * @name createIntl
 * @kind function
 * @see {@link https://formatjs.io/docs/react-intl/api#createIntl Intl}
 */

/**
 * @name FormattedDate
 * @kind class
 * @see {@link https://formatjs.io/docs/react-intl/components/#formatteddate Intl}
 */

/**
 * @name FormattedTime
 * @kind class
 * @see {@link https://formatjs.io/docs/react-intl/components/#formattedtime Intl}
 */

/**
 * @name FormattedRelativeTime
 * @kind class
 * @see {@link https://formatjs.io/docs/react-intl/components/#formattedrelativetime Intl}
 */

/**
 * @name FormattedNumber
 * @kind class
 * @see {@link https://formatjs.io/docs/react-intl/components/#formattednumber Intl}
 */

/**
 * @name FormattedPlural
 * @kind class
 * @see {@link https://formatjs.io/docs/react-intl/components/#formattedplural Intl}
 */

/**
 * @name FormattedMessage
 * @kind class
 * @see {@link https://formatjs.io/docs/react-intl/components/#formattedmessage Intl}
 */

/**
 * @name IntlProvider
 * @kind class
 * @see {@link https://formatjs.io/docs/react-intl/components/#intlprovider Intl}
 */

/**
 * @name defineMessages
 * @kind function
 * @see {@link https://formatjs.io/docs/react-intl/api#definemessagesdefinemessage Intl}
 */

/**
 * @name useIntl
 * @kind function
 * @see {@link https://formatjs.io/docs/react-intl/api#useIntl Intl}
 */

export {
  createIntl,
  defineMessages,
  FormattedDate,
  FormattedMessage,
  FormattedNumber,
  FormattedPlural,
  FormattedRelativeTime,
  FormattedTime,
  IntlProvider,
  useIntl
} from 'react-intl';

export {
  addAppMessages,
  configureI18n,
  getLocale,
  getLocalizedLanguageName,
  getMessages,
  getPrimaryLanguageSubtag,
  getSupportedLanguageList,
  handleRtl,
  intlShape,
  isRtl,
  LOCALE_CHANGED,
  LOCALE_TOPIC,
  mergeMessages,
  updateLocale
} from './lib';

export {
  default as injectIntl
} from './injectIntlWithShim';
