# How to: Query Permissions from openedx-authz

## Overview

`@openedx/frontend-base` provides hooks and utilities to validate user permissions against the
`openedx-authz` service. Results are cached automatically via TanStack Query to minimize calls
to the backend.

## Prerequisites

Permission requests are managed with TanStack Query, so a `QueryClientProvider` must be
present above the components calling these hooks. `frontend-base` already provides one in its
shell, so apps running inside it need no setup. Outside `frontend-base` you have to wrap your
app root with a `QueryClientProvider` yourself.

---

## Core Concepts

### Permission query shape

Permissions are expressed as a key/value map where:
- **keys** are arbitrary semantic names you choose (e.g. `canEditGrading`)
- **values** describe the `action` string and optional `scope` (resource identifier)

To find the available permissions you can use, see the
[Core Roles and Permissions](https://docs.openedx.org/projects/openedx-authz/en/latest/concepts/core_roles_and_permissions/index.html)
reference in the openedx-authz documentation.

```typescript
import type { PermissionValidationQuery } from '@openedx/frontend-base';

const query = {
  canViewGrading: {
    action: 'courses.view_grading_settings',
    scope: 'course-v1:org+course+run',
  },
  canEditGrading: {
    action: 'courses.edit_grading_settings',
    scope: 'course-v1:org+course+run',
  },
} satisfies PermissionValidationQuery;
```

### Caching

Results are cached using TanStack Query. The cache key includes the query object and the
resolved `apiBaseUrl`, so different backends and different permission sets are cached
independently. Results are reused across components that request the same permissions within
one session.

---

## `usePermissions`

The single hook for querying permissions. Requires a `featureEnabled` boolean — always
pass the resolved waffle flag value so the caller explicitly opts in or out of authz.
Permission keys are spread at the top level — no nested `.permissions` object.

```typescript
import { usePermissions } from '@openedx/frontend-base';

// featureEnabled is required — always pass the resolved waffle flag boolean:
const { enableAuthz, isLoading: isLoadingFlag } = useWaffleFlags(resourceId);
const { isLoading, isError, isAuthzEnabled, canViewGrading, canEditGrading } = usePermissions(
  {
    canViewGrading: { action: 'courses.view_grading_settings', scope: resourceId },
    canEditGrading: { action: 'courses.edit_grading_settings', scope: resourceId },
  },
  enableAuthz ?? false,
);

if (isLoadingFlag || isLoading) { return <LoadingSpinner />; }
if (isError) { return <ErrorAlert />; }
if (!canViewGrading) { return <PermissionDeniedAlert />; }
```

When `featureEnabled` is `false`: no API call is made and all keys return `true`,
preserving the pre-authz behavior during rollout.

To override the backend URL (e.g. when the authz service runs on a different backend such as
Studio), pass `apiBaseUrl` in the options argument:

```typescript
import { usePermissions, getSiteConfig } from '@openedx/frontend-base';

const { enableAuthz } = useWaffleFlags(courseId);
const { isLoading, isError, canViewGrading } = usePermissions(
  { canViewGrading: { action: 'courses.view_grading_settings', scope: courseId } },
  enableAuthz ?? false,
  { apiBaseUrl: getSiteConfig().lmsBaseUrl },
);
```

> **Service unavailability:** if the authz API call fails, `isError` is `true` and all
> permission keys resolve to `false`. Always check `isLoading` and `isError` before
> rendering gated UI to avoid incorrectly denying access during transient failures.

---

## Recommended: create an MFE-specific wrapper

Avoid calling `usePermissions` directly in every component. Create a single MFE-level
wrapper that encapsulates the waffle flag check and base URL:

```typescript
import { usePermissions, getSiteConfig } from '@openedx/frontend-base';
import { useWaffleFlags } from './waffleHooks'; // your MFE's waffle flag hook
import type { PermissionValidationQuery } from '@openedx/frontend-base';

export const useResourcePermissions = <Query extends PermissionValidationQuery>(
  resourceId: string,
  permissions: Query,
) => {
  const { enableAuthz } = useWaffleFlags(resourceId);
  return usePermissions(
    permissions,
    enableAuthz ?? false,
    { apiBaseUrl: getSiteConfig().lmsBaseUrl },
  );
};

export const getResourcePermissions = (resourceId: string) => ({
  canView: { action: 'resources.view', scope: resourceId },
  canEdit: { action: 'resources.edit', scope: resourceId },
} satisfies PermissionValidationQuery);

// Usage in any component:
const { isLoading, canView, canEdit } =
  useResourcePermissions(resourceId, getResourcePermissions(resourceId));
```

---

## Best Practices

- **Define permission constants** in your MFE (`COURSE_PERMISSIONS`, etc.) rather than
  inline strings — prevents typos and makes global renames easy.
- **Use query builder helpers** (`getGradingPermissions(courseId)`) to build the query
  object — keeps permission definitions co-located with the feature they belong to.
- **Keep `featureEnabled` close to the flag source** — the boolean should come directly
  from your waffle flag check, not be stored in state or passed through many layers.

---

## Manual Cache Invalidation

If user roles change mid-session and you need to force a refetch:

```typescript
import { permissionsQueryKeys, getSiteConfig } from '@openedx/frontend-base';

// Default — URL comes from getSiteConfig().lmsBaseUrl (set via mergeSiteConfig):
queryClient.invalidateQueries({
  queryKey: permissionsQueryKeys.validate(myQuery),
});

// Explicit URL — use when you passed apiBaseUrl in UsePermissionsOptions:
queryClient.invalidateQueries({
  queryKey: permissionsQueryKeys.validate(myQuery, getSiteConfig().lmsBaseUrl),
});
```

---

## `validatePermissions` (outside React)

`validatePermissions` is the raw service call that `usePermissions` wraps. Prefer the hook in
components: it adds the `featureEnabled` gate and the shared cache, and the raw call provides
neither. Reach for `validatePermissions` only where hooks cannot run, e.g. a route loader,
a prefetch, or an imperative check outside the render tree.

```typescript
import { validatePermissions, getSiteConfig } from '@openedx/frontend-base';

const answer = await validatePermissions(getSiteConfig().lmsBaseUrl, {
  canViewGrading: { action: 'courses.view_grading_settings', scope: courseId },
});
// -> { canViewGrading: true }
```

Keys absent from the server response resolve to `false`. Note that this call always hits the
backend — it has no `featureEnabled` parameter, so gating on your waffle flag is your
responsibility.