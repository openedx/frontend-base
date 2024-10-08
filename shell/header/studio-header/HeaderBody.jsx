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
import PropTypes from 'prop-types';
import { useIntl } from '../../../runtime';

import BrandNav from './BrandNav';
import CourseLockUp from './CourseLockUp';
import NavDropdownMenu from './NavDropdownMenu';
import UserMenu from './UserMenu';
import messages from './messages';

const HeaderBody = ({
  logo,
  logoAltText,
  number,
  org,
  title,
  username,
  isAdmin,
  studioBaseUrl,
  logoutUrl,
  authenticatedUserAvatar,
  isMobile,
  setModalPopupTarget,
  toggleModalPopup,
  isModalPopupOpen,
  isHiddenMainMenu,
  mainMenuDropdowns,
  outlineLink,
  searchButtonAction,
}) => {
  const intl = useIntl();

  const renderBrandNav = (
    <BrandNav
      {...{
        studioBaseUrl,
        logo,
        logoAltText,
      }}
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
                Menu
              </Button>
            ) : (
              <div className="w-25">
                <Row className="m-0 flex-nowrap">
                  {renderBrandNav}
                  <CourseLockUp
                    {...{
                      outlineLink,
                      number,
                      org,
                      title,
                    }}
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
                    <NavDropdownMenu key={id} {...{ id, buttonTitle, items }} />
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
            {...{
              username,
              studioBaseUrl,
              logoutUrl,
              authenticatedUserAvatar,
              isAdmin,
            }}
          />
        </Nav>
      </ActionRow>
    </Container>
  );
};

HeaderBody.propTypes = {
  studioBaseUrl: PropTypes.string.isRequired,
  logoutUrl: PropTypes.string.isRequired,
  setModalPopupTarget: PropTypes.func,
  toggleModalPopup: PropTypes.func,
  isModalPopupOpen: PropTypes.bool,
  number: PropTypes.string,
  org: PropTypes.string,
  title: PropTypes.string,
  logo: PropTypes.string,
  logoAltText: PropTypes.string,
  authenticatedUserAvatar: PropTypes.string,
  username: PropTypes.string,
  isAdmin: PropTypes.bool,
  isMobile: PropTypes.bool,
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

HeaderBody.defaultProps = {
  setModalPopupTarget: null,
  toggleModalPopup: null,
  isModalPopupOpen: false,
  logo: null,
  logoAltText: null,
  number: '',
  org: '',
  title: '',
  authenticatedUserAvatar: null,
  username: null,
  isAdmin: false,
  isMobile: false,
  isHiddenMainMenu: false,
  mainMenuDropdowns: [],
  outlineLink: null,
  searchButtonAction: null,
};

export default HeaderBody;
