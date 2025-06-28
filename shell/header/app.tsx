import { WidgetOperationTypes } from '../../runtime';
import { App } from '../../types';
import Logo from '../Logo';
import LinkMenuItem from '../menus/LinkMenuItem';
import ProfileLinkMenuItem from '../menus/ProfileLinkMenuItem';
import AnonymousMenu from './anonymous-menu/AnonymousMenu';
import AuthenticatedMenu from './AuthenticatedMenu';
import DesktopLayout from './desktop/DesktopLayout';
import PrimaryNavLinks from './desktop/PrimaryNavLinks';
import SecondaryNavLinks from './desktop/SecondaryNavLinks';
import MobileLayout from './mobile/MobileLayout';
import MobileNavLinks from './mobile/MobileNavLinks';

import messages from '../Shell.messages';

const config: App = {
  appId: 'org.openedx.frontend.app.header',
  slots: [

    // Layouts
    {
      slotId: 'org.openedx.frontend.slot.header.desktop.v1',
      id: 'org.openedx.frontend.widget.header.desktopLayout.v1',
      op: WidgetOperationTypes.APPEND,
      component: DesktopLayout
    },
    {
      slotId: 'org.openedx.frontend.slot.header.mobile.v1',
      id: 'org.openedx.frontend.widget.header.mobileLayout.v1',
      op: WidgetOperationTypes.APPEND,
      component: MobileLayout
    },

    // Desktop
    {
      slotId: 'org.openedx.frontend.slot.header.desktopLeft.v1',
      id: 'org.openedx.frontend.widget.header.desktopLogo.v1',
      op: WidgetOperationTypes.APPEND,
      element: <Logo />,
    },
    {
      slotId: 'org.openedx.frontend.slot.header.desktopLeft.v1',
      id: 'org.openedx.frontend.widget.header.desktopPrimaryLinks.v1',
      op: WidgetOperationTypes.APPEND,
      component: PrimaryNavLinks
    },
    {
      slotId: 'org.openedx.frontend.slot.header.desktopRight.v1',
      id: 'org.openedx.frontend.widget.header.desktopSecondaryLinks.v1',
      op: WidgetOperationTypes.APPEND,
      component: SecondaryNavLinks
    },
    {
      slotId: 'org.openedx.frontend.slot.header.desktopRight.v1',
      id: 'org.openedx.frontend.widget.header.desktopAuthenticatedMenu.v1',
      op: WidgetOperationTypes.APPEND,
      element: <AuthenticatedMenu />,
      condition: {
        authenticated: true,
      }
    },
    {
      slotId: 'org.openedx.frontend.slot.header.authenticatedMenu.v1',
      id: 'org.openedx.frontend.widget.header.desktopAuthenticatedMenuProfile.v1',
      op: WidgetOperationTypes.APPEND,
      element: (
        <ProfileLinkMenuItem
          label={messages['header.user.menu.profile']}
          role="org.openedx.frontend.role.profile"
          variant="dropdownItem"
        />
      )
    },
    {
      slotId: 'org.openedx.frontend.slot.header.authenticatedMenu.v1',
      id: 'org.openedx.frontend.widget.header.desktopAuthenticatedMenuAccount.v1',
      op: WidgetOperationTypes.APPEND,
      element: (
        <LinkMenuItem
          label={messages['header.user.menu.account']}
          role="org.openedx.frontend.role.account"
          variant="dropdownItem"
        />
      )
    },
    {
      slotId: 'org.openedx.frontend.slot.header.authenticatedMenu.v1',
      id: 'org.openedx.frontend.widget.header.desktopAuthenticatedMenuLogout.v1',
      op: WidgetOperationTypes.APPEND,
      element: (
        <LinkMenuItem
          label={messages['header.user.menu.logout']}
          role="org.openedx.frontend.role.logout"
          variant="dropdownItem"
        />
      )
    },
    {
      slotId: 'org.openedx.frontend.slot.header.desktopRight.v1',
      id: 'org.openedx.frontend.widget.header.desktopAnonymousMenu.v1',
      op: WidgetOperationTypes.APPEND,
      element: <AnonymousMenu />,
      condition: {
        authenticated: false,
      }
    },

    // Mobile
    {
      slotId: 'org.openedx.frontend.slot.header.mobileCenter.v1',
      id: 'org.openedx.frontend.widget.header.mobileLogo.v1',
      op: WidgetOperationTypes.APPEND,
      element: <Logo />,
    },
    {
      slotId: 'org.openedx.frontend.slot.header.mobileMenu.v1',
      id: 'org.openedx.frontend.widget.header.mobileMenuLinks.v1',
      op: WidgetOperationTypes.APPEND,
      component: MobileNavLinks
    },
    {
      slotId: 'org.openedx.frontend.slot.header.mobileRight.v1',
      id: 'org.openedx.frontend.widget.header.mobileAuthenticatedMenu.v1',
      op: WidgetOperationTypes.APPEND,
      element: <AuthenticatedMenu />,
      condition: {
        authenticated: true,
      }
    },
    {
      slotId: 'org.openedx.frontend.slot.header.mobileRight.v1',
      id: 'org.openedx.frontend.widget.header.mobileAnonymousMenu.v1',
      op: WidgetOperationTypes.APPEND,
      element: <AnonymousMenu />,
      condition: {
        authenticated: false,
      }
    },
  ]
};

export default config;
