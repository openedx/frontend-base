############################################
Slot layouts instead of a wrapping operation
############################################

Status
======

Accepted


Context
=======

Legacy ``@openedx/frontend-plugin-framework`` provided a ``Wrap`` plugin
operation that allowed a plugin to wrap an existing widget's rendered output
with an arbitrary React component.  The wrapper received the original content
as a ``component`` prop and could add markup around it, conditionally render
it, or replace it entirely.

The canonical example of this was
`frontend-plugin-aspects <https://github.com/openedx/frontend-plugin-aspects>`_,
the Open edX analytics plugin.  It used ``Wrap`` on the authoring MFE's
sidebar slots to implement a toggle between the default sidebar and an
analytics sidebar:

.. code-block:: typescript

   // frontend-plugin-aspects/src/components/SidebarToggleWrapper.tsx
   export const SidebarToggleWrapper = ({ component }: { component: ReactNode }) => {
     const { sidebarOpen } = useAspectsSidebarContext();
     return !sidebarOpen && component;
   };

   // frontend-plugin-aspects/src/plugin-slots.ts
   {
     op: PLUGIN_OPERATIONS.Wrap,
     widgetId: 'default_contents',
     wrapper: SidebarToggleWrapper,
   }

When the user opened the Aspects sidebar, the wrapper hid the default sidebar
content; when the Aspects sidebar was closed, the default content reappeared.
The plugin also used an ``Insert`` operation to add its own sidebar widget to
the slot.

With the introduction of ``frontend-base`` as the successor to both
``frontend-plugin-framework`` and ``frontend-platform``, the slot and widget
architecture was redesigned.  The question arose as to whether a ``Wrap``
operation should be carried forward into the new architecture.


Decision
========

We will **not** implement a slot wrapping operation in ``frontend-base``.  The
use cases previously served by wrapping are better addressed by improving the
existing layout system.

``useWidgets()`` will be enriched with helper methods that let layouts filter
widgets by identity (ID or role).  Internally, this metadata already exists
throughout the widget pipeline; it is only stripped at the very end before being
returned to layouts.  The enriched return value remains a ``ReactNode[]`` that
renders identically when used as-is (preserving backwards compatibility), but
adds methods like ``byId()``, ``withoutId()``, ``byRole()``, and
``withoutRole()`` for selective rendering.

For the sidebar toggle use case, a plugin can replace the slot's layout and
add its own widget, using only existing operations:

.. code-block:: typescript

   // Replace the sidebar layout with a toggle-aware layout
   {
     slotId: 'org.openedx.frontend.slot.authoring.outlineSidebar.v1',
     op: LayoutOperationTypes.REPLACE,
     component: AspectsSidebarLayout,
   },
   // Add the Aspects sidebar as a widget
   {
     slotId: 'org.openedx.frontend.slot.authoring.outlineSidebar.v1',
     id: 'org.openedx.frontend.widget.aspects.outlineSidebar',
     op: WidgetOperationTypes.APPEND,
     component: CourseOutlineSidebar,
   },

Where the custom layout controls the toggle:

.. code-block:: typescript

   const aspectsWidget = 'org.openedx.frontend.widget.aspects.outlineSidebar';

   function AspectsSidebarLayout() {
     const widgets = useWidgets();
     const { sidebarOpen } = useAspectsSidebarContext();

     if (sidebarOpen) {
       return <>{widgets.byId(aspectsWidget)}</>;
     }
     return <>{widgets.withoutId(aspectsWidget)}</>;
   }

This approach is preferable for several reasons:

Separation of concerns
  The toggle is not a property of an individual widget; it is a rendering
  strategy for the entire slot.  A layout makes this explicit.  With a wrapping
  operation, the toggle logic is bolted onto a specific widget ID, creating a
  hidden dependency between the wrapper and the slot's internal structure.

Explicit widget identity through standard hooks
  With ``useWidgets()`` exposing identity metadata, layouts can distinguish
  widgets through a documented, type-safe API.  The slot's children are
  available as the ``defaultContent`` widget, and plugin-added widgets are
  identified by their declared IDs.

Composability
  If two plugins both want to affect a slot's rendering strategy, two ``Wrap``
  operations on the same widget create nested wrappers with no coordination
  mechanism.  Layout replacements have a clear last-one-wins semantic, and a
  layout can use ``useLayoutOptions()`` to accept configuration from multiple
  plugins, enabling collaboration between them.


Consequences
============

Plugins that previously used ``Wrap`` to conditionally render or decorate slot
content will use layout replacements instead.  This requires the plugin author
to write a layout component, which is slightly more code than a wrapper
function, but provides full control over rendering with access to all of the
slot's hooks and context.

The array returned by ``useWidgets()`` will gain helper methods (``byId()``,
``withoutId()``, ``byRole()``, ``withoutRole()``) that let layouts selectively
render widgets.  Because the array elements remain plain ``ReactNode`` values,
existing layouts that render ``useWidgets()`` directly will continue to work
without modification.


Rejected alternatives
=====================

Widget wrapping operation
-------------------------

Adding a ``WRAP`` widget operation that takes a target widget ID and a wrapper
component was considered and rejected.  Beyond the design advantages of layouts
discussed above, a wrapping operation is fundamentally at odds with the
slot/layout/widget architecture in several ways:

Breaks the widget rendering pipeline
  Widgets are created, keyed, and enclosed in a ``WidgetProvider`` before they
  are handed to the layout for rendering.  A wrapping operation must either
  intervene before this pipeline (losing access to the rendered node) or after
  it (wrapping around the ``WidgetProvider``).  In the latter case, the wrapper
  sits outside the widget's context boundary, so it cannot use widget-level
  hooks like ``useWidgetOptions()``.  In both cases, the React ``key`` assigned
  to the ``WidgetProvider`` ends up on an inner element rather than the
  outermost one, breaking React's list reconciliation for any slot that renders
  multiple widgets.

Interacts poorly with other widget operations
  Widget operations are sorted so that absolute operations (``APPEND``,
  ``PREPEND``) execute before relative ones, guaranteeing that target widgets
  exist when referenced.  A wrapping operation adds another ordering
  dependency: it must run after its target widget is created, but also
  interacts with ``REPLACE`` (which discards and recreates the target) and
  ``REMOVE`` (which deletes it).  These interactions create edge cases that are
  difficult to specify and surprising to plugin authors, especially when
  operations originate from different plugins that are unaware of each other.

Bypasses the layout's role
  The layout is the architectural component responsible for deciding how a
  slot's content is presented.  A wrapping operation that modifies individual
  widgets before they reach the layout undermines this responsibility, creating
  a second, parallel mechanism for controlling rendering.  When both are in
  play, the resulting behavior depends on the interleaving of layout logic and
  wrapper logic in ways that are hard to reason about.


