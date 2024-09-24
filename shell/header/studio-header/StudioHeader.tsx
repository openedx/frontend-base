import { useContext } from 'react';
import Responsive from 'react-responsive';
import { AppContext } from '../../../runtime';

import HeaderBody from './HeaderBody';
import MobileHeader from './MobileHeader';

interface StudioHeaderProps {
  number?: string,
  org?: string,
  title: string,
  isHiddenMainMenu?: boolean,
  mainMenuDropdowns?: Array<{
    id: string,
    buttonTitle: string,
    items: Array<{
      href: string,
      title: string,
    }>,
  }>,
  outlineLink?: string,
  searchButtonAction?: () => void,
}

export default function StudioHeader({
  number = '',
  org = '',
  title,
  isHiddenMainMenu = false,
  mainMenuDropdowns = [],
  outlineLink,
  searchButtonAction,
}: StudioHeaderProps) {
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
}
