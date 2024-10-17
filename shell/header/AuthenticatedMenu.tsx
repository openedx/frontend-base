import { Dropdown, DropdownButton } from '@openedx/paragon';
import { Person } from '@openedx/paragon/icons';
import {
  useAuthenticatedUser, useConfig, useIntl
} from '../../runtime';
import messages from './Header.messages';

interface AuthenticatedMenuProps {
  className?: string
}

export default function AuthenticatedMenu({ className }: AuthenticatedMenuProps) {
  const config = useConfig();
  const authenticatedUser = useAuthenticatedUser();
  const intl = useIntl();

  const title = (
    <div className="d-flex mr-2 align-items-center" style={{ gap: '0.5rem' }}>
      <Person />
      {authenticatedUser !== null ? authenticatedUser.name : null}
    </div>
  );

  return (
    <DropdownButton size="sm" id="user-nav-dropdown" title={title} variant="outline-primary" className={className}>
      <Dropdown.Item href={config.LEARNER_DASHBOARD_URL}>
        {intl.formatMessage(messages['header.user.menu.dashboard'])}
      </Dropdown.Item>
      <Dropdown.Item href={config.ACCOUNT_PROFILE_URL}>
        {intl.formatMessage(messages['header.user.menu.profile'])}
      </Dropdown.Item>
      <Dropdown.Item href={config.ACCOUNT_SETTINGS_URL}>
        {intl.formatMessage(messages['header.user.menu.account'])}
      </Dropdown.Item>
      <Dropdown.Item href={config.ORDER_HISTORY_URL}>
        {intl.formatMessage(messages['header.user.menu.order.history'])}
      </Dropdown.Item>
      <Dropdown.Item href={config.LOGOUT_URL}>
        {intl.formatMessage(messages['header.user.menu.logout'])}
      </Dropdown.Item>
    </DropdownButton>
  );
}
