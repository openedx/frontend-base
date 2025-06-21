import { WidgetOperationTypes } from '../../../runtime';
import { App } from '../../../types';
import LinkMenuItem from '../../menus/LinkMenuItem';
import CoursesLink from './CoursesLink';

const app: App = {
  appId: 'org.openedx.frontend.app.dev.header',
  slots: [
    {
      slotId: 'org.openedx.frontend.slot.header.primaryLinks.v1',
      id: 'org.openedx.frontend.widget.slotShowcase.headerLink',
      op: WidgetOperationTypes.APPEND,
      element: (
        <LinkMenuItem
          label={<CoursesLink />}
          url="#"
          variant="navLink"
        />
      )
    },
  ]
};

export default app;
