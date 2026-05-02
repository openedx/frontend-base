###################################
Shell layout replacement seams
###################################

Status
======

Proposed


Context
=======

The shell's header and footer both compose multiple slots into a single
visible region.  Operators occasionally need to swap one of these regions out
wholesale (for example, replacing the default footer with a fully custom
brand footer), without touching the dozens of inner slots that make up the
default composition.

The header was already structured to support this.  ``Header.tsx`` is a thin
shell containing only top-level slots, and the desktop and mobile layouts are
registered as default widgets on those slots in ``shell/header/app.tsx``::

    {
      slotId: 'org.openedx.frontend.slot.header.desktop.v1',
      id: 'org.openedx.frontend.widget.header.desktopLayout.v1',
      op: WidgetOperationTypes.APPEND,
      component: DesktopLayout,
    }

Replacing the entire desktop header is a single ``WidgetOperationTypes.REPLACE``
against ``desktopLayout.v1`` (or a ``LayoutOperationTypes.REPLACE`` against
the slot itself, depending on the operator's intent).

The footer did not follow this pattern.  ``Footer.tsx`` composed a
``<footer>`` element, a four-column flex container, and a ``<PoweredBy>``
component inline, with the inner slots (``desktopTop.v1``,
``desktopLeftLinks.v1``, etc.) embedded directly in that JSX.  None of the
structural HTML lived inside a ``<Slot>``, so no slot operation could
replace it.  The closest target, ``desktopTop.v1``, hardcoded a
``RevealLinks`` layout that wrapped its widgets in a Collapsible, hiding any
full-footer-replacement widget behind a "more" toggle.  The other inner
slots were too narrow to host a wholesale replacement and carried their own
hardcoded layouts.


Decision
========

Top-level shell regions ("header", "footer") are exposed as bare ``<Slot>``
elements with no surrounding markup.  The default visual composition of each
region lives in a layout widget registered as the slot's default widget,
following the header's existing pattern.

The footer is restructured to match.  ``Footer.tsx`` becomes a single
``<Slot id="org.openedx.frontend.slot.footer.desktop.v1" />``.  The previous
JSX (the ``<footer>`` element, the column composition, ``<PoweredBy>``)
moves verbatim into a new ``DesktopFooterLayout`` component, registered as
the default widget for that slot in ``shell/footer/app.tsx``.

All existing inner slot ids and default widget ids are preserved.  Plugins
that target ``desktopCenterLinks.v1``, ``desktopLeftLinks.v1``,
``desktopLegalNotices.v1``, ``desktopRightLinks.v1``, the four
``desktopCenterLink{1..4}.v1`` sub-slots, or ``desktopTop.v1`` continue to
work without modification.

After this change, replacing the whole footer is symmetric with replacing
the whole header: a single ``WidgetOperationTypes.REPLACE`` targeting
``org.openedx.frontend.widget.footer.desktopLayout.v1``, or a
``LayoutOperationTypes.REPLACE`` targeting
``org.openedx.frontend.slot.footer.desktop.v1``.

This formalizes a pattern that future top-level shell regions should follow.
A shell region that callers might want to replace wholesale belongs in its
own top-level slot, with the default composition in a layout widget; the
component that frontend-base re-exports from its public surface should be
the bare ``<Slot>`` shell.


Consequences
============

Default-deployment behavior is unchanged.  The DOM tree for a default
footer is identical aside from one extra ``<Slot>`` rendering pass that
resolves to the layout widget.

The public surface gains one new slot id
(``org.openedx.frontend.slot.footer.desktop.v1``) and one new widget id
(``org.openedx.frontend.widget.footer.desktopLayout.v1``), both following
the reverse-DNS-versioned convention from ADR 0009.  Adding them is purely
additive.

The ``.desktop`` qualifier on the new slot id reserves space for a sibling
``.mobile.v1`` layout if a future change splits the footer the way the
header is split.  The current single responsive layout is preserved as-is.

A small follow-up that is intentionally out of scope: wrapping
``<PoweredBy>`` in its own slot so operators can remove just that piece
without replacing the entire layout.  This is straightforward to add later
without breaking the contract established here.


References
==========

- :doc:`ADR 0009: Slot Naming and Life Cycle <0009-slot-naming-and-lifecycle>`
- :doc:`ADR 0011: Slot layouts instead of a wrapping operation <0011-no-slot-wrapping-operation>`
