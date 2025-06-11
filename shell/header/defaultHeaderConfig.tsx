import { WidgetOperationTypes } from '../../runtime';
import { App } from '../../types';
import Logo from '../Logo';
import AnonymousMenu from './anonymous-menu/AnonymousMenu';
import AuthenticatedMenu from './AuthenticatedMenu';
import CourseInfo from './desktop/CourseInfo';
import DesktopLayout from './desktop/DesktopLayout';
import PrimaryNavLinks from './desktop/PrimaryNavLinks';
import SecondaryNavLinks from './desktop/SecondaryNavLinks';
import MobileLayout from './mobile/MobileLayout';
import MobileNavLinks from './mobile/MobileNavLinks';

const config: App = {
  slots: [

    // Layouts
    {
      slotId: 'org.openedx.frontend.slot.header.desktop.v1',
      id: 'default.header.desktop.layout',
      op: WidgetOperationTypes.APPEND,
      component: DesktopLayout
    },
    {
      slotId: 'org.openedx.frontend.slot.header.mobile.v1',
      id: 'default.header.mobile.layout',
      op: WidgetOperationTypes.APPEND,
      component: MobileLayout
    },

    // Desktop
    {
      slotId: 'org.openedx.frontend.slot.header.desktopLeft.v1',
      id: 'default.header.desktop.logo',
      op: WidgetOperationTypes.APPEND,
      element: <Logo />,
    },
    {
      slotId: 'org.openedx.frontend.slot.header.desktopLeft.v1',
      id: 'default.header.desktop.courseInfo',
      op: WidgetOperationTypes.APPEND,
      component: CourseInfo
    },
    {
      slotId: 'org.openedx.frontend.slot.header.desktopLeft.v1',
      id: 'default.header.desktop.primaryLinks',
      op: WidgetOperationTypes.APPEND,
      component: PrimaryNavLinks
    },
    {
      slotId: 'org.openedx.frontend.slot.header.desktopRight.v1',
      id: 'default.header.desktop.secondaryLinks',
      op: WidgetOperationTypes.APPEND,
      component: SecondaryNavLinks
    },
    {
      slotId: 'org.openedx.frontend.slot.header.desktopRight.v1',
      id: 'default.header.desktop.authenticatedMenu',
      op: WidgetOperationTypes.APPEND,
      element: <AuthenticatedMenu />,
      condition: {
        authenticated: true,
      }
    },
    {
      slotId: 'org.openedx.frontend.slot.header.desktopRight.v1',
      id: 'default.header.desktop.anonymousMenu',
      op: WidgetOperationTypes.APPEND,
      element: <AnonymousMenu />,
      condition: {
        authenticated: false,
      }
    },

    // Mobile
    {
      slotId: 'org.openedx.frontend.slot.header.mobileCenter.v1',
      id: 'default.header.mobile.logo',
      op: WidgetOperationTypes.APPEND,
      element: <Logo />,
    },
    {
      slotId: 'org.openedx.frontend.slot.header.mobileMenu.v1',
      id: 'default.header.mobile.menuLinks',
      op: WidgetOperationTypes.APPEND,
      component: MobileNavLinks
    },
    {
      slotId: 'org.openedx.frontend.slot.header.mobileRight.v1',
      id: 'default.header.mobile.authenticatedMenu',
      op: WidgetOperationTypes.APPEND,
      element: <AuthenticatedMenu />,
      condition: {
        authenticated: true,
      }
    },
    {
      slotId: 'org.openedx.frontend.slot.header.mobileRight.v1',
      id: 'default.header.mobile.anonymousMenu',
      op: WidgetOperationTypes.APPEND,
      element: <AnonymousMenu />,
      condition: {
        authenticated: false,
      }
    },
  ]
};

export default config;
