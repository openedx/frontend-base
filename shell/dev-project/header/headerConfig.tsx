import { NavDropdownMenuSlot } from '../..';
import { WidgetOperationTypes } from '../../../runtime';
import { App } from '../../../types';
import LinkMenuItem from '../../menus/LinkMenuItem';
import CoursesLink from './CoursesLink';

const config: App = {
  slots: [
    {
      slotId: 'frontend.shell.header.primaryLinks.ui',
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
    {
      slotId: 'frontend.shell.header.primaryLinks.ui',
      id: 'header.learnerDashboard.linkAfter3',
      op: WidgetOperationTypes.INSERT_AFTER,
      relatedId: 'header.learnerDashboard.link3',
      element: (<LinkMenuItem label="Link After 3" url="#" variant="navLink" />
      )
    },
    {
      slotId: 'frontend.shell.header.primaryLinks.ui',
      id: 'header.booyah.primaryLinks.dropdown',
      op: WidgetOperationTypes.PREPEND,
      element: (
        <NavDropdownMenuSlot id="frontend.shell.header.primaryLinks.dropdown.ui" label="Resources" />
      )
    },
    {
      slotId: 'frontend.shell.header.primaryLinks.dropdown.ui',
      id: 'header.booyah.primaryLinks.dropdown.1',
      op: WidgetOperationTypes.APPEND,
      element: (
        <LinkMenuItem label="Resource 1" url="#" variant="dropdownItem" />
      )
    },
    {
      slotId: 'frontend.shell.header.primaryLinks.ui',
      id: 'header.learnerDashboard.link3',
      op: WidgetOperationTypes.APPEND,
      element: (<LinkMenuItem label="Link 3" url="#" variant="navLink" />
      )
    },
    {
      slotId: 'frontend.shell.header.primaryLinks.ui',
      id: 'header.learnerDashboard.link4',
      op: WidgetOperationTypes.APPEND,
      element: (<LinkMenuItem label="Link 4" url="#" variant="navLink" />
      )
    },
  ]
};

export default config;
