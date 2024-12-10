import { App, SlotOperationTypes } from '../../../types';
import LoginButton from '../../header/anonymous-menu/LoginButton';
import RegisterButton from '../../header/anonymous-menu/RegisterButton';
import LinkMenuItem from '../../menus/LinkMenuItem';
import messages from '../../Shell.messages';

const config: App = {
  slots: [
    {
      slotId: 'frontend.shell.header.anonymousMenu.widget',
      id: 'user.anonymousMenu.loginButton',
      op: SlotOperationTypes.APPEND,
      component: LoginButton,
    },
    {
      slotId: 'frontend.shell.header.anonymousMenu.widget',
      id: 'user.anonymousMenu.registerButton',
      op: SlotOperationTypes.APPEND,
      component: RegisterButton,
    },
    {
      slotId: 'frontend.shell.header.authenticatedMenu.widget',
      id: 'user.authenticatedMenu.logout',
      op: SlotOperationTypes.APPEND,
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
