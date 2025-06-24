import { WidgetOperationTypes } from '../../../runtime';
import { App } from '../../../types';
import LoginButton from '../../header/anonymous-menu/LoginButton';
import RegisterButton from '../../header/anonymous-menu/RegisterButton';

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
  ]
};

export default app;
