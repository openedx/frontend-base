import PropTypes from 'prop-types';
import { useContext } from 'react';
import Responsive from 'react-responsive';
import { AppContext } from '../../../runtime';

import HeaderBody from './HeaderBody';
import MobileHeader from './MobileHeader';

const StudioHeader = ({
  number, org, title, isHiddenMainMenu, mainMenuDropdowns, outlineLink, searchButtonAction,
}) => {
  const { authenticatedUser, config } = useContext(AppContext);
  const props = {
    logo: config.LOGO_URL,
    logoAltText: `Studio ${config.SITE_NAME}`,
    number,
    org,
    title,
    username: authenticatedUser?.username,
    isAdmin: authenticatedUser?.administrator,
    authenticatedUserAvatar: authenticatedUser?.avatar,
    studioBaseUrl: config.STUDIO_BASE_URL,
    logoutUrl: config.LOGOUT_URL,
    isHiddenMainMenu,
    mainMenuDropdowns,
    outlineLink,
    searchButtonAction,
  };

  return (
    <div className="studio-header">
      <a className="nav-skip sr-only sr-only-focusable" href="#main">Skip to content</a>
      <Responsive maxWidth={841}>
        <MobileHeader {...props} />
      </Responsive>
      <Responsive minWidth={842}>
        <HeaderBody {...props} />
      </Responsive>
    </div>
  );
};

StudioHeader.propTypes = {
  number: PropTypes.string,
  org: PropTypes.string,
  title: PropTypes.string.isRequired,
  isHiddenMainMenu: PropTypes.bool,
  mainMenuDropdowns: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    buttonTitle: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
      href: PropTypes.string,
      title: PropTypes.string,
    })),
  })),
  outlineLink: PropTypes.string,
  searchButtonAction: PropTypes.func,
};

StudioHeader.defaultProps = {
  number: '',
  org: '',
  isHiddenMainMenu: false,
  mainMenuDropdowns: [],
  outlineLink: null,
  searchButtonAction: null,
};

export default StudioHeader;
