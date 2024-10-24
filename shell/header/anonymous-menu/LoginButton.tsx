import { Button } from '@openedx/paragon';
import { useConfig, useIntl } from '../../../runtime';
import messages from '../../Shell.messages';

export default function LoginButton({ ...props }) {
  const config = useConfig();
  const intl = useIntl();

  return (
    <Button size="sm" href={config.LOGIN_URL} {...props}>
      {intl.formatMessage(messages['header.user.menu.login'])}
    </Button>
  );
}
