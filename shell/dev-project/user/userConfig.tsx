import { WidgetOperationTypes } from '../../../runtime';
import { App } from '../../../types';
import LoginButton from '../../header/anonymous-menu/LoginButton';
import RegisterButton from '../../header/anonymous-menu/RegisterButton';
import LinkMenuItem from '../../menus/LinkMenuItem';
import messages from '../../Shell.messages';

const config: App = {
  slots: [
    {
      slotId: 'frontend.shell.header.anonymousMenu.widget',
      id: 'user.anonymousMenu.loginButton',
      op: WidgetOperationTypes.APPEND,
      component: LoginButton,
    },
    {
      slotId: 'frontend.shell.header.anonymousMenu.widget',
      id: 'user.anonymousMenu.registerButton',
      op: WidgetOperationTypes.APPEND,
      component: RegisterButton,
    },
    {
      slotId: 'frontend.shell.header.authenticatedMenu.widget',
      id: 'user.authenticatedMenu.logout',
      op: WidgetOperationTypes.APPEND,
      element: (
        <LinkMenuItem
          label={messages['header.user.menu.logout']}
          role="logout"
          variant="dropdownItem"
        />
      )
    }
  ]
};

export default config;
