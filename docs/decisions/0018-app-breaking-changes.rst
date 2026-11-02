What Counts as a Breaking Change for an App
###########################################

Status
======

Proposed


Context
=======

A maintainer of an app needs to know which changes to it are breaking.

This ADR lists what an app promises.


Decision
========

1. What breaking means
----------------------

A change is breaking when it stops an existing site config, widget or
importing package from working as it did.

A breaking change lands as a ``feat!:`` commit or with a ``BREAKING CHANGE:``
footer, on every branch.  The footer names what changed and what a consumer
has to do.

2. Slots
--------

A slot's contract is as `ADR 0009`_ section 2 defines it, plus the roles its
layout recognizes (``widgetList.byRole``, `ADR 0011`_).

Breaking:

* Removing a slot, or one version of it.
* Removing or renaming a role the layout recognizes.

Not breaking:

* Adding a new version of a slot beside a working previous version.
* Adding a role.
* Changing the React contexts, markup, styles or layout around a slot.

3. Widgets
----------

Every widget id an app registers, in any slot, and every option a widget
reads through ``useWidgetOptions``, is part of the app's contract.

Breaking:

* Removing a widget id, including one kept in ``idAliases``.
* Renaming a widget id without keeping the old id in ``idAliases``.
* Removing an option, or changing its type incompatibly.

Not breaking:

* Reordering default widgets.
* Adding an option.

4. App configuration
--------------------

A config key an operator could have set is part of the app's contract for as
long as what it configures exists.

======================================  ==============================================================  ========
Change                                  Example                                                         Breaking
======================================  ==============================================================  ========
Key renamed, meaning kept               ``COURSE_ABOUT_TWITTER_ACCOUNT`` to ``COURSE_ABOUT_X_ACCOUNT``  Yes
Value's shape changes                   ``NON_BROWSABLE_COURSES`` from comma-separated string to array  Yes
Opt-in flag removed, feature always on  ``ENABLE_COURSE_DISCOVERY`` removed, discovery unconditional    Yes
Feature removed, and its key with it    unenroll survey removed with ``SHOW_UNENROLL_SURVEY``           No
Default value changes                   ``defaultConfig.HOMEPAGE_COURSE_MAX``                           No
Key moves to ``commonAppConfig``        per-app value still wins                                        No
======================================  ==============================================================  ========

5. Route roles and provides
---------------------------

Route roles (``handle.roles``), and the keys under ``provides`` with the
shape of each value (`ADR 0013`_ guideline 3), are part of the app's
contract.

Breaking:

* Removing or renaming a route role.
* Removing or renaming a ``provides`` key, or changing its value's shape
  incompatibly.

Not breaking:

* Adding a route role, or adding one to more routes.
* Adding a ``provides`` key.

6. Exports
----------

Everything importable from the app's package is part of its contract.

Breaking:

* Removing an export.
* Changing one so that existing code no longer compiles or behaves the same.
* Renaming one without keeping the old name as a deprecated alias.

Not breaking:

* Adding an export, or an optional field.

7. Peer dependency ranges
-------------------------

The ranges in ``peerDependencies``, including the one on
``@openedx/frontend-base``, are part of the app's contract.

Breaking:

* Narrowing a range so that a major it accepts today falls out
  (``react: ^18`` to ``^19``).

Not breaking:

* Widening a range (``^18 || ^19``).
* Raising the floor within a major (``^23.4.5`` to ``^23.20.0``).

8. DEPRs
--------

A DEPR is filed when the breaking changes on main land on ``stable``, as a
new major (`OEP-10 ADR 0002`_).

The DEPR lists every breaking change since the previous major, taken from the
release notes: for each, what changed and what a consumer has to do.


Consequences
============

* Every frontend app follows these rules.

* frontend-base's shell follows these rules.

* A maintainer classifies a change by reading its diff against the list
  above.

* A site config that places a widget relative to a default accepts that the
  default may move.


References
==========

* `OEP-10 ADR 0002`_: Frontend Stable Branches
* :doc:`ADR 0009: Slot Naming and Life Cycle <0009-slot-naming-and-lifecycle>`
* :doc:`ADR 0011: Slot layouts instead of a wrapping operation <0011-no-slot-wrapping-operation>`
* :doc:`ADR 0013: App provides for inter-app configuration <0013-app-provides-for-inter-app-configuration>`

.. _OEP-10 ADR 0002: https://docs.openedx.org/projects/openedx-proposals/en/latest/processes/oep-0010/decisions/0002-frontend-stable-branches.html
.. _ADR 0009: 0009-slot-naming-and-lifecycle.rst
.. _ADR 0011: 0011-no-slot-wrapping-operation.rst
.. _ADR 0013: 0013-app-provides-for-inter-app-configuration.rst
