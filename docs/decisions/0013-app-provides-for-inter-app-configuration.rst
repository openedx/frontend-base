App ``provides`` for Inter-App Configuration
############################################

Status
======

Proposed


Context
=======

frontend-base applications currently communicate through two structured
mechanisms: ``routes``, ``slots``, and ``providers``.  All are defined in the
``App`` interface and consumed directly by frontend-base's runtime.

As the platform evolves, however, situations arise where apps need to share
configuration data with each other that frontend-base itself has no reason to
understand.  A concrete example is the course navigation bar introduced in the
header app. The header needs to know two things from other apps:

1. Which apps want the course navigation bar to appear (previously a hardcoded
   list of roles in ``constants.ts``).

2. Which URL patterns each app handles client-side, so the navigation bar can
   use ``navigate()`` instead of a full page load for same-origin tab URLs.

There is no place in the current ``App`` interface to express this.  Extending
the interface with a dedicated field (e.g. ``courseNavigation``) would work for
this specific case, but the pattern would repeat: every new inter-app
coordination need would require another field, another type change, and another
release of frontend-base.

Meanwhile, ``routes`` and ``slots`` are structured because frontend-base's
runtime needs to interpret them directly.  It builds a router from ``routes``
and renders widgets from ``slots``.  Any new field that frontend-base itself
must consume deserves the same treatment: a dedicated, typed field.

But for generic configuration between apps - where frontend-base is just the
conduit - a generic mechanism is more appropriate.


Decision
========

Add an optional ``provides`` field to the ``App`` interface::

    export interface App {
      appId: string,
      messages?: LocalizedMessages,
      routes?: RoleRouteObject[],
      providers?: AppProvider[],
      slots?: SlotOperation[],
      config?: AppConfig,
      provides?: Record<string, unknown>,
    }

``provides`` is a flat key-value map where each key is a namespaced identifier
agreed upon by the providing and consuming apps, and the value takes whatever
shape the consuming app expects.  The runtime stores this data and exposes it
through a runtime function, but does not interpret it.

A runtime helper would look something like::

    // Returns all `provides` entries matching the given identifier.
    function getProvides(id: string): unknown[]


Guidelines
==========

1. ``provides`` is for inter-app configuration that the runtime does not need
   to interpret.  If it must consume the data to function (as it does with
   routes and slots), a dedicated typed field on ``App`` is the right choice.

2. Keys in ``provides`` should be their own namespaced identifiers, not
   duplicates of existing app, slot, or widget IDs.  This allows different
   widgets or other entities to consume the same provided data independently,
   without coupling the data's identity to a single consumer.

3. The shape of the value under each key is a contract between the providing and
   consuming apps.  It is not enforced by frontend-base.  Consuming apps should
   validate or type-guard the data they receive.

4. ``provides`` should not be used as a back door to modify the runtime's
   behavior.  It is not a configuration mechanism for the runtime itself.


Consequences
============

Apps gain a channel for coordination that does not require changes to
frontend-base's ``App`` type or runtime for each new use case.  The ``App``
interface grows by one optional field and remains stable as new inter-app
patterns emerge.

The trade-off is that ``provides`` data is untyped from frontend-base's
perspective.  Consuming apps bear the responsibility of defining, documenting,
and validating the shape of the data they expect.  This is acceptable because
the data is, by definition, outside frontend-base's domain.

Course bar example
------------------

As a concrete illustration, the Instructor Dashboard app could declare::

    const config: App = {
      appId: 'org.openedx.frontend.app.instructorDashboard',
      provides: {
        'org.openedx.frontend.provides.courseBarRoles.v1': [
          'org.openedx.frontend.role.instructorDashboard',
        ],
        'org.openedx.frontend.provides.courseBarMasqueradeRoles.v1': [
          'org.openedx.frontend.role.instructorDashboard',
        ],
      },
      routes: [...],
      slots: [...],
    };

The header's course bar has two parts: the tab navigation, which renders for
any role declared under ``courseBarRoles``, and the masquerade widget, which
additionally requires the role to be declared under ``courseBarMasqueradeRoles``.
Masquerade is therefore a refinement of the course bar: a role only present
in the masquerade list (without a matching course-bar declaration) is
ignored.  The course-bar role list also supplies which tab URLs can be
navigated client-side, by resolving roles to route paths via
``getUrlByRouteRole()``.


Rejected alternatives
=====================

Widget operations
-----------------

Each app could register its own widget into the course navigation bar slot
with an ``active`` condition on its role.  The ``OPTIONS`` operation can even
carry arbitrary data to a widget via ``useWidgetOptions``.  However, the
navigation bar needs to know which apps participate *before* it renders, in the
slot ``condition.callback`` that decides whether to render at all.
``useWidgetOptions`` is a React hook that only works inside a rendered
component, so the data arrives too late for the condition check.

The component could work around this by always mounting, reading options, and
returning ``null`` when no apps have registered.  But this means the component
and its hooks (including the API call to fetch course metadata) would run on
every page, even where no app participates in the navigation bar.

Hoisted providers
-----------------

Each app could register a React context provider exposing its role list, and
the navigation bar could consume those contexts.  All app providers are already
hoisted and combined into a single tree, so the data would be available.

This was rejected because it is a heavy mechanism for passing a small piece of
static data.  Each app would need a context, a provider component, and a
consumer hook, and the header would need to aggregate across multiple contexts
with no standard way to discover them.  Providers are the right tool when data
changes over time and consumers need to re-render.  The course navigation roles
are fixed at registration time and never change, making ``provides`` a more
natural fit.

Reusing ``App.config``
----------------------

The existing ``App.config`` field has the same type (``Record<string, unknown>``)
and could theoretically hold provided data.  However, ``config`` is per-app: it
is retrieved by ``appId`` via ``getAppConfig()`` and is meant to hold settings
*for* that app.  ``provides`` has a cross-app access pattern:
``getProvides()`` collects entries from all apps that declared data under a
given identifier.  Merging the two would require scanning every app's config
for a specific key, blurring the distinction between settings an app consumes
and data it exposes for others.
