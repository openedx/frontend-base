import classNames from 'classnames';
import { useMediaQuery } from 'react-responsive';
import { useAuthenticatedUser } from '../../../runtime';
import AnonymousMenu from '../anonymous-menu/AnonymousMenu';
import AuthenticatedMenu from '../authenticated-menu';
import Logo from '../Logo';
import CourseInfo from './CourseInfo';
import PrimaryNavLinks from './PrimaryNavLinks';
import SecondaryNavLinks from './SecondaryNavLinks';

export default function DesktopLayout() {
  const authenticatedUser = useAuthenticatedUser();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className={classNames(
      'align-items-center justify-content-between px-3',
      isMobile ? 'd-none' : 'd-flex'
    )}
    >
      <div className="d-flex flex-grow-1 align-items-center">
        <Logo />
        <CourseInfo />
        <PrimaryNavLinks />
      </div>
      <div className="d-flex align-items-center">
        <SecondaryNavLinks />
        {authenticatedUser ? (
          <AuthenticatedMenu />
        ) : (
          <AnonymousMenu />
        )}
      </div>
    </div>
  );
}
