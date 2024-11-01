import { useContext } from 'react';
import { useIntl } from 'react-intl';

import messages from '../Shell.messages';
import FooterContext from './FooterContext';

export default function LegalNotices() {
  const intl = useIntl();
  const { copyrightNotice } = useContext(FooterContext);

  return (
    <div className="text-center x-small mb-3">
      {copyrightNotice}&nbsp;
      {/* This footer trademark notice is a legal requirement and cannot be removed or modified. */}
      {intl.formatMessage(messages.footerTrademarkNotice)}
    </div>
  );
}
