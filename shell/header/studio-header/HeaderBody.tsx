import {
  ActionRow,
  Button,
  Container,
  Icon,
  IconButton,
  Nav,
  Row,
} from '@openedx/paragon';
import { Close, MenuIcon, Search } from '@openedx/paragon/icons';
import { useIntl } from '../../../runtime';

import BrandNav from './BrandNav';
import CourseLockUp from './CourseLockUp';
import NavDropdownMenu from './NavDropdownMenu';
import UserMenu from './UserMenu';
import messages from './messages';

interface HeaderBodyProps {
  studioBaseUrl: string,
  logoutUrl: string,
  setModalPopupTarget?: any,
  toggleModalPopup?: () => void,
  isModalPopupOpen?: boolean,
  number?: string,
  org?: string,
  title?: string,
  logo: string,
  logoAltText: string,
  authenticatedUserAvatar?: string,
  username?: string,
  isAdmin?: boolean,
  isMobile?: boolean,
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

export default function HeaderBody({
  logo,
  logoAltText,
  number = '',
  org = '',
  title = '',
  username,
  isAdmin = false,
  studioBaseUrl,
  logoutUrl,
  authenticatedUserAvatar,
  isMobile = false,
  setModalPopupTarget,
  toggleModalPopup,
  isModalPopupOpen = false,
  isHiddenMainMenu = false,
  mainMenuDropdowns = [],
  outlineLink,
  searchButtonAction,
}: HeaderBodyProps) {
  const intl = useIntl();

  const renderBrandNav = (
    <BrandNav
      studioBaseUrl={studioBaseUrl}
      logo={logo}
      logoAltText={logoAltText}
    />
  );

  return (
    <Container size="xl" className="px-2.5">
      <ActionRow as="header">
        {isHiddenMainMenu ? (
          <Row className="flex-nowrap ml-4">
            {renderBrandNav}
          </Row>
        ) : (
          <>
            {isMobile ? (
              <Button
                ref={setModalPopupTarget}
                className="d-inline-flex align-items-center"
                variant="tertiary"
                onClick={toggleModalPopup}
                iconBefore={isModalPopupOpen ? Close : MenuIcon}
                data-testid="mobile-menu-button"
              >
                {intl.formatMessage(messages['header.label.menu'])}
              </Button>
            ) : (
              <div className="w-25">
                <Row className="m-0 flex-nowrap">
                  {renderBrandNav}
                  <CourseLockUp
                    outlineLink={outlineLink}
                    number={number}
                    org={org}
                    title={title}
                  />
                </Row>
              </div>
            )}
            {isMobile ? (
              <>
                <ActionRow.Spacer />
                {renderBrandNav}
              </>
            ) : (
              <Nav data-testid="desktop-menu" className="ml-2">
                {mainMenuDropdowns.map(dropdown => {
                  const { id, buttonTitle, items } = dropdown;
                  return (
                    <NavDropdownMenu key={id} id={id} buttonTitle={buttonTitle} items={items} />
                  );
                })}
              </Nav>
            )}
          </>
        )}
        <ActionRow.Spacer />
        {searchButtonAction && (
          <Nav>
            <IconButton
              alt={intl.formatMessage(messages['header.label.search.nav'])}
              src={Search}
              iconAs={Icon}
              onClick={searchButtonAction}
              aria-label={intl.formatMessage(messages['header.label.search.nav'])}
            />
          </Nav>
        )}
        <Nav>
          <UserMenu
            username={username}
            studioBaseUrl={studioBaseUrl}
            logoutUrl={logoutUrl}
            authenticatedUserAvatar={authenticatedUserAvatar}
            isAdmin={isAdmin}
          />
        </Nav>
      </ActionRow>
    </Container>
  );
}
