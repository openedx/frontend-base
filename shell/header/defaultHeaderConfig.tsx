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
      slotId: 'frontend.shell.header.desktop.layout.widget',
      id: 'default.header.desktop.layout',
      op: WidgetOperationTypes.APPEND,
      component: DesktopLayout
    },
    {
      slotId: 'frontend.shell.header.mobile.layout.widget',
      id: 'default.header.mobile.layout',
      op: WidgetOperationTypes.APPEND,
      component: MobileLayout
    },

    // Desktop
    {
      slotId: 'frontend.shell.header.desktop.left.widget',
      id: 'default.header.desktop.logo',
      op: WidgetOperationTypes.APPEND,
      element: <Logo />,
    },
    {
      slotId: 'frontend.shell.header.desktop.left.widget',
      id: 'default.header.desktop.courseInfo',
      op: WidgetOperationTypes.APPEND,
      component: CourseInfo
    },
    {
      slotId: 'frontend.shell.header.desktop.left.widget',
      id: 'default.header.desktop.primaryLinks',
      op: WidgetOperationTypes.APPEND,
      component: PrimaryNavLinks
    },
    {
      slotId: 'frontend.shell.header.desktop.right.widget',
      id: 'default.header.desktop.secondaryLinks',
      op: WidgetOperationTypes.APPEND,
      component: SecondaryNavLinks
    },
    {
      slotId: 'frontend.shell.header.desktop.right.widget',
      id: 'default.header.desktop.authenticatedMenu',
      op: WidgetOperationTypes.APPEND,
      element: <AuthenticatedMenu />,
      condition: {
        authenticated: true,
      }
    },
    {
      slotId: 'frontend.shell.header.desktop.right.widget',
      id: 'default.header.desktop.anonymousMenu',
      op: WidgetOperationTypes.APPEND,
      element: <AnonymousMenu />,
      condition: {
        authenticated: false,
      }
    },

    // Mobile
    {
      slotId: 'frontend.shell.header.mobile.center.widget',
      id: 'default.header.mobile.logo',
      op: WidgetOperationTypes.APPEND,
      element: <Logo />,
    },
    {
      slotId: 'frontend.shell.header.mobile.menu.widget',
      id: 'default.header.mobile.menuLinks',
      op: WidgetOperationTypes.APPEND,
      component: MobileNavLinks
    },
    {
      slotId: 'frontend.shell.header.mobile.right.widget',
      id: 'default.header.mobile.authenticatedMenu',
      op: WidgetOperationTypes.APPEND,
      element: <AuthenticatedMenu />,
      condition: {
        authenticated: true,
      }
    },
    {
      slotId: 'frontend.shell.header.mobile.right.widget',
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
