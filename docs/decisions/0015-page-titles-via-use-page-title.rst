#####################################
Apps set page titles via usePageTitle
#####################################

Status
======

Proposed


Context
=======

A frontend-base site renders all of its apps under a single ``index.html``
document with a static ``<title>`` element.  Once the shell is loaded, the
document title only changes if something inside the React tree explicitly
updates it.

Some apps, such as ``frontend-app-authn``, set a title on each route-level
page using ``<Helmet>`` from ``react-helmet``, with a localized message of
the form ``{Page Name} | {siteName}``.  Others set none.  The last title set
by any app sticks until it is replaced, so the browser tab continues to read
"Login | <site>" after a user signs in and lands on a page that doesn't set
its own.  This is a UX regression.

A consistent, app-owned pattern is needed so that every route updates the
title and apps don't silently inherit each other's state.


Decision
========

Every route-level page component in an app is responsible for setting the
document title.  Apps do this with the ``usePageTitle()`` hook exported by
frontend-base::

   usePageTitle(formatMessage(messages['login.page.title'], {
     siteName: getSiteConfig().siteName,
   }));

#. The title text comes from a localized message with the id pattern
   ``{page}.page.title`` and a default of ``{Page Name} | {siteName}``.
#. ``siteName`` is passed as an i18n parameter, sourced from
   ``getSiteConfig().siteName``, so localizers can re-order the segments
   without code changes.
#. The message lives in the same app, next to the page component.

A "route-level page component" means the component a route renders directly
(``LoginPage``, ``LearnerDashboard``, ``InstructorDashboard``, etc.), not
shared layouts, slots, or nested widgets.  Setting the title at the route
level keeps ownership unambiguous: the title belongs to the route, not to
whatever happens to render inside it.

When a route and one of its child routes both call ``usePageTitle()``, the
innermost call wins.  The title falls back to the outer one when the inner
component unmounts or passes an empty title (``undefined``, for instance).
When no mounted component sets a title, the last one stays.

The shell follows the same rule for its own not-found and error pages.

The static ``<title>`` in the site's ``index.html`` remains the fallback for
the brief period before the React tree mounts.  The operator should hard-code
it to the site name so the fallback is sensible if a page somehow fails to set
its own.


Consequences
============

Every app that renders user-visible pages calls ``usePageTitle()`` in each
route-level page component, and adds a ``{page}.page.title`` message per
page.  Apps that set titles with ``react-helmet`` switch to the hook and drop
the dependency.

Pages with dynamic titles (e.g., a course outline page that should read
"<Course Name> | <site>") still fit the pattern: the page component passes
``undefined`` until its data is available.  Until then, the tab shows the
parent route's title, or the previous page's if no parent sets one; that is
acceptable for the short data-loading window.

Because frontend-base owns the implementation, it can change without
touching the apps.  In particular, the hook can move to React 19's native
``<title>`` support once frontend-base adopts React 19.


Rejected alternatives
=====================

``<Helmet>`` from ``react-helmet``
----------------------------------

This is what apps already used, and what an earlier draft of this ADR
prescribed.  It was rejected because the library's last release dates from
2020, and it relies on ``UNSAFE_componentWillMount``, so every page that uses
it logs a React warning under the shell's ``<StrictMode>``.

``<Helmet>`` from ``react-helmet-async``
----------------------------------------

``react-helmet-async`` is maintained and does not warn, but every
``<Helmet>`` needs a ``<HelmetProvider>`` above it, which the shell would
have to render.  frontend-base would own the title anyway, with an extra
dependency, for a library apps would only use to set ``<title>``.

Setting the title centrally in the shell from route metadata
------------------------------------------------------------

The shell could read a ``title`` field from each ``RoleRouteObject`` and
apply it on navigation.  This was rejected because titles often depend on
data only available inside the page component after fetching (course names,
user names, dashboard counts).  A static metadata field can't express that,
and a function-of-loader-data field re-creates the page component's
responsibilities one layer up.
