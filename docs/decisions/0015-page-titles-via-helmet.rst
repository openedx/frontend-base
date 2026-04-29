####################################
Apps set page titles via react-helmet
####################################

Status
======

Proposed


Context
=======

A frontend-base site renders all of its apps under a single ``index.html``
document with a static ``<title>`` element.  Once the shell is loaded, the
document title only changes if something inside the React tree explicitly
updates it.

``frontend-app-authn`` sets a title on each route-level page using
``<Helmet>`` from ``react-helmet``, with a localized message of the form
``{Page Name} | {siteName}``::

   <Helmet>
     <title>
       {formatMessage(messages['login.page.title'], { siteName: getSiteConfig().siteName })}
     </title>
   </Helmet>

The last title set by any app sticks until it is replaced; and currently, Authn
is the only app that does this.  In practice, after a user signs in, the
browser tab continues to read "Login | <site>" while they sit on the learner
dashboard.  This is a UX regression.

A consistent, app-owned pattern is needed so that every route updates the
title and apps don't silently inherit each other's state.


Decision
========

Every route-level page component in an app is responsible for setting the
document title.  Apps do this with ``<Helmet>`` from ``react-helmet``,
following the pattern already established in Authn:

#. The page component renders a ``<Helmet>`` block containing a single
   ``<title>`` element.
#. The title text comes from a localized message with the id pattern
   ``{page}.page.title`` and a default of ``{Page Name} | {siteName}``.
#. ``siteName`` is passed as an i18n parameter, sourced from
   ``getSiteConfig().siteName``, so localizers can re-order the segments
   without code changes.
#. The message lives in the same app, next to the page component.

A "route-level page component" means the component a route renders directly
(``LoginPage``, ``LearnerDashboard``, ``InstructorDashboard``, etc.), not
shared layouts, slots, or nested widgets.  Setting the title at the route
level keeps ownership unambiguous: exactly one component per visible page
claims the title.

frontend-base does not own the title and does not re-export Helmet.  Each app
that needs to set a title declares ``react-helmet`` as a dependency.

The static ``<title>`` in the site's ``index.html`` remains the fallback for
the brief period before the React tree mounts.  The operator should hard-code
it to the site name so the fallback is sensible if a page somehow fails to set
its own.


Consequences
============

Every app that renders user-visible pages adds ``react-helmet`` as a
dependency (if it doesn't already have one) and ``<Helmet>`` blocks to each
route-level page component, plus a ``{page}.page.title`` message per page.

Pages with dynamic titles (e.g., a course outline page that should read
"<Course Name> | <site>") still fit the pattern: the page component renders
``<Helmet>`` after its data is available, with the dynamic value passed
through ``formatMessage``.  Until the data resolves, the previous page's
title persists; that is acceptable for the short data-loading window and is
no worse than the current behavior.

Because every app uses the same ``react-helmet`` instance under the hood and
Helmet's last-mount-wins semantics are well-defined, two pages cannot fight
over the title within a single navigation.


Rejected alternatives
=====================

A ``usePageTitle()`` hook in frontend-base
------------------------------------------

frontend-base could export a hook that wraps ``react-helmet`` (or mutates
``document.title`` directly) so that apps don't import Helmet themselves.
This was rejected because the wrapper adds an API surface for something
Helmet already does well, and it would force a refactor of authn's existing
usage with no behavioral benefit.  If many more apps adopt the pattern and a
wrapper proves valuable, we can revisit.

Setting the title centrally in the shell from route metadata
------------------------------------------------------------

The shell could read a ``title`` field from each ``RoleRouteObject`` and
apply it on navigation.  This was rejected because titles often depend on
data only available inside the page component after fetching (course names,
user names, dashboard counts).  A static metadata field can't express that,
and a function-of-loader-data field re-creates the page component's
responsibilities one layer up.

Standardizing on ``react-helmet-async``
---------------------------------------

``react-helmet-async`` is generally recommended over ``react-helmet`` for
React 18+ projects: it avoids ``act()`` warnings, supports streaming SSR, and
is actively maintained.  We chose ``react-helmet`` for this ADR because it
matches authn's current usage and frontend-base does not currently SSR.
Standardizing on ``react-helmet-async`` across all apps is a worthwhile
follow-up but does not need to block this decision; the pattern in this ADR
applies identically to either library.
