###############################
Per-app HTTP request middleware
###############################

Status
======

Proposed


Context
=======

ADR 0006 introduced an ``authMiddleware`` option for ``initialize()``. When
supplied, the array of middleware functions is applied to every HTTP client
the auth service creates, giving a call site a single place to attach
request interceptors that run on all authenticated API calls.

The mechanism works well when the caller controls ``initialize()``. In a
frontend-base site the shell owns that call and invokes it with only
the ``messages`` option; there is no path for an individual ``App`` to
contribute middleware at boot time without patching the shell.

ADR 0014 addressed an analogous problem for external scripts. Scripts were
previously hardcoded in ``initialize()`` and therefore non-configurable.
ADR 0014 moved them to a per-app ``externalScripts`` field on ``App``,
following the accumulation pattern already used by ``routes`` and ``slots``:
the shell collects the field from every registered ``App`` and applies them
all, so multiple apps compose rather than clobber each other.

HTTP request middleware has exactly the same shape: an ``App`` may need to
attach a request interceptor that reads data it owns â€” a cookie it wrote in
``externalScripts``, a value from its own ``App.config`` â€” and forwards it
as a request header on every authenticated call. Without a ``middleware``
field on ``App``, the only alternatives are to reach into auth service
internals directly (breaking encapsulation) or to require the shell to
special-case the app (coupling the shell to app-level concerns).

A concrete motivating case is UTM attribution. An ``App`` that captures
UTM parameters from the page URL at boot time (via ``externalScripts``) also
needs to attach an interceptor that reads those parameters from a cookie and
appends them as a request header on every outbound authenticated API call.
This lets the backend receive and persist attribution data regardless of
whether the cookie's ``SameSite`` policy allows it to be transmitted
automatically on cross-origin requests. There is currently no way to wire
this interceptor from the ``App`` without involving the shell.


Decision
========

Add an optional ``middleware`` field to the ``App`` interface, using the
same ``RequestMiddleware`` type already introduced by ADR 0006 for the
``authMiddleware`` option in ``initialize()``::

    interface App {
      // ...existing fields unchanged...
      middleware?: RequestMiddleware[];
    }

No new type is introduced. ``RequestMiddleware`` already exists in
``runtime/types.ts`` as the element type of the ``authMiddleware`` array.

The shell accumulates ``middleware`` entries from every registered ``App``,
following the same pattern as ``routes``, ``slots``, and ``externalScripts``::

    const allMiddleware = apps.flatMap(app => app.middleware ?? []);

The resulting array is passed to the auth service alongside any
``authMiddleware`` already present in the site's ``initialize()`` call.
Application order is deterministic: entries are accumulated in registration
order as declared in ``site.config.tsx``. The auth service implementation
is unchanged.

An ``App`` declares middleware alongside its other fields::

    // src/index.ts â€” inside a UTM attribution App package
    import { getAppConfig } from '@openedx/frontend-base';
    import type { App, RequestMiddleware } from '@openedx/frontend-base';

    const utmRequestMiddleware: RequestMiddleware = (requestConfig) => {
      const { cookieName } = getAppConfig();
      const raw = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${cookieName}=`))
        ?.split('=').slice(1).join('=');
      if (raw) {
        requestConfig.headers['X-Openedx-Utm-Params'] = decodeURIComponent(raw);
      }
      return requestConfig;
    };

    const utmAttributionApp: App = {
      id: 'org.openedx.frontend.app.utm-attribution',
      config: {
        cookieName: 'openedx.utm',
      },
      externalScripts: [
        // captures UTM params from URL and writes cookie at boot
      ],
      middleware: [utmRequestMiddleware],
    };

    export default utmAttributionApp;

Operators register the app in ``site.config.tsx`` like any other ``App``::

    // site.config.tsx
    import utmAttributionApp from '@openedx/frontend-app-utm-attribution';

    const config: SiteConfig = {
      apps: [
        utmAttributionApp,
        // ...other apps
      ],
    };

    export default config;


Consequences
============

Positive
--------

* An ``App`` can contribute HTTP request interceptors it owns without
  reaching into auth service internals or requiring shell changes beyond
  this ADR.

* Multiple apps can each contribute middleware; they compose via
  accumulation rather than clobbering each other, following the same
  pattern as ``routes``, ``slots``, and ``externalScripts``.

* The auth service implementation is unchanged. The ``middleware`` field
  on ``App`` is a shell-level concern resolved at the ``initialize()`` call
  site.

* Cross-cutting request concerns â€” UTM attribution, request tracing,
  per-tenant header injection â€” can be packaged as self-contained ``App``
  packages that operators opt into via ``site.config.tsx`` with no changes
  to ``frontend-base`` core beyond this ADR.

Negative
--------

* Middleware declared on an ``App`` runs on **all** authenticated requests
  site-wide, not only requests made by that app. Authors must ensure their
  middleware is safe to run unconditionally and is a no-op when the data it
  depends on is absent (for example, when no UTM cookie has been written).

* Application order is implicit (registration order in ``site.config.tsx``).
  If two apps declare middleware that both set the same header, the last
  registered app wins. This matches the precedence rule for ``slots`` but
  should be documented in the how-to guide for authors.

* Response interceptors are out of scope. If a future use case requires
  them, a separate ADR should extend this pattern rather than widening the
  ``RequestMiddleware`` type in place.


Rejected Alternatives
=====================

Expose ``authMiddleware`` in ``SiteConfig``
-------------------------------------------

Adding ``authMiddleware`` directly to the ``SiteConfig`` type would allow
operators to set it from ``site.config.tsx`` today, without any ``App``
interface change. ADR 0014 rejected the equivalent site-level approach for
external scripts because it collapses per-app ownership into a single flat
list with no clear attribution, and requires "don't run twice" guards when
the same interceptor is referenced from multiple paths. The same applies
here. Per-app ownership is the right model: it is clear which middleware
belongs to which concern, and apps can be added or removed without side
effects on unrelated interceptors.

Custom lifecycle plugin interface
---------------------------------

An earlier version of this proposal introduced a new ``AppLifecyclePlugin``
interface with hooks such as ``onAppInit``, ``onAuthenticatedHttpClientCreated``,
and ``onLogout``. On review it became clear that frontend-base already covers
the ``onAppInit`` and session-change shapes via existing lifecycle events
(``SITE_CONFIG_INITIALIZED``, ``AUTHENTICATED_USER_CHANGED``, and so on), and
that ``externalScripts`` covers the "run code at boot with this app's config"
shape (as noted in ADR 0014, with consent banners as the motivating example).
Client-side logout has no hook because logout is a redirect to the LMS logout
URL; the correct handling is server-side cookie deletion in the logout view.
The only genuine client-side gap was the inability to contribute request
middleware from an ``App``, which this ADR addresses directly with a minimal
targeted change rather than a new plugin abstraction.


References
==========

* ADR 0006: Middleware support for HTTP clients
  ``docs/decisions/0006-middleware-support-for-http-clients.rst``

* ADR 0014: External scripts and contrib apps
  ``docs/decisions/0014-per-app-external-scripts.rst``

* RFC: Platform-level UTM attribution support for authenticated MFE users
  https://discuss.openedx.org/t/rfc-platform-level-utm-attribution-support-for-authenticated-mfe-users/19182

* Companion implementation: ``@openedx/frontend-app-utm-attribution``
  (pending repo provisioning under the ``openedx`` GitHub organisation)