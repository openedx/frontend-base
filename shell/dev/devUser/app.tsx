import { WidgetOperationTypes } from '../../../runtime';
import { App } from '../../../types';
import LoginButton from '../../header/anonymous-menu/LoginButton';
import RegisterButton from '../../header/anonymous-menu/RegisterButton';
import LinkMenuItem from '../../menus/LinkMenuItem';
import messages from '../../Shell.messages';

const app: App = {
  appId: 'org.openedx.frontend.app.dev.user',
  slots: [
    {
      slotId: 'org.openedx.frontend.slot.header.anonymousMenu.v1',
      id: 'user.anonymousMenu.loginButton',
      op: WidgetOperationTypes.APPEND,
      component: LoginButton,
    },
    {
      slotId: 'org.openedx.frontend.slot.header.anonymousMenu.v1',
      id: 'user.anonymousMenu.registerButton',
      op: WidgetOperationTypes.APPEND,
      component: RegisterButton,
    },
    {
      slotId: 'org.openedx.frontend.slot.header.authenticatedMenu.v1',
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

export default app;
