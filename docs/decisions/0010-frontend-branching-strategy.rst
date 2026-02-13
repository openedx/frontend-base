Frontend Branching and Publication Strategy
===========================================

Status
------

Proposed

Context
-------

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

In the Open edX org, though, all master or main branches are effectively
stable, in that every single commit that lands has to be deemed production
ready.  This means that until such time as master/main branches are deemend
unstable, frontend repositories require a new branch.

Decisions
---------

1. Creation of a "next" branch
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

A "next" branch is created on all published frontend repositories.  It has all
properties of current master/main, except two:

1. Its use in production is not supported.  In fact, we recommend against it!
2. The DEPR process, fast or slow, does not apply to it; breaking changes can
   and will land with no warning

Notably, it retains the following properties:

1. New features should be developed for and merge to it before any other
   branches (including master or main!)
2. To facilitate collaboration, the branch is never rebased 


2. Publication of the "next" branch
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

A repository's "next" branch will be published to NPM with on an "alpha" track
with a monotonically incremented version number.  For instance:

frontend-base@1.0.0-alpha4
frontend-app-authn@1.0.0-alpha2


3. Creation and publication of release branches
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

When the "next" branch of a given frontend repository is deemed ready for
widespread use, a new "n.x" branch is cut from it, where "n" is the next major
version of the package.  The ".x" is literal.  For instance:

1.x
5.x

These branches are published to NPM semantically, with no breaking changes
being introduced:

frontend-base@1.0.5
frontend-app-authn@1.4.3

Consequences
------------

Starting immediately after creation of the "next" branch, all development
happens in it first.  Features are backported to "master" (or "main", if it
exists) as if the latter were a release branch: conservatively, and via the
DEPR process.  Some features, such as frontend-base support, may not be
backported at all.  Fixes happen in both as necessary.

Development environments and master sandboxes will be modified to run off of
"next", giving us early warning for build and integration breakages.
