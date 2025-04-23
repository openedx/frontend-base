import { LayoutOperationTypes, WidgetOperationTypes } from '../../../runtime';
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

const config: App = {
  routes: [{
    path: '/slots',
    id: 'dev-project.slots-showcase',
    Component: SlotShowcasePage,
    handle: {
      role: 'slotShowcase',
    }
  }],
  slots: [
    // Simple
    {
      slotId: 'frontend.dev-project.slot-showcase.simple.ui',
      id: 'slot-showcase.simple.child1',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child One" />)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.simple.ui',
      id: 'slot-showcase.simple.child2',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Two" />)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.simple.ui',
      id: 'slot-showcase.simple.child3',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Three" />)
    },

    // Custom Layout
    {
      slotId: 'frontend.dev-project.slot-showcase.custom.ui',
      id: 'slot-showcase.custom.child1',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child One" />)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.custom.ui',
      id: 'slot-showcase.custom.child2',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Two" />)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.custom.ui',
      id: 'slot-showcase.custom.child3',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Three" />)
    },

    // Override custom layout
    {
      slotId: 'frontend.dev-project.slot-showcase.customConfig.ui',
      id: 'slot-showcase.customConfig.child1',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child One" />)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.customConfig.ui',
      id: 'slot-showcase.customConfig.child2',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Two" />)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.customConfig.ui',
      id: 'slot-showcase.customConfig.child3',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Three" />)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.customConfig.ui',
      op: LayoutOperationTypes.REPLACE,
      element: <HorizontalSlotLayout />,
    },

    // Layout Options
    {
      slotId: 'frontend.dev-project.slot-showcase.layoutWithOptions.ui',
      op: LayoutOperationTypes.OPTIONS,
      options: {
        title: (<Title title="Bar" op="LayoutOperationTypes.OPTIONS" />),
      }
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.layoutWithOptions.ui',
      id: 'slot-showcase.layoutWithOptions.child1',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child One" />)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.layoutWithOptions.ui',
      id: 'slot-showcase.layoutWithOptions.child2',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Two" />)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.layoutWithOptions.ui',
      id: 'slot-showcase.layoutWithOptions.child3',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Three" />)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.layoutWithOptionsDefault.ui',
      id: 'slot-showcase.layoutWithOptionsDefault.child1',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child One" />)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.layoutWithOptionsDefault.ui',
      id: 'slot-showcase.layoutWithOptionsDefault.child2',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Two" />)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.layoutWithOptionsDefault.ui',
      id: 'slot-showcase.layoutWithOptionsDefault.child3',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Three" />)
    },

    // TODO: Override Layout

    // Prepending
    {
      slotId: 'frontend.dev-project.slot-showcase.prepending.ui',
      id: 'slot-showcase.prepending.child1',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child One" op="WidgetOperationTypes.APPEND" />)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.prepending.ui',
      id: 'slot-showcase.prepending.child2',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Two" op="WidgetOperationTypes.APPEND" />)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.prepending.ui',
      id: 'slot-showcase.prepending.child3',
      op: WidgetOperationTypes.PREPEND,
      element: (<Child title="Child Three" op="WidgetOperationTypes.PREPEND" />)
    },

    // Inserting
    {
      slotId: 'frontend.dev-project.slot-showcase.inserting.ui',
      id: 'slot-showcase.inserting.child4',
      op: WidgetOperationTypes.INSERT_AFTER,
      relatedId: 'slot-showcase.inserting.child2',
      element: (<Child title="Child Four" op="WidgetOperationTypes.INSERT_AFTER" />)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.inserting.ui',
      id: 'slot-showcase.inserting.child5',
      op: WidgetOperationTypes.INSERT_BEFORE,
      relatedId: 'slot-showcase.inserting.child2',
      element: (<Child title="Child Five" op="WidgetOperationTypes.INSERT_BEFORE" />)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.inserting.ui',
      id: 'slot-showcase.inserting.child1',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child One" />)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.inserting.ui',
      id: 'slot-showcase.inserting.child2',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Two" />)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.inserting.ui',
      id: 'slot-showcase.inserting.child3',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Three" />)
    },

    // Replacing
    {
      slotId: 'frontend.dev-project.slot-showcase.replacing.ui',
      id: 'slot-showcase.replacing.child1',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child One" />)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.replacing.ui',
      id: 'slot-showcase.replacing.child2',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Two" />)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.replacing.ui',
      id: 'slot-showcase.replacing.child3',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Three" />)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.replacing.ui',
      id: 'slot-showcase.replacing.child4',
      op: WidgetOperationTypes.REPLACE,
      relatedId: 'slot-showcase.replacing.child2',
      element: (<Child title="Child Four" op="WidgetOperationTypes.REPLACE" />)
    },

    // Hiding
    {
      slotId: 'frontend.dev-project.slot-showcase.removing.ui',
      id: 'slot-showcase.removing.child1',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child One" />)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.removing.ui',
      id: 'slot-showcase.removing.child2',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Two" />)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.removing.ui',
      id: 'slot-showcase.removing.child3',
      op: WidgetOperationTypes.APPEND,
      element: (<Child title="Child Three" />)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.removing.ui',
      op: WidgetOperationTypes.REMOVE,
      relatedId: 'slot-showcase.removing.child2',
    },

    // Widget Options
    {
      slotId: 'frontend.dev-project.slot-showcase.widgetOptions.ui',
      id: 'slot-showcase.widgetOptions.child1',
      op: WidgetOperationTypes.APPEND,
      component: WidgetWithOptions,
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.widgetOptions.ui',
      id: 'slot-showcase.widgetOptions.child2',
      op: WidgetOperationTypes.APPEND,
      component: WidgetWithOptions,
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.widgetOptions.ui',
      relatedId: 'slot-showcase.widgetOptions.child2',
      op: WidgetOperationTypes.OPTIONS,
      options: {
        title: (<Title title="Bar" op="WidgetOperationTypes.OPTIONS" />
        ),
      }
    },
  ]
};

export default config;
