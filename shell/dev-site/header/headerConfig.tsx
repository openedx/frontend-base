import { WidgetOperationTypes } from '../../../runtime';
import { App } from '../../../types';
import LinkMenuItem from '../../menus/LinkMenuItem';
import CoursesLink from './CoursesLink';

const config: App = {
  appId: 'org.openedx.frontend.app.devSite.header',
  slots: [
    {
      slotId: 'org.openedx.frontend.slot.header.primaryLinks.v1',
      id: 'header.learnerDashboard.link',
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

export default config;
