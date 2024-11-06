import { createAppMenuItem, createComponentMenuItem } from '../../runtime/config/menuConfigHelpers';
import { ChildMenuItemConfig, MenuItemConfig } from '../../types';
import messages from '../Shell.messages';
import LoginButton from './anonymous-menu/LoginButton';
import RegisterButton from './anonymous-menu/RegisterButton';

export const primaryLinks: MenuItemConfig[] = [
  createAppMenuItem('Courses', 'learnerDashboard'),
];

export const secondaryLinks: MenuItemConfig[] = [];

export const anonymousLinks: MenuItemConfig[] = [
  createComponentMenuItem(<LoginButton />),
  createComponentMenuItem(<RegisterButton />)
];

export const authenticatedLinks: ChildMenuItemConfig[] = [
  createAppMenuItem(messages['header.user.menu.dashboard'], 'learnerDashboard'),
  createAppMenuItem(messages['header.user.menu.profile'], 'profile'),
  createAppMenuItem(messages['header.user.menu.account'], 'account'),
  createAppMenuItem(messages['header.user.menu.order.history'], 'order-history'),
  createAppMenuItem(messages['header.user.menu.logout'], 'logout'),
];
