import PropTypes from 'prop-types';

// TODO: Fix these
// import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown } from '@openedx/paragon';
import { getConfig, injectIntl, intlShape } from '../../../runtime';

import messages from './messages';

const AuthenticatedUserDropdown = ({ intl, username }) => {
  const dashboardMenuItem = (
    <Dropdown.Item href={`${getConfig().LMS_BASE_URL}/dashboard`}>
      {intl.formatMessage(messages.dashboard)}
    </Dropdown.Item>
  );

  return (
    <>
      <a className="text-gray-700" href={`${getConfig().SUPPORT_URL}`}>{intl.formatMessage(messages.help)}</a>
      <Dropdown className="user-dropdown ml-3">
        <Dropdown.Toggle variant="outline-primary">
          {/* <FontAwesomeIcon icon={faUserCircle} className="d-md-none" size="lg" /> */}
          <span data-hj-suppress className="d-none d-md-inline">
            {username}
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu-right">
          {dashboardMenuItem}
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
};

AuthenticatedUserDropdown.propTypes = {
  intl: intlShape.isRequired,
  username: PropTypes.string.isRequired,
};

export default injectIntl(AuthenticatedUserDropdown);
