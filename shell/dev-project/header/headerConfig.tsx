import { NavDropdownMenuSlot } from '../..';
import { WidgetOperationTypes } from '../../../runtime';
import { App } from '../../../types';
import LinkMenuItem from '../../menus/LinkMenuItem';
import CoursesLink from './CoursesLink';

const config: App = {
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
    {
      slotId: 'org.openedx.frontend.slot.header.primaryLinks.v1',
      relatedId: 'header.learnerDashboard.link',
      op: WidgetOperationTypes.OPTIONS,
      options: {
        title: 'Booyah yeah',
      }
    },
    {
      slotId: 'org.openedx.frontend.slot.header.primaryLinks.v1',
      id: 'header.learnerDashboard.linkAfter3',
      op: WidgetOperationTypes.INSERT_AFTER,
      relatedId: 'header.learnerDashboard.link3',
      element: (<LinkMenuItem label="Link After 3" url="#" variant="navLink" />
      )
    },
    {
      slotId: 'org.openedx.frontend.slot.header.primaryLinks.v1',
      id: 'header.booyah.primaryLinks.dropdown',
      op: WidgetOperationTypes.PREPEND,
      element: (
        <NavDropdownMenuSlot id="org.openedx.frontend.slot.header.primaryLinksDropdown.v1" label="Resources" />
      )
    },
    {
      slotId: 'org.openedx.frontend.slot.header.primaryLinksDropdown.v1',
      id: 'header.booyah.primaryLinks.dropdown.1',
      op: WidgetOperationTypes.APPEND,
      element: (
        <LinkMenuItem label="Resource 1" url="#" variant="dropdownItem" />
      )
    },
    {
      slotId: 'org.openedx.frontend.slot.header.primaryLinks.v1',
      id: 'header.learnerDashboard.link3',
      op: WidgetOperationTypes.APPEND,
      element: (<LinkMenuItem label="Link 3" url="#" variant="navLink" />
      )
    },
    {
      slotId: 'org.openedx.frontend.slot.header.primaryLinks.v1',
      id: 'header.learnerDashboard.link4',
      op: WidgetOperationTypes.APPEND,
      element: (<LinkMenuItem label="Link 4" url="#" variant="navLink" />
      )
    },
  ]
};

export default config;
