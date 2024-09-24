import { useContext } from 'react';
import {
  AppContext,
  getConfig,
  useIntl
} from '../../../runtime';

import LinkedLogo from '../LinkedLogo';
import AnonymousUserMenu from './AnonymousUserMenu';
import AuthenticatedUserDropdown from './AuthenticatedUserDropdown';
import messages from './messages';

interface LearningHeaderProps {
  courseOrg?: string,
  courseNumber?: string,
  courseTitle?: string,
  showUserDropdown?: boolean,
}

export default function LearningHeader({
  courseOrg, courseNumber, courseTitle, showUserDropdown = true,
}: LearningHeaderProps) {
  const intl = useIntl();
  const { authenticatedUser } = useContext(AppContext);

  return (
    <header className="learning-header">
      <a className="sr-only sr-only-focusable" href="#main-content">{intl.formatMessage(messages.skipNavLink)}</a>
      <div className="container-xl py-2 d-flex align-items-center">
        <LinkedLogo
          className="logo"
          href={`${getConfig().LMS_BASE_URL}/dashboard`}
          src={getConfig().LOGO_URL}
          alt={getConfig().SITE_NAME}
        />
        <div className="flex-grow-1 course-title-lockup" style={{ lineHeight: 1 }}>
          <span className="d-block small m-0">{courseOrg} {courseNumber}</span>
          <span className="d-block m-0 font-weight-bold course-title">{courseTitle}</span>
        </div>
        {showUserDropdown && authenticatedUser && (
        <AuthenticatedUserDropdown
          username={authenticatedUser.username}
        />
        )}
        {showUserDropdown && !authenticatedUser && (
        <AnonymousUserMenu />
        )}
      </div>
    </header>
  );
}
