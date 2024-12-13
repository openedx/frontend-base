import { NavDropdownMenuSlot } from '../..';
import { App, SlotOperationTypes } from '../../../types';
import LinkMenuItem from '../../menus/LinkMenuItem';
import CoursesLink from './CoursesLink';

const config: App = {
  slots: [
    {
      slotId: 'frontend.shell.header.primaryLinks.widget',
      id: 'header.learnerDashboard.link',
      op: SlotOperationTypes.APPEND,
      element: (
        <LinkMenuItem
          label={<CoursesLink />}
          url="#"
          variant="navLink"
        />
      )
    },
    {
      slotId: 'frontend.shell.header.primaryLinks.widget',
      id: 'header.booyah.primaryLinks.dropdown',
      op: SlotOperationTypes.APPEND,
      element: (
        <NavDropdownMenuSlot id="frontend.shell.header.primaryLinks.dropdown.widget" label="Resources" />
      )
    },
    {
      slotId: 'frontend.shell.header.primaryLinks.dropdown.widget',
      id: 'header.booyah.primaryLinks.dropdown.1',
      op: SlotOperationTypes.APPEND,
      element: (
        <LinkMenuItem label="Resource 1" url="#" variant="dropdownItem" />
      )
    },
  ]
};

export default config;
