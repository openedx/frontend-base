# Route roles and external routes

## Route roles

A route role is a string identifier attached to a route via its `handle.roles` array. It names the purpose the route fulfills (e.g. "the profile page", "the account settings page") independent of its URL path.

Use reverse-domain notation: `org.openedx.frontend.role.profile`.

```tsx
const app: App = {
  appId: 'org.openedx.frontend.app.example',
  routes: [{
    path: '/example',
    Component: ExamplePage,
    handle: {
      roles: ['org.openedx.frontend.role.example'],
    },
  }],
};
```

Resolve a role to a URL with `getUrlByRouteRole(role)`. It walks every registered app's routes, recurses into `children`, and returns the full path of the first route whose `handle.roles` includes the requested role. Returns `null` if no match.

A single route may declare multiple roles. A single role may appear on multiple routes; the first match wins.

## External routes

An `externalRoute` maps a role to an absolute URL that is not served by any registered app, typically a separate MFE or backend page.

```tsx
const siteConfig: SiteConfig = {
  externalRoutes: [
    {
      role: 'org.openedx.frontend.role.profile',
      url: 'http://apps.local.openedx.io:1995/profile/',
    },
  ],
  // ...
};
```

Declared at the top level of `SiteConfig`, not inside an app. Each entry is `{ role, url }`.

## How they interact

`getUrlByRouteRole(role)` checks `apps[].routes` first, then falls back to `siteConfig.externalRoutes`. This means a role can resolve to either an in-site route path (when an app provides it) or an absolute external URL (when an MFE outside the current site provides it), and call sites do not need to know which.

This lets a deployment swap a feature between in-site and external by changing config alone: drop the app from `apps`, add an `externalRoutes` entry for the same role, and every `getUrlByRouteRole` caller updates automatically.

If the same role is declared by both an app route and an `externalRoutes` entry, the app route wins.
