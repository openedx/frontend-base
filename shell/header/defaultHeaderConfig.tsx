import { App, SlotOperationTypes } from '../../types';
import AnonymousMenu from './anonymous-menu/AnonymousMenu';
import AuthenticatedMenu from './authenticated-menu';
import CourseInfo from './desktop/CourseInfo';
import DesktopLayout from './desktop/DesktopLayout';
import PrimaryNavLinks from './desktop/PrimaryNavLinks';
import SecondaryNavLinks from './desktop/SecondaryNavLinks';
import Logo from './Logo';
import MobileLayout from './mobile/MobileLayout';
import MobileNavLinks from './mobile/MobileNavLinks';

const config: App = {
  slots: [

    // Layouts
    {
      slotId: 'frontend.shell.header.desktop.layout.widget',
      id: 'default.header.desktop.layout',
      op: SlotOperationTypes.APPEND,
      component: DesktopLayout
    },
    {
      slotId: 'frontend.shell.header.mobile.layout.widget',
      id: 'default.header.mobile.layout',
      op: SlotOperationTypes.APPEND,
      component: MobileLayout
    },

    // Desktop
    {
      slotId: 'frontend.shell.header.desktop.left.widget',
      id: 'default.header.desktop.logo',
      op: SlotOperationTypes.APPEND,
      element: <Logo />,
    },
    {
      slotId: 'frontend.shell.header.desktop.left.widget',
      id: 'default.header.desktop.courseInfo',
      op: SlotOperationTypes.APPEND,
      component: CourseInfo
    },
    {
      slotId: 'frontend.shell.header.desktop.left.widget',
      id: 'default.header.desktop.primaryLinks',
      op: SlotOperationTypes.APPEND,
      component: PrimaryNavLinks
    },
    {
      slotId: 'frontend.shell.header.desktop.right.widget',
      id: 'default.header.desktop.secondaryLinks',
      op: SlotOperationTypes.APPEND,
      component: SecondaryNavLinks
    },
    {
      slotId: 'frontend.shell.header.desktop.right.widget',
      id: 'default.header.desktop.authenticatedMenu',
      op: SlotOperationTypes.APPEND,
      element: <AuthenticatedMenu />,
      condition: {
        authenticated: true,
      }
    },
    {
      slotId: 'frontend.shell.header.desktop.right.widget',
      id: 'default.header.desktop.anonymousMenu',
      op: SlotOperationTypes.APPEND,
      element: <AnonymousMenu />,
      condition: {
        authenticated: false,
      }
    },

    // Mobile
    {
      slotId: 'frontend.shell.header.mobile.center.widget',
      id: 'default.header.mobile.logo',
      op: SlotOperationTypes.APPEND,
      element: <Logo />,
    },
    {
      slotId: 'frontend.shell.header.mobile.menu.widget',
      id: 'default.header.mobile.menuLinks',
      op: SlotOperationTypes.APPEND,
      component: MobileNavLinks
    },
    {
      slotId: 'frontend.shell.header.mobile.right.widget',
      id: 'default.header.mobile.authenticatedMenu',
      op: SlotOperationTypes.APPEND,
      element: <AuthenticatedMenu />,
      condition: {
        authenticated: true,
      }
    },
    {
      slotId: 'frontend.shell.header.mobile.right.widget',
      id: 'default.header.mobile.anonymousMenu',
      op: SlotOperationTypes.APPEND,
      element: <AnonymousMenu />,
      condition: {
        authenticated: false,
      }
    },
  ]
};

export default config;
