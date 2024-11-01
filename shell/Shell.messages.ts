import { defineMessages } from '../runtime';

const messages = defineMessages({
  'header.user.menu.dashboard': {
    id: 'header.user.menu.dashboard',
    defaultMessage: 'Dashboard',
    description: 'Link to the user dashboard',
  },
  'header.user.menu.logout': {
    id: 'header.user.menu.logout',
    defaultMessage: 'Logout',
    description: 'Logout link',
  },
  'header.user.menu.profile': {
    id: 'header.user.menu.profile',
    defaultMessage: 'Profile',
    description: 'Link to the user profile',
  },
  'header.user.menu.account': {
    id: 'header.user.menu.account',
    defaultMessage: 'Account',
    description: 'Link to account settings',
  },
  'header.user.menu.order.history': {
    id: 'header.user.menu.order.history',
    defaultMessage: 'Order History',
    description: 'Link to order history',
  },
  'header.user.menu.login': {
    id: 'header.user.menu.login',
    defaultMessage: 'Login',
    description: 'Login link',
  },
  'header.user.menu.register': {
    id: 'header.user.menu.register',
    defaultMessage: 'Sign Up',
    description: 'Link to registration',
  },
  skipNavLink: {
    id: 'header.navigation.skipNavLink',
    defaultMessage: 'Skip to main content.',
    description: 'A link used by screen readers to allow users to skip to the main content of the page.',
  },
  footerPoweredBy: {
    id: 'footer.powered.by',
    defaultMessage: 'Powered by Open edX',
    description: 'Alt text for the \'Powered by Open edX\' logo displayed in the footer.',
  },
  footerTrademarkNotice: {
    id: 'footer.trademark.notice',
    defaultMessage: 'edX and Open edX are registered trademarks of edX LLC.',
    description: 'A legal notice that "edX LLC" owns the trademarks on "edX" and "Open edX".  Please do not translate these three proper names.'
  }
});

export default messages;
