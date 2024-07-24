import { Button } from '@openedx/paragon';
import {
  getConfig, getLoginRedirectUrl, injectIntl, intlShape
} from '../../../runtime';

import genericMessages from '../generic/messages';

const AnonymousUserMenu = ({ intl }) => (
  <div>
    <Button
      className="mr-3"
      variant="outline-primary"
      href={`${getConfig().LMS_BASE_URL}/register?next=${encodeURIComponent(global.location.href)}`}
    >
      {intl.formatMessage(genericMessages.registerSentenceCase)}
    </Button>
    <Button
      variant="primary"
      href={`${getLoginRedirectUrl(global.location.href)}`}
    >
      {intl.formatMessage(genericMessages.signInSentenceCase)}
    </Button>
  </div>
);

AnonymousUserMenu.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(AnonymousUserMenu);
