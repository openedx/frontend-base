import {
  getConfig,
  useIntl
} from '../../../runtime';

import messages from './DefaultFooter.messages';
import LanguageSelector from './LanguageSelector';

interface DefaultFooterProps {
  logo?: string,
  onLanguageSelected?: (languageCode: string) => void,
  supportedLanguages?: { label: string, value: string }[],
}

export default function DefaultFooter({ logo, onLanguageSelected, supportedLanguages = [] }: DefaultFooterProps) {
  const intl = useIntl();

  const showLanguageSelector = supportedLanguages.length > 0 && onLanguageSelected;

  return (
    <footer
      role="contentinfo"
      className="footer d-flex border-top py-3 px-4"
    >
      <div className="container-fluid d-flex">
        <a
          className="d-block"
          href={getConfig().LMS_BASE_URL}
          aria-label={intl.formatMessage(messages['footer.logo.ariaLabel'])}
        >
          <img
            style={{ maxHeight: 45 }}
            src={logo ?? getConfig().LOGO_TRADEMARK_URL}
            alt={intl.formatMessage(messages['footer.logo.altText'])}
          />
        </a>
        <div className="flex-grow-1" />
        {showLanguageSelector && (
          <LanguageSelector
            options={supportedLanguages}
            onSubmit={onLanguageSelected}
          />
        )}
      </div>
    </footer>
  );
}
