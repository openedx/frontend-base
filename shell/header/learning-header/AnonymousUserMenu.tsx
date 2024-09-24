import { Button } from '@openedx/paragon';
import {
  getConfig, getLoginRedirectUrl,
  useIntl
} from '../../../runtime';

import messages from './messages';

export default function AnonymousUserMenu() {
  const intl = useIntl();
  return (
    <div>
      <Button
        className="mr-3"
        variant="outline-primary"
        href={`${getConfig().LMS_BASE_URL}/register?next=${encodeURIComponent(global.location.href)}`}
      >
        {intl.formatMessage(messages.registerSentenceCase)}
      </Button>
      <Button
        variant="primary"
        href={`${getLoginRedirectUrl(global.location.href)}`}
      >
        {intl.formatMessage(messages.signInSentenceCase)}
      </Button>
    </div>
  );
}
