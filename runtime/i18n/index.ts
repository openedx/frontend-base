/**
 * #### Import members from **@openedx/frontend-base**
 * The i18n module relies on react-intl and re-exports all of that package's exports.
 *
 * For each locale we want to support, react-intl needs the translations as an object holding
 * message id / translated string pairs.  A locale string and the messages object are passed into
 * the IntlProvider element that wraps your element hierarchy.  The locale data used to format
 * numbers, dates, and plurals comes from the runtime's built-in Intl APIs.
 *
 * Note that react-intl has no way of checking if the translations you give it actually have
 * anything to do with the locale you pass it; it will happily use whatever messages object you pass
 * in.
 *
 * Messages are provided to this module via the configureI18n() function below.
 *
 *
 * @module Internationalization
 * @see {@link https://github.com/openedx/frontend-base/blob/master/docs/how_tos/i18n.rst}
 * @see {@link https://formatjs.io/docs/react-intl/components/ Intl} for components exported from this module.
 *
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
  useIntl,
  type IntlConfig,
  type ResolvedIntlConfig,
  type IntlShape,
  type MessageDescriptor,
} from 'react-intl';

export {
  configureI18n,
  getLocale,
  getLocalizedLanguageName,
  getMessages,
  getPrimaryLanguageSubtag,
  getSupportedLanguageList,
  handleRtl,
  isRtl,
  LOCALE_CHANGED,
  LOCALE_TOPIC,
  mergeMessages,
  updateLocale,
} from './lib';

export { updateSiteLanguage } from './updateSiteLanguage';
