import { ChildMenuItemConfig, MenuItemConfig } from '../../types';
import messages from '../Shell.messages';
import LoginButton from './anonymous-menu/LoginButton';
import RegisterButton from './anonymous-menu/RegisterButton';

export const primaryLinks: MenuItemConfig[] = [
  {
    appId: 'learner-dashboard',
    label: 'Courses',
  },
];

export const secondaryLinks: MenuItemConfig[] = [];

export const anonymousLinks: MenuItemConfig[] = [
  <LoginButton key="login" />,
  <RegisterButton key="register" />
];

export const authenticatedLinks: ChildMenuItemConfig[] = [
  {
    appId: 'learner-dashboard',
    label: messages['header.user.menu.dashboard']
  },
  {
    appId: 'profile',
    label: messages['header.user.menu.profile']
  },
  {
    appId: 'account',
    label: messages['header.user.menu.account']
  },
  {
    appId: 'order-history',
    label: messages['header.user.menu.order.history']
  },
  {
    appId: 'logout',
    label: messages['header.user.menu.logout']
  }
];
