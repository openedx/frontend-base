Per-App External Scripts
#########################

Status
======

Proposed


Context
=======

frontend-base previously loaded external scripts during the ``initialize()``
call, with a hardcoded default.  The list of external scripts was not
configurable by operators, meaning there was no way to add, remove, or replace
scripts without modifying the platform itself.  The hardcoded default also
meant every site paid the cost of bundling it whether it was used or not.


Decision
========

Add an optional ``externalScripts`` field to the ``App`` interface::

    export interface App {
      appId: string,
      routes?: RoleRouteObject[],
      providers?: AppProvider[],
      slots?: SlotOperation[],
      externalScripts?: ExternalScriptLoaderClass[],
      config?: AppConfig,
      provides?: Record<string, unknown>,
    }

Each entry is a class that implements ``ExternalScriptLoader``::

    export interface ExternalScriptLoader {
      loadScript(): void,
    }

    export type ExternalScriptLoaderClass =
      new (data: { config: AppConfig }) => ExternalScriptLoader;

During initialization, the runtime iterates all apps and instantiates each
app's external scripts with that app's merged config (``commonAppConfig`` +
per-app ``config``).  Scripts from different apps accumulate without clobbering
each other, following the same pattern as ``routes`` and ``slots``.

frontend-base itself ships no external script loaders.  Operators write their
own (or pull them from a third-party package) and attach them to an app in
their ``site.config``.


Consequences
============

Operators who want to load an external script author an ``ExternalScriptLoader``
class and attach it to one of their apps via ``externalScripts``.  The
configuration the loader reads (e.g. an analytics ID) lives in that app's
``config`` or in ``commonAppConfig``, not as a top-level ``SiteConfig`` key.

Because loaders are per-app, multiple apps can each contribute their own
scripts without conflict, and an app that doesn't need any scripts doesn't
pay the cost of loaders it doesn't use.


Example
=======

An operator-authored loader (for instance, a third-party consent banner) and
its wiring in ``site.config``::

    class ConsentBannerLoader {
      constructor({ config }) {
        this.siteId = config.consentBannerSiteId;
      }

      loadScript() {
        if (!this.siteId) return;
        const script = document.createElement('script');
        script.id = 'consent-banner';
        script.src = `https://example.com/client_data/${this.siteId}/script.js`;
        document.head.appendChild(script);
      }
    }

    export default {
      apps: [
        {
          appId: 'org.example.app.consentBanner',
          externalScripts: [ConsentBannerLoader],
          config: {
            consentBannerSiteId: 'YOUR_SITE_ID',
          },
        },
        // ...other apps
      ],
    };

The ``consentBannerSiteId`` value shown above is a static default.  Operators
can override it at runtime without modifying ``site.config``.


Rejected alternatives
=====================

Site-level ``externalScripts``
------------------------------

An earlier iteration added ``externalScripts`` to ``OptionalSiteConfig``,
letting operators override scripts at the site level.  This was rejected
because a site-level array replaces rather than composes: there is no way for
multiple apps to each contribute their own scripts independently.

A ``contrib/`` directory for pre-built loaders
-----------------------------------------------

An earlier iteration moved ``GoogleAnalyticsLoader`` to a new top-level
``contrib/`` directory for optional, pre-built apps.  This was rejected
because a single loader does not justify a new directory, its build wiring,
and a category of code; operators can author their own loaders with no loss
of functionality.
