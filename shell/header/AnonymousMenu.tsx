import { Button } from '@openedx/paragon';

import classNames from 'classnames';
import { useConfig, useIntl } from '../../runtime';
import messages from './Header.messages';

interface AnonymousMenuProps {
  className?: string,
}

export default function AnonymousMenu({ className }: AnonymousMenuProps) {
  const config = useConfig();
  const intl = useIntl();

  return (
    <div className={classNames('d-flex align-items-center flex-shrink-0', className)} style={{ gap: '1rem' }}>
      <Button size="sm" href={config.LOGIN_URL}>
        {intl.formatMessage(messages['header.user.menu.login'])}
      </Button>
      <Button size="sm" variant="outline-primary flex-nowrap" href={`${config.LMS_BASE_URL}/register`}>
        {intl.formatMessage(messages['header.user.menu.register'])}
      </Button>
    </div>
  );
}
