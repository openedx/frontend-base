import { NavDropdownMenuSlot } from '../..';
import LinkMenuItem from '../../menus/LinkMenuItem';
import { LayoutOperationTypes, WidgetOperationTypes, useSlotContext } from '../../../runtime';
import { App } from '../../../types';
import HorizontalSlotLayout from './HorizontalSlotLayout';
import SlotShowcasePage from './SlotShowcasePage';
import WidgetWithOptions from './WidgetWithOptions';

function Title({ title, op }: { title: string, op?: string }) {
  return (
    <span>
      {title}
      {op && (
        <>{' '}(<code>{op}</code>)</>
      )}
    </span>
  );
}

function Child({ title, op }: { title: string, op?: string }) {
  return (
    <div>
      {title}
      {op && (
        <span>{' '}(<code>{op}</code>)</span>
      )}
    </div>
  );
}

function TakesProps({ aSlotProp }: { aSlotProp: string }) {
  return (
    <div>And this is a slot prop that was passed down via props: <code>{aSlotProp}</code></div>
  );
}

function TakesPropsViaContext() {
  const slotContext = useSlotContext();
  const aSlotProp = typeof slotContext.aSlotProp === 'string' ? slotContext.aSlotProp : 'foo';
  return (
    <div>And this is the same prop, but accessed via slot context: <code>{aSlotProp}</code></div>
  );
}

