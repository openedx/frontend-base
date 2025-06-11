==========================
Slot Naming and Life Cycle
==========================

Status
======

Accepted


Context
=======

frontend-base introduces the concept of slots as a way to customize frontend
apps.  Slots are defined in each application's codebase with React, currently
taking the form:

    <Slot id="arbitrary_slot_name" />

Operators can subsequently insert widgets into this slot by referencing
"arbitrary_slot_name" in configuration as follows:

    slots: [
      { 
        slotId: 'arbitrary_slot_name',
        ...
      }
    }

However, the following concerns were identified in relation to completely
arbitrary slot names:

1. The codebase can become progressively littered with slot names that are
   unintuitively or inconsistently named, making it harder to document,
   maintain, and use them

2. There is no expectation that one should be able to infer purpose and
   location from the slot name

3. While frontend-base supports defining multiple slots with the same name in a
   frontend app, as the number of slots across the codebase increases it
   becomes harder and harder for developers to avoid introducing accidental
   name collisions

4. Without a versioning scheme, there's no way to modify a slot's API without
   making an implicit breaking change

This is a common problem in computer science, one that has often been addressed
by use of `reverse domain name notation`_.  It can be seen everywhere, from
Android package names to Open edX's own specification for `server event
types`_.

.. _reverse domain name notation: https://en.wikipedia.org/wiki/Reverse_domain_name_notation
.. _server event types: https://docs.openedx.org/projects/openedx-proposals/en/latest/architectural-decisions/oep-0041-arch-async-server-event-messaging.html#id5

This technique allows for namespace uniqueness within a self-documentated
hierarchy.  For instance, take this fictitious slot name that uses said
notation:

    org.openedx.frontend.slot.header.main.v1

Even without further information, it's possible to tell that:

* The slot belongs to an app in the Open edX org
* It's a frontend app
* It's a slot
* It's in the header module
* The slot probably wraps the header
* This is version 1 of the slot, which indicates changes are possible in the
  future

And last but not least:

* There's little chance that a slot with the same name exists anywhere in the
  codebase other than where the layout header is defined

Based on this concept, this ADR aims to define rules that govern how developers
maintain plugin slots in Open edX frontend apps throughout their lifecycle.  In
particular, when adding, deprecating, or removing plugin slots.


Decisions
=========

1. Naming format
----------------

The full name of a plugin slot will be a ``string`` that follows the following
format:

    {Domain}.{Subdomain}.{Type}.{Module}.{Identifier}.{Version}

Where:

* *Domain* is always ``org.openedx``
* *Subdomain* is always ``frontend``
* *Type* is always ``slot``
* *Module* is a camel-case string that denotes the module where the slot is
  exposed, such as ``header``, ``footer``, ``learning``, ``learnerDashboard``,
  or ``authoring``
* *Identifier* is a camel-case string that identifies the slot, which must be
  unique for the module that contains it
* *Version* is either empty, which denotes the slot is unsupported, the
  string `unstable`, denoting a slot with a yet unstable API, or a
  monotonically increasing integer prefaced by a `v` and starting with `v1`.

For example:

* org.openedx.frontend.slot.devProject.foobar (unsupported slot, as version is empty)
* org.openedx.frontend.slot.footer.main.unstable (unstable slot)
* org.openedx.frontend.slot.learning.navigationSidebar.v2 (this slot is on version 2)

In practice, this is what the slot definition will look like:

    <Slot id="org.openedx.frontend.slot.learning.navigationSidebar.v2" />

And this is how operators would configure it:

    slots: [
      {
        slotId: 'org.openedx.frontend.slot.learning.navigationSidebar.v2',
        ...
      }
    ]

Note that while this ADR does not prescribe a list of modules, whenever a new
slot is introduced special care should be taken with the selection of the
module name.  In particular, slots that occur in multiple modules should have
consistent names.

2. Versioning
-------------

For the purposes of versioning, a given slot's API contract is comprised of:

* Its location, visual or otherwise, in the Module
* The type (but not implementation!) of the content it is expected to wrap
* The specific set of properties, options, and operations it supports

If one of the above changes for a particular slot in such a way that existing
widgets break or present undefined behavior, *and* if it still make sense to
use the same Identifier, the version string appended to its name will be
incremented by `1`.

Note: a given slot's default content is explicitly *not* part of its contract.
Changes to it do not result in a version bump.

3. Deprecation process
----------------------

When a slot changes sufficiently to require its version to be incremented, the
developer will take care to:

* Propose the previous version's deprecation via the official Open edX
  Deprecation Process

* Keep the definition of the previously released version of the slot in the
  codebase for the duration of the deprecation process, which should include at
  least one Open edX release where it co-exists with the new version

* Implement the new version of the slot in such a way that coexists with the
  previous one with no detriment to either's functionality


Consequences
============

The decisions above are intended to let users create and maintain widgets that
are stable across releases of Open edX, while also allowing slots themselves to
evolve.  The naming convention itself has no significant downsides, and while
the deprecation process does add some maintenance burden, it is expected to be
offset by the additional stability provided.


