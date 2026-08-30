App API compatibility via a manifest field
##########################################

Status
======

Proposed


Context
=======

Apps declare frontend-base as a peer dependency with a caret range::

    "peerDependencies": {
      "@openedx/frontend-base": "^2.0.0-alpha.4 || 0.0.0-dev"
    }

A site composes many such apps, and npm dedupes frontend-base to a single copy.
Since npm 7, peer dependencies are installed automatically and an unsatisfiable
range is a hard ``ERESOLVE`` failure rather than a warning.  ``npm install`` for
a site therefore breaks the moment any one app's range excludes the
frontend-base version the site wants.  Any app not yet republished against the
new major still declares the old one, so that app alone blocks every site that
includes it.

The coupling is tighter than the compatibility it describes.  A single version
number covers the CLI, the webpack configuration, the shell runtime, and the
API that apps import.  A breaking change to any of them forces a major, and a
major invalidates every app's caret range whether or not that app touches what
broke.  Semver cannot express "major for sites, minor for apps".

Three separable things produce the failure:

#. Semver's meaning.  "2.0 may break you" is advisory.
#. The caret convention.  ``^2`` turns that advisory into a hard ceiling in
   every app manifest.
#. npm's resolver policy.  Since npm 7 it refuses to install rather than warn.

Other ecosystems land elsewhere on this.  WordPress has no resolver at all:
``Requires at least:`` and ``Tested up to:`` are advisory headers, core keeps
deprecated functions alive for years, and a stale plugin fails at runtime
rather than at install.  Django has a real resolver, but its packages
conventionally declare ``Django>=4.2`` with no ceiling and prove the claim with
a test matrix, backed by a deprecation policy that guarantees a window in which
both the old and the new API work.  In both cases the ceiling is absent or
advisory, and compatibility is asserted somewhere the package manager cannot
turn into an install failure.


Decision
========

Move the app-to-frontend-base compatibility assertion out of npm's resolver and
into a manifest field that frontend-base's own tooling validates.

Apps declare the API version they target under an ``openedx`` key in
package.json::

    "openedx": {
      "apiVersion": "^2"
    }

frontend-base declares the API version it provides in the same field in its own
package.json.  That number is versioned independently of the package version:
it bumps only when the app-facing surface changes, so frontend-base 2.x and 3.x
may both provide ``apiVersion`` 2.

The CLI resolves each app in the site's configuration at build time, compares
the app's range against the provided version, and reports:

* satisfied: silent.
* unsatisfied: an error naming the app, its range, and the provided version.
* absent: a warning that compatibility is unknown.

Apps keep their npm peer dependency on frontend-base, because a site must still
supply a single deduped copy, but the range loosens to a lower bound such as
``>=2``.  The peer dependency continues to express "frontend-base is supplied
by the site, not bundled by me, and it must be at least this recent".
``openedx.apiVersion`` expresses "and this is the API I was written against".


What a frontend-base major means
--------------------------------

The two numbers are nested, not partitioned.  ``version`` remains a superset:
a major means a breaking change to anything frontend-base ships, the app-facing
API included.  ``openedx.apiVersion`` covers only the app-facing subset.

* A break in the app-facing runtime API bumps both.
* A break in the CLI, the webpack configuration, the site.config schema, the
  shell's internals, or the build output bumps ``version`` alone.
* ``apiVersion`` never bumps without a package major.

Reading a major as "a break anywhere except the app-facing API" would be wrong.
It would ship an app-facing break as a minor, misleading sites and the
changelog alike.

What changes is not the meaning of a major but its job.  Today it both signals
to sites and gates app installation.  It keeps the first and loses the second.
Sites continue to read ``version`` to know their configuration and build may
need attention; apps read ``apiVersion`` to know their imports may.

A useful side effect is that majors get cheaper.  A major currently locks the
ecosystem out until every app republishes, which creates pressure to batch
breaking changes or avoid them.  Once it no longer gates installation, a
breaking change to the build tooling can ship as a major without a coordinated
migration of every app.


apiVersion is a full semver
---------------------------

``apiVersion`` is a semver version, not an integer.  Its major bumps on a
breaking app-facing change and its minor on an additive one, so an app can
declare ``^2.1`` to mean "I need the API as it stood in 2.1" rather than only
"I need API 2".  Without the minor, additive API is invisible to the check and
an app has no way to state that it needs a recent one.


Consequences
============

