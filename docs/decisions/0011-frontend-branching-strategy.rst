###########################################
Frontend Branching and Publication Strategy
###########################################

Status
======

Proposed

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

1. New features should be developed for and merge to it before any other
   branches;
2. To facilitate collaboration, the branch is never rebased.


2. Publication of the "main" branch
-----------------------------------

A repository's main branch will be published semantically to NPM with on an
"alpha" prerelease tag, with a monotonically incremented version number.  For
instance:

frontend-base@2.0.0-alpha4
frontend-app-authn@2.0.0-alpha2


3. Creation and publication of release branches
-----------------------------------------------

When the main branch of a given frontend repository is deemed ready for
widespread use, a new "n.x" branch is cut from it, where "n" is the next major
version of the package.  The ".x" is literal.  For instance:

1.x
2.x

These branches are also published to NPM semantically, with no breaking changes
being introduced:

frontend-base@1.0.5
frontend-app-authn@1.4.3
