import { Button } from '@openedx/paragon';
import { useSiteConfig, useIntl } from '../../../runtime';
import messages from '../../Shell.messages';

export default function LoginButton({ ...props }) {
  const config = useSiteConfig();
  const intl = useIntl();

  return (
    <Button size="sm" href={config.loginUrl} {...props}>
      {intl.formatMessage(messages['header.user.menu.login'])}
    </Button>
  );
}
