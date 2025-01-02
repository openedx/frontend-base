import { useIntl } from 'react-intl';

import { useWidgets } from '../../runtime';
import messages from '../Shell.messages';

export default function LegalNotices() {
  const intl = useIntl();
  const widgets = useWidgets();

  return (
    <div className="d-flex flex-column justify-content-center mb-3">
      {widgets}
      {/* This footer trademark notice is a legal requirement and cannot be removed or modified. */}
      <div className="text-center x-small">{intl.formatMessage(messages.footerTrademarkNotice)}</div>
    </div>
  );
}
