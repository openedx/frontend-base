import { LayoutOperationTypes, WidgetOperationTypes } from '../../../runtime';
import { App } from '../../../types';
import HorizontalSlotLayout from './HorizontalSlotLayout';
import SlotShowcasePage from './SlotShowcasePage';
import WidgetWithOptions from './WidgetWithOptions';

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
      element: (<div>Child One</div>)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.simple.ui',
      id: 'slot-showcase.simple.child2',
      op: WidgetOperationTypes.APPEND,
      element: (<div>Child Two</div>)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.simple.ui',
      id: 'slot-showcase.simple.child3',
      op: WidgetOperationTypes.APPEND,
      element: (<div>Child Three</div>)
    },

    // Custom Layout
    {
      slotId: 'frontend.dev-project.slot-showcase.custom.ui',
      id: 'slot-showcase.custom.child1',
      op: WidgetOperationTypes.APPEND,
      element: (<div>Child One</div>)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.custom.ui',
      id: 'slot-showcase.custom.child2',
      op: WidgetOperationTypes.APPEND,
      element: (<div>Child Two</div>)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.custom.ui',
      id: 'slot-showcase.custom.child3',
      op: WidgetOperationTypes.APPEND,
      element: (<div>Child Three</div>)
    },

    // Override custom layout
    {
      slotId: 'frontend.dev-project.slot-showcase.customConfig.ui',
      id: 'slot-showcase.customConfig.child1',
      op: WidgetOperationTypes.APPEND,
      element: (<div>Child One</div>)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.customConfig.ui',
      id: 'slot-showcase.customConfig.child2',
      op: WidgetOperationTypes.APPEND,
      element: (<div>Child Two</div>)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.customConfig.ui',
      id: 'slot-showcase.customConfig.child3',
      op: WidgetOperationTypes.APPEND,
      element: (<div>Child Three</div>)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.customConfig.ui',
      op: LayoutOperationTypes.LAYOUT,
      layout: HorizontalSlotLayout,
    },

    // Layout Options
    {
      slotId: 'frontend.dev-project.slot-showcase.layoutWithOptions.ui',
      op: LayoutOperationTypes.OPTIONS,
      options: {
        title: <span>Bar (<code>LayoutOperationTypes.OPTIONS</code>)</span>,
      }
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.layoutWithOptions.ui',
      id: 'slot-showcase.layoutWithOptions.child1',
      op: WidgetOperationTypes.APPEND,
      element: (<div>Child One</div>)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.layoutWithOptions.ui',
      id: 'slot-showcase.layoutWithOptions.child2',
      op: WidgetOperationTypes.APPEND,
      element: (<div>Child Two</div>)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.layoutWithOptions.ui',
      id: 'slot-showcase.layoutWithOptions.child3',
      op: WidgetOperationTypes.APPEND,
      element: (<div>Child Three</div>)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.layoutWithOptionsDefault.ui',
      id: 'slot-showcase.layoutWithOptionsDefault.child1',
      op: WidgetOperationTypes.APPEND,
      element: (<div>Child One</div>)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.layoutWithOptionsDefault.ui',
      id: 'slot-showcase.layoutWithOptionsDefault.child2',
      op: WidgetOperationTypes.APPEND,
      element: (<div>Child Two</div>)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.layoutWithOptionsDefault.ui',
      id: 'slot-showcase.layoutWithOptionsDefault.child3',
      op: WidgetOperationTypes.APPEND,
      element: (<div>Child Three</div>)
    },

    // TODO: Override Layout

    // Prepending
    {
      slotId: 'frontend.dev-project.slot-showcase.prepending.ui',
      id: 'slot-showcase.prepending.child1',
      op: WidgetOperationTypes.APPEND,
      element: (<div>Child One (<code>WidgetOperationTypes.APPEND</code>)</div>)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.prepending.ui',
      id: 'slot-showcase.prepending.child2',
      op: WidgetOperationTypes.APPEND,
      element: (<div>Child Two (<code>WidgetOperationTypes.APPEND</code>)</div>)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.prepending.ui',
      id: 'slot-showcase.prepending.child3',
      op: WidgetOperationTypes.PREPEND,
      element: (<div>Child Three (<code>WidgetOperationTypes.PREPEND</code>)</div>)
    },

    // Inserting
    {
      slotId: 'frontend.dev-project.slot-showcase.inserting.ui',
      id: 'slot-showcase.inserting.child4',
      op: WidgetOperationTypes.INSERT_AFTER,
      relatedId: 'slot-showcase.inserting.child2',
      element: (<div>Child Four (<code>WidgetOperationTypes.INSERT_AFTER</code>)</div>)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.inserting.ui',
      id: 'slot-showcase.inserting.child5',
      op: WidgetOperationTypes.INSERT_BEFORE,
      relatedId: 'slot-showcase.inserting.child2',
      element: (<div>Child Five (<code>WidgetOperationTypes.INSERT_BEFORE</code>)</div>)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.inserting.ui',
      id: 'slot-showcase.inserting.child1',
      op: WidgetOperationTypes.APPEND,
      element: (<div>Child One</div>)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.inserting.ui',
      id: 'slot-showcase.inserting.child2',
      op: WidgetOperationTypes.APPEND,
      element: (<div>Child Two</div>)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.inserting.ui',
      id: 'slot-showcase.inserting.child3',
      op: WidgetOperationTypes.APPEND,
      element: (<div>Child Three</div>)
    },

    // Replacing
    {
      slotId: 'frontend.dev-project.slot-showcase.replacing.ui',
      id: 'slot-showcase.replacing.child1',
      op: WidgetOperationTypes.APPEND,
      element: (<div>Child One</div>)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.replacing.ui',
      id: 'slot-showcase.replacing.child2',
      op: WidgetOperationTypes.APPEND,
      element: (<div>Child Two</div>)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.replacing.ui',
      id: 'slot-showcase.replacing.child3',
      op: WidgetOperationTypes.APPEND,
      element: (<div>Child Three</div>)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.replacing.ui',
      id: 'slot-showcase.replacing.child4',
      op: WidgetOperationTypes.REPLACE,
      relatedId: 'slot-showcase.replacing.child2',
      element: (<div>Child Four (<code>WidgetOperationTypes.REPLACE</code>)</div>)
    },

    // Hiding
    {
      slotId: 'frontend.dev-project.slot-showcase.removing.ui',
      id: 'slot-showcase.removing.child1',
      op: WidgetOperationTypes.APPEND,
      element: (<div>Child One</div>)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.removing.ui',
      id: 'slot-showcase.removing.child2',
      op: WidgetOperationTypes.APPEND,
      element: (<div>Child Two</div>)
    },
    {
      slotId: 'frontend.dev-project.slot-showcase.removing.ui',
      id: 'slot-showcase.removing.child3',
      op: WidgetOperationTypes.APPEND,
      element: (<div>Child Three</div>)
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
        title: <span>Bar (<code>WidgetOperationTypes.OPTIONS</code>)</span>,
      }
    },
  ]
};

export default config;
