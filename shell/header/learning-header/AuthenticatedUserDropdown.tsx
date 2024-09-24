import { Dropdown, Icon } from '@openedx/paragon';
import { Person } from '@openedx/paragon/icons';
import {
  getConfig,
  useIntl
} from '../../../runtime';

import messages from './messages';

interface AuthenticatedUserDropdownProps {
  username: string,
}

export default function AuthenticatedUserDropdown({ username }: AuthenticatedUserDropdownProps) {
  const intl = useIntl();

  return (
    <>
      {getConfig().SUPPORT_URL && (
        <a className="text-gray-700" href={`${getConfig().SUPPORT_URL}`}>{intl.formatMessage(messages.help)}</a>
      )}
      <Dropdown className="user-dropdown ml-3">
        <Dropdown.Toggle id="authenticated-user-dropdown" variant="outline-primary">
          <Icon src={Person} size="lg" />
          <span data-hj-suppress className="d-none d-md-inline">
            {username}
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu-right">
          <Dropdown.Item href={`${getConfig().LMS_BASE_URL}/dashboard`}>
            {intl.formatMessage(messages.dashboard)}
          </Dropdown.Item>
          <Dropdown.Item href={`${getConfig().ACCOUNT_PROFILE_URL}/u/${username}`}>
            {intl.formatMessage(messages.profile)}
          </Dropdown.Item>
          <Dropdown.Item href={getConfig().ACCOUNT_SETTINGS_URL}>
            {intl.formatMessage(messages.account)}
          </Dropdown.Item>
          { getConfig().ORDER_HISTORY_URL && (
            <Dropdown.Item href={getConfig().ORDER_HISTORY_URL}>
              {intl.formatMessage(messages.orderHistory)}
            </Dropdown.Item>
          )}
          <Dropdown.Item href={getConfig().LOGOUT_URL}>
            {intl.formatMessage(messages.signOut)}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}