Compatibility failures move from install time to build time.  That is later
than npm's check but earlier than the runtime failure WordPress accepts, and it
is a place where frontend-base decides how strict to be.  In particular the
tooling can distinguish an app that is untested against the current API from
one that is known incompatible, which npm cannot.

A site is no longer blocked by an app that has not been republished.  An
unmaintained app declaring ``^1`` produces a build error naming that app,
rather than an ``ERESOLVE`` that names a version range and leaves the operator
to work out which of thirty apps caused it.

frontend-base gains an obligation.  ``openedx.apiVersion`` must bump when the
app-facing surface breaks, and must not bump when only the CLI, the webpack
configuration, or the site-facing surface breaks.  That judgement becomes
explicit, where before it was folded into the package version and made
implicitly.

The mechanism is additive and reversible.  Apps without the field keep working
with a warning, and nothing about the npm dependency graph changes.

Deprecation windows are still required and are not replaced by this.  A field
saying an app targets API 2 is only useful if API 2 exists long enough for apps
to move to it, which means replacing an API in a minor release and removing the
old one no earlier than the following major.


Rejected alternatives
=====================

Multi-major peer ranges alone
-----------------------------

Apps could widen to ``"^1 || ^2"`` and extend the list at each major, as the
React and Vite plugin ecosystems do.  Apps should widen their ranges anyway,
but it is not sufficient on its own: every major still requires every app to
publish before any site can upgrade, which is the coupling this ADR exists to
remove.  Widening pre-emptively to ``|| ^3`` does remove the coupling, but it
asserts compatibility with a release that does not exist yet, and npm offers no
way to downgrade that assertion to a warning when it turns out to be wrong.

A separate app API package
--------------------------

The app-facing API could move to its own published package, in its own
repository with its own version and release cadence, as VS Code does with
``@types/vscode``.

Rejected first because it does not solve the problem on its own.  Apps would
peer-depend on the API package instead of on frontend-base, and a major there
produces the same ``ERESOLVE`` against a different package name.  It helps only
to the degree that the API package majors less often than frontend-base does,
which is a claim about discipline rather than a mechanism.  The manifest field
supplies that leniency directly, and would still be wanted alongside a separate
package.

The cost is also real.  It is a new repository to create and own in the openedx
organization, with its own CI, release automation, dependency updates, and
review burden.  frontend-base implements the API, so it would depend on the
package it implements, making every change to the surface a two-repository
sequence of publish, then bump, then release.  Extraction also forces the seam
to be drawn now, deciding which exports are app-facing API and which are shell
internals, before there is evidence about where that line belongs.  Drawing it
in the wrong place is itself a breaking change to undo.

This remains open.  Nothing here precludes extracting the package later, and
the manifest field carries over unchanged if that happens.

A subpath export
----------------

``@openedx/frontend-base/plugin-api``, alongside the existing ``./tools`` and
``./shell/site`` entries, is cheap and achieves nothing here.  A subpath export
shares its package's single version, and npm has no concept of an
independently versioned subpath.  Apps would still peer-depend on
``@openedx/frontend-base``, and their ranges would still be invalidated by a
major.  Useful for organizing the surface; irrelevant to the resolver.

Install-time escape hatches
---------------------------

npm's ``--legacy-peer-deps``, pnpm's ``peerDependencyRules.allowedVersions``,
and Yarn Berry's ``packageExtensions`` all let a site override an app's peer
range without touching the app.  These are worth documenting, and the pnpm and
Yarn forms are surgical enough to be genuinely useful, but none can be the
primary mechanism.  npm's is the form most sites have, and it is site-wide: it
silences every peer conflict rather than the intended one, so a real
incompatibility becomes invisible.  All three also make a correct install
depend on the operator knowing an incantation.

Dropping the peer dependency
----------------------------

Apps could remove frontend-base from ``peerDependencies`` entirely, which would
end ``ERESOLVE`` immediately.  Rejected because the peer dependency is doing
real work: it declares that frontend-base is supplied by the composing site
rather than bundled by the app, which is what keeps the runtime a singleton.
Removing it also discards the lower bound, leaving nothing to stop an app being
installed against a frontend-base far older than anything it can run on.

Avoiding major versions
-----------------------

frontend-base could stay on one major indefinitely and ship breaking changes as
minors, as Babel has largely done with 7.x.  Rejected because it does not
remove the coupling, it conceals it.  Sites lose the one signal telling them an
upgrade needs attention, and the version number stops meaning anything for
either audience.
