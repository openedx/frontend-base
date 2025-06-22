import { WidgetOperationTypes } from '../../../runtime';
import { App } from '../../../types';
import LinkMenuItem from '../../menus/LinkMenuItem';
import CoursesLink from './CoursesLink';
import FooLink from './FooLink';
import BarLink from './BarLink';
import providers from './providers';

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
    {
      slotId: 'org.openedx.frontend.slot.header.primaryLinks.v1',
      id: 'org.openedx.frontend.widget.slotShowcase.headerLink2a',
      op: WidgetOperationTypes.APPEND,
      element: (
        <LinkMenuItem
          label={<FooLink />}
          url="#"
          variant="navLink"
        />
      )
    },
    {
      slotId: 'org.openedx.frontend.slot.header.primaryLinks.v1',
      id: 'org.openedx.frontend.widget.slotShowcase.headerLink2b',
      op: WidgetOperationTypes.APPEND,
      condition: { authenticated: true },
      element: (
        <LinkMenuItem
          label={<BarLink />}
          url="#"
          variant="navLink"
        />
      )
    },
  ],
  providers
};

export default app;
