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

const app: App = {
  appId: 'org.openedx.frontend.app.slotShowcase',
  routes: [{
    id: 'org.openedx.frontend.route.slotShowcase',
    path: '/slots',
    Component: SlotShowcasePage,
    handle: {
      role: 'org.openedx.frontend.role.slotShowcase',
    }
  }],
  slots: [
    // Simple
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseSimple',
      id: 'org.openedx.frontend.widget.slotShowcase.simpleChild1',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child One" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseSimple',
      id: 'org.openedx.frontend.widget.slotShowcase.simpleChild2',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Two" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseSimple',
      id: 'org.openedx.frontend.widget.slotShowcase.simpleChild3',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Three" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseSimpleWithDefaultContent',
      id: 'org.openedx.frontend.widget.slotShowcase.simpleChild4',
      op: WidgetOperationTypes.APPEND,
      component: TakesProps
    },
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseSimpleWithDefaultContent',
      id: 'org.openedx.frontend.widget.slotShowcase.simpleChild5',
      op: WidgetOperationTypes.APPEND,
      component: TakesPropsViaContext
    },

    // Custom Layout
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseCustom',
      id: 'org.openedx.frontend.widget.slotShowcase.customChild1',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child One" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseCustom',
      id: 'org.openedx.frontend.widget.slotShowcase.customChild2',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Two" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseCustom',
      id: 'org.openedx.frontend.widget.slotShowcase.customChild3',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Three" />)
    },

    // Override custom layout
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseCustomConfig',
      id: 'org.openedx.frontend.widget.slotShowcase.customConfigChild1',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child One" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseCustomConfig',
      id: 'org.openedx.frontend.widget.slotShowcase.customConfigChild2',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Two" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseCustomConfig',
      id: 'org.openedx.frontend.widget.slotShowcase.customConfigChild3',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Three" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseCustomConfig',
      op: LayoutOperationTypes.REPLACE,
      element: <HorizontalSlotLayout />,
    },

    // Layout Options
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseLayoutWithOptions',
      op: LayoutOperationTypes.OPTIONS,
      options: {
        title: (<Title title="Bar" op="LayoutOperationTypes.OPTIONS" />),
      }
    },
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseLayoutWithOptions',
      id: 'org.openedx.frontend.widget.slotShowcase.layoutWithOptionsChild1',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child One" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseLayoutWithOptions',
      id: 'org.openedx.frontend.widget.slotShowcase.layoutWithOptionsChild2',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Two" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseLayoutWithOptions',
      id: 'org.openedx.frontend.widget.slotShowcase.layoutWithOptionsChild3',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Three" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseLayoutWithOptionsDefault',
      id: 'org.openedx.frontend.widget.slotShowcase.layoutWithOptionsDefaultChild1',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child One" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseLayoutWithOptionsDefault',
      id: 'org.openedx.frontend.widget.slotShowcase.layoutWithOptionsDefaultChild2',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Two" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseLayoutWithOptionsDefault',
      id: 'org.openedx.frontend.widget.slotShowcase.layoutWithOptionsDefaultChild3',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Three" />)
    },

    // TODO: Override Layout

    // Prepending
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcasePrepending',
      id: 'org.openedx.frontend.widget.slotShowcase.prependingChild1',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child One" op="WidgetOperationTypes.APPEND" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcasePrepending',
      id: 'org.openedx.frontend.widget.slotShowcase.prependingChild2',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Two" op="WidgetOperationTypes.APPEND" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcasePrepending',
      id: 'org.openedx.frontend.widget.slotShowcase.prependingChild3',
      op: WidgetOperationTypes.PREPEND,
      element: (<Child title="Child Three" op="WidgetOperationTypes.PREPEND" />)
    },

    // Inserting
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseInserting',
      id: 'slot-showcase.inserting.child4',
      op: WidgetOperationTypes.INSERT_AFTER,
      relatedId: 'org.openedx.frontend.widget.slotShowcase.insertingChild2',
      element: (<Child title="Child Four" op="WidgetOperationTypes.INSERT_AFTER" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseInserting',
      id: 'slot-showcase.inserting.child5',
      op: WidgetOperationTypes.INSERT_BEFORE,
      relatedId: 'org.openedx.frontend.widget.slotShowcase.insertingChild2',
      element: (<Child title="Child Five" op="WidgetOperationTypes.INSERT_BEFORE" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseInserting',
      id: 'org.openedx.frontend.widget.slotShowcase.insertingChild1',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child One" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseInserting',
      id: 'org.openedx.frontend.widget.slotShowcase.insertingChild2',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Two" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseInserting',
      id: 'org.openedx.frontend.widget.slotShowcase.insertingChild3',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Three" />)
    },

    // Replacing
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseReplacing',
      id: 'org.openedx.frontend.widget.slotShowcase.replacingChild1',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child One" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseReplacing',
      id: 'org.openedx.frontend.widget.slotShowcase.replacingChild2',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Two" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseReplacing',
      id: 'org.openedx.frontend.widget.slotShowcase.replacingChild3',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Three" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseReplacing',
      id: 'org.openedx.frontend.widget.slotShowcase.replacingChild4',
      op: WidgetOperationTypes.REPLACE,
      relatedId: 'org.openedx.frontend.widget.slotShowcase.replacingChild2',
      element: (<Child title="Child Four" op="WidgetOperationTypes.REPLACE" />)
    },

    // Hiding
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseRemoving',
      id: 'org.openedx.frontend.widget.slotShowcase.removingChild1',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child One" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseRemoving',
      id: 'org.openedx.frontend.widget.slotShowcase.removingChild2',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Two" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseRemoving',
      id: 'org.openedx.frontend.widget.slotShowcase.removingChild3',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Three" />)
    },
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseRemoving',
      op: WidgetOperationTypes.REMOVE,
      relatedId: 'org.openedx.frontend.widget.slotShowcase.removingChild2',
    },

    // Widget Options
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseWidgetOptions',
      id: 'org.openedx.frontend.widget.slotShowcase.widgetOptionsChild1',
      op: WidgetOperationTypes.APPEND,
      component: WidgetWithOptions,
    },
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseWidgetOptions',
      id: 'org.openedx.frontend.widget.slotShowcase.widgetOptionsChild2',
      op: WidgetOperationTypes.APPEND,
      component: WidgetWithOptions,
    },
    {
      slotId: 'org.openedx.frontend.slot.dev.slotShowcaseWidgetOptions',
      relatedId: 'org.openedx.frontend.widget.slotShowcase.widgetOptionsChild2',
      op: WidgetOperationTypes.OPTIONS,
      options: {
        title: (<Title title="Bar" op="WidgetOperationTypes.OPTIONS" />),
      }
    },

    // Header
    {
      slotId: 'org.openedx.frontend.slot.header.primaryLinks.v1',
      relatedId: 'org.openedx.frontend.widget.slotShowcase.headerLink',
      op: WidgetOperationTypes.OPTIONS,
      options: {
        title: 'Courses (modified)',
      },
      condition: {
        active: ['org.openedx.frontend.role.slotShowcase'],
      }
    },
    {
      slotId: 'org.openedx.frontend.slot.header.primaryLinks.v1',
      id: 'org.openedx.frontend.widget.slotShowcase.headerLinkAfter3',
      op: WidgetOperationTypes.INSERT_AFTER,
      relatedId: 'org.openedx.frontend.widget.slotShowcase.headerLink3',
      element: (<LinkMenuItem label="Link After 3" url="#" variant="navLink" />),
      condition: {
        active: ['org.openedx.frontend.role.slotShowcase'],
      }
    },
    {
      slotId: 'org.openedx.frontend.slot.header.primaryLinks.v1',
      id: 'org.openedx.frontend.widget.slotShowcase.headerPrimaryLinksDropdownPrepend',
      op: WidgetOperationTypes.PREPEND,
      element: (
        <NavDropdownMenuSlot id="org.openedx.frontend.slot.header.primaryLinksDropdown.v1" label="Resources" />
      ),
      condition: {
        active: ['org.openedx.frontend.role.slotShowcase']
      }
    },
    {
      slotId: 'org.openedx.frontend.slot.header.primaryLinksDropdown.v1',
      id: 'org.openedx.frontend.widget.slotShowcase.headerPrimaryLinksDropdownAppend',
      op: WidgetOperationTypes.APPEND,
      element: (
        <LinkMenuItem label="Resource 1" url="#" variant="dropdownItem" />
      ),
      condition: {
        active: ['org.openedx.frontend.role.slotShowcase'],
      }
    },
    {
      slotId: 'org.openedx.frontend.slot.header.primaryLinks.v1',
      id: 'org.openedx.frontend.widget.slotShowcase.headerLink3',
      op: WidgetOperationTypes.APPEND,
      element: (<LinkMenuItem label="Link 3" url="#" variant="navLink" />),
      condition: {
        active: ['org.openedx.frontend.role.slotShowcase'],
      }
    },
    {
      slotId: 'org.openedx.frontend.slot.header.primaryLinks.v1',
      id: 'org.openedx.frontend.widget.slotShowcase.headerLink4',
      op: WidgetOperationTypes.APPEND,
      element: (<LinkMenuItem label="Link 4" url="#" variant="navLink" />),
      condition: {
        active: ['org.openedx.frontend.role.slotShowcase'],
      }
    },
  ]
};

export default app;
