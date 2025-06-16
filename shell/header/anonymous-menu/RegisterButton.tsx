import { Button } from '@openedx/paragon';

import { useSiteConfig, useIntl } from '../../../runtime';
import messages from '../../Shell.messages';

export default function RegisterButton({ ...props }) {
  const config = useSiteConfig();
  const intl = useIntl();

  return (
    <Button size="sm" variant="outline-primary" href={`${config.lmsBaseUrl}/register`} {...props}>
      {intl.formatMessage(messages['header.user.menu.register'])}
    </Button>
  );
}
