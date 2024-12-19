import { Button } from '@openedx/paragon';

import { useConfig, useIntl } from '../../../runtime';
import messages from '../../Shell.messages';

export default function RegisterButton({ ...props }) {
  const config = useConfig();
  const intl = useIntl();

  return (
    <Button size="sm" variant="outline-primary" href={`${config.lmsBaseUrl}/register`} {...props}>
      {intl.formatMessage(messages['header.user.menu.register'])}
    </Button>
  );
}