const config: App = {
  appId: 'org.openedx.frontend.app.devSite.slotShowcase',
  routes: [{
    path: '/slots',
    id: 'dev-site.slots-showcase',
    Component: SlotShowcasePage,
    handle: {
      role: 'slotShowcase',
    }
  }],
  slots: [
    // Simple
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseSimple',
      id: 'slot-showcase.simple.child1',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child One" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseSimple',
      id: 'slot-showcase.simple.child2',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Two" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseSimple',
      id: 'slot-showcase.simple.child3',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Three" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseSimpleWithDefaultContent',
      id: 'slot-showcase.simple.child4',
      op: WidgetOperationTypes.APPEND,
      component: TakesProps
    },
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseSimpleWithDefaultContent',
      id: 'slot-showcase.simple.child5',
      op: WidgetOperationTypes.APPEND,
      component: TakesPropsViaContext
    },

    // Custom Layout
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseCustom',
      id: 'slot-showcase.custom.child1',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child One" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseCustom',
      id: 'slot-showcase.custom.child2',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Two" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseCustom',
      id: 'slot-showcase.custom.child3',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Three" />)
    },

    // Override custom layout
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseCustomConfig',
      id: 'slot-showcase.customConfig.child1',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child One" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseCustomConfig',
      id: 'slot-showcase.customConfig.child2',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Two" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseCustomConfig',
      id: 'slot-showcase.customConfig.child3',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Three" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseCustomConfig',
      op: LayoutOperationTypes.REPLACE,
      element: <HorizontalSlotLayout />,
    },

    // Layout Options
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseLayoutWithOptions',
      op: LayoutOperationTypes.OPTIONS,
      options: {
        title: (<Title title="Bar" op="LayoutOperationTypes.OPTIONS" />),
      }
    },
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseLayoutWithOptions',
      id: 'slot-showcase.layoutWithOptions.child1',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child One" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseLayoutWithOptions',
      id: 'slot-showcase.layoutWithOptions.child2',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Two" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseLayoutWithOptions',
      id: 'slot-showcase.layoutWithOptions.child3',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Three" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseLayoutWithOptionsDefault',
      id: 'slot-showcase.layoutWithOptionsDefault.child1',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child One" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseLayoutWithOptionsDefault',
      id: 'slot-showcase.layoutWithOptionsDefault.child2',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Two" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseLayoutWithOptionsDefault',
      id: 'slot-showcase.layoutWithOptionsDefault.child3',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Three" />)
    },

    // TODO: Override Layout

    // Prepending
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcasePrepending',
      id: 'slot-showcase.prepending.child1',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child One" op="WidgetOperationTypes.APPEND" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcasePrepending',
      id: 'slot-showcase.prepending.child2',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Two" op="WidgetOperationTypes.APPEND" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcasePrepending',
      id: 'slot-showcase.prepending.child3',
      op: WidgetOperationTypes.PREPEND,
      element: (<Child title="Child Three" op="WidgetOperationTypes.PREPEND" />)
    },

    // Inserting
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseInserting',
      id: 'slot-showcase.inserting.child4',
      op: WidgetOperationTypes.INSERT_AFTER,
      relatedId: 'slot-showcase.inserting.child2',
      element: (<Child title="Child Four" op="WidgetOperationTypes.INSERT_AFTER" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseInserting',
      id: 'slot-showcase.inserting.child5',
      op: WidgetOperationTypes.INSERT_BEFORE,
      relatedId: 'slot-showcase.inserting.child2',
      element: (<Child title="Child Five" op="WidgetOperationTypes.INSERT_BEFORE" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseInserting',
      id: 'slot-showcase.inserting.child1',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child One" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseInserting',
      id: 'slot-showcase.inserting.child2',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Two" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseInserting',
      id: 'slot-showcase.inserting.child3',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Three" />)
    },

    // Replacing
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseReplacing',
      id: 'slot-showcase.replacing.child1',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child One" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseReplacing',
      id: 'slot-showcase.replacing.child2',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Two" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseReplacing',
      id: 'slot-showcase.replacing.child3',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Three" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseReplacing',
      id: 'slot-showcase.replacing.child4',
      op: WidgetOperationTypes.REPLACE,
      relatedId: 'slot-showcase.replacing.child2',
      element: (<Child title="Child Four" op="WidgetOperationTypes.REPLACE" />)
    },

    // Hiding
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseRemoving',
      id: 'slot-showcase.removing.child1',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child One" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseRemoving',
      id: 'slot-showcase.removing.child2',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Two" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseRemoving',
      id: 'slot-showcase.removing.child3',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Three" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseRemoving',
      op: WidgetOperationTypes.REMOVE,
      relatedId: 'slot-showcase.removing.child2',
    },

    // Widget Options
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseWidgetOptions',
      id: 'slot-showcase.widgetOptions.child1',
      op: WidgetOperationTypes.APPEND,
      component: WidgetWithOptions,
    },
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseWidgetOptions',
      id: 'slot-showcase.widgetOptions.child2',
      op: WidgetOperationTypes.APPEND,
      component: WidgetWithOptions,
    },
    {
      slotId: 'org.openedx.frontend.slot.devSite.slotShowcaseWidgetOptions',
      relatedId: 'slot-showcase.widgetOptions.child2',
      op: WidgetOperationTypes.OPTIONS,
      options: {
        title: (<Title title="Bar" op="WidgetOperationTypes.OPTIONS" />),
      }
    },

    // Header
    {
      slotId: 'org.openedx.frontend.slot.header.primaryLinks.v1',
      relatedId: 'header.learnerDashboard.link',
      op: WidgetOperationTypes.OPTIONS,
      options: {
        title: 'Courses (modified)',
      },
      condition: {
        active: ['slotShowcase'],
      }
    },
    {
      slotId: 'org.openedx.frontend.slot.header.primaryLinks.v1',
      id: 'header.learnerDashboard.linkAfter3',
      op: WidgetOperationTypes.INSERT_AFTER,
      relatedId: 'header.learnerDashboard.link3',
      element: (<LinkMenuItem label="Link After 3" url="#" variant="navLink" />),
      condition: {
        active: ['slotShowcase'],
      }
    },
    {
      slotId: 'org.openedx.frontend.slot.header.primaryLinks.v1',
      id: 'header.coursesModified.primaryLinks.dropdown',
      op: WidgetOperationTypes.PREPEND,
      element: (
        <NavDropdownMenuSlot id="org.openedx.frontend.slot.header.primaryLinksDropdown.v1" label="Resources" />
      ),
      condition: {
        active: ['slotShowcase']
      }
    },
    {
      slotId: 'org.openedx.frontend.slot.header.primaryLinksDropdown.v1',
      id: 'header.coursesModified.primaryLinks.dropdown.1',
      op: WidgetOperationTypes.APPEND,
      element: (
        <LinkMenuItem label="Resource 1" url="#" variant="dropdownItem" />
      ),
      condition: {
        active: ['slotShowcase'],
      }
    },
    {
      slotId: 'org.openedx.frontend.slot.header.primaryLinks.v1',
      id: 'header.learnerDashboard.link3',
      op: WidgetOperationTypes.APPEND,
      element: (<LinkMenuItem label="Link 3" url="#" variant="navLink" />),
      condition: {
        active: ['slotShowcase'],
      }
    },
    {
      slotId: 'org.openedx.frontend.slot.header.primaryLinks.v1',
      id: 'header.learnerDashboard.link4',
      op: WidgetOperationTypes.APPEND,
      element: (<LinkMenuItem label="Link 4" url="#" variant="navLink" />),
      condition: {
        active: ['slotShowcase'],
      }
    },
  ]
};

export default config;
