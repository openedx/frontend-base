Bundled App Config Defaults
###########################

Status
======

Accepted


Context
=======

``getAppConfig`` merges site-wide and per-app configuration with
``merge({}, commonAppConfig, appConfigs[id])``, so per-app config wins on
overlapping keys.  That ordering is correct for the pair it was designed
around: edx-platform maps ``/api/mfe_config/v1`` onto ``commonAppConfig`` and
``/api/mfe_config/v1?mfe=<name>`` onto per-app ``config``, and an operator's
app-specific override must beat their site-wide values.

The problem is that ``App.config`` does two unrelated jobs.  It holds values
bundled by the app author at build time, and values supplied by an operator
through ``site.config`` or the runtime config API.  ``mergeApp`` flattens both
into one object before ``addAppConfigs`` runs, so the provenance is lost.

Every key an app bundles is therefore a key ``commonAppConfig`` can never
supply.

The ideal merge priority would be:

* Lowest: Bundled app config (App author provided)
* Next: Common app config (Operator provided)
* Highest: App specific override config (Operator provided)

This ADR proposes that mechanism.


Decision
========

Add an optional ``defaultConfig`` to the ``App`` interface, for values bundled
by the app author.  ``config`` remains the operator's field::

    export interface App {
      // ...
      defaultConfig?: AppConfig;
      config?: AppConfig;
      // ...
    }

``defaultConfig`` resolves below ``commonAppConfig``, which resolves below
``config``, giving the priority described above.

The field is optional and additive: for an app that does not set it, resolution
produces exactly today's result.


Consequences
============

App authors move shipped defaults to ``defaultConfig``, and ``commonAppConfig``
starts working for every key rather than only those no app happened to bundle.

Override ergonomics improve as well.  Today an operator overriding one value
must remember to spread the app's existing config back in, and forgetting the
inner spread silently discards every other default::

    { ...exampleApp, config: { ...exampleApp.config, SOME_KEY: true } }

With a separate field, the outer spread carries ``defaultConfig`` through::

    { ...exampleApp, config: { SOME_KEY: true } }


Rejected alternatives
=====================

Flipping ``commonAppConfig`` precedence
---------------------------------------

Rejected because ``MFE_CONFIG_OVERRIDES`` reaches apps through per-app
``config``, so the flip breaks a channel operators depend on.

An app-level convention
------------------------

Each app could merge its own defaults underneath the runtime's result, for
instance ``merge({}, DEFAULTS, getAppConfig(appId))``.  This yields correct
values with no frontend-base change, but every app reimplements the layering
and must apply it at each read site and the runtime gains no visibility into the
defaults.

A reserved key inside ``config``
---------------------------------

Bundled values under a magic key such as ``config.__defaults``.  Not
expressible in the type system, still routes both kinds of value through a
single field, and invites collisions with real keys.

Dropping bundled defaults entirely
-----------------------------------

Apps could stop shipping defaults and fall back at their read sites.  This is
often the right answer for a given app, but not as a general policy: some
defaults are product decisions an app owns and an operator should be able to
override, such as a default logo.  Removing the field would leave nowhere to
express them.
