###########################################
Frontend Branching and Publication Strategy
###########################################

Status
======

Accepted

Context
=======

Developers need a rallying point for integration of new, untested features.
Consider design tokens being developed concurrently with frontend-base.  It
would've been desirable to have a public, protected branch that evolved
linearly (no rebases) and included the latest version of both features not only
so their developers could have the time to make them work well with each other,
but where they had enough leeway to push the envelope and fix bugs without
having to immediately ship the code to thousands of users.

This branch is commonly called "master" or "main" for repositories that follow
the "main is unstable" development strategy, but this is not universal: many
projects call this branch "next", "develop", or "alpha".  What is almost
universal, however, is the existence of at least one branch that serves this
purpose.

In the Open edX org, main branches have been, historically, deemed stable:
every single commit that lands has to be deemed production ready.  This is
counter to the "main is unstable" strategy.  Furthermore, there is no "next"
branch in most projects, either.  This needs to be addressed.

Decisions and Consequences
==========================

1. "main is unstable"
---------------------

From this point onwards, frontend repositories' default branches (main or
master) are deemed unstable.  This has two major consequences:

1. Using the main branch in production is not supported.  In fact, we recommend against it!
2. The DEPR process, fast or slow, does not apply to it; breaking changes can
   and will land with no warning.

Notably, though, the main branch retains the following properties:

1. New features should be developed for and merged to it before any other
   branches;
2. To facilitate collaboration, the branch is never rebased.


2. Publication of the "main" branch
-----------------------------------

A repository's main branch will be published semantically to NPM with on an
"alpha" prerelease tag and a monotonically incremented number suffix.  For
instance:

frontend-base@2.0.0-alpha4
frontend-app-authn@2.0.0-alpha2


3. Creation and publication of release branches
-----------------------------------------------

When the main branch of a given frontend repository contains breaking changes
over the current release and is deemed ready for widespread use, a new "n.x"
branch is cut from it, where "n" is the next major version of the package.  The
".x" is literal.  For instance:

1.x
2.x

These branches are also published to NPM semantically, with no breaking changes
allowed after publication:

frontend-base@1.0.5
frontend-app-authn@1.4.3


4. Backports
------------

All changes, including bug fixes and security patches, should target the main
branch first.  Once merged, they can be backported to the appropriate release
branch(es).  This "main first" approach ensures that fixes are never lost when
a new release branch is cut: they are part of main's history and will naturally
flow into future releases.

The only foreseeable scenario where a change may land in a release branch
without a corresponding change landing on main first is when main has diverged
enough that the fix or feature no longer applies to it (e.g., the affected code
has been removed or rewritten).

The following table summarizes the flow:

=========================  ====================  ==========================================
Type of change             Target branch         Backport to
=========================  ====================  ==========================================
Breaking change            main                  (none)
New feature                main                  current release branch, if applicable [1]_
New feature: N/A on main   current release [1]_  (none)
Bug fix                    main                  current and previous release branches [2]_
Bug fix: N/A on main       current release       previous release branches [2]_
=========================  ====================  ==========================================

.. [1] A given feature should only be applied to a release branch if a) it is
   deemed stable, and b) there are specific reasons to do so (such as Product
   demand). In other words, not all non-breaking features will be backported.

.. [2] Bug fixes will only be backported to previous *supported* releases. At
   the time of writing this is only the release immediately preceding the
   current one.

Backport methods
~~~~~~~~~~~~~~~~

**Fast-forward merge.**  If no breaking changes have landed on main since the
release branch was cut (or since the last backport), the simplest method is to
fast-forward the release branch to the current tip of main.  This brings in all
intermediate commits and is the ideal approach early in a release cycle, before
main and the release branch have meaningfully diverged.

**Cherry-pick.**  When main contains breaking changes that must not reach the
release branch, individual merge commits can be cherry-picked instead.  This is
the most common backport method once main has started to diverge.

**Manual backport.**  If a cherry-pick does not apply cleanly — for example,
because surrounding code has changed on main — the change must be adapted
manually to the release branch.

Regardless of the method used, backports are submitted as PRs against the target
release branch.  The PR description should reference the original main PR for
traceability.
