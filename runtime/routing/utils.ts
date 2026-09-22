import { ElementType } from 'react';
import { generatePath, RouteObject } from 'react-router';
import { Link } from 'react-router-dom';

import { RoleRouteObject } from '../../types';
import { getSiteConfig } from '../config';

function findRoleInRoutes(routes: RouteObject[], role: string, prefix = ''): string | null {
  for (const route of routes) {
    const segment = route.path ?? '';
    const fullPath = segment.startsWith('/') ? segment : `${prefix}/${segment}`.replace(/\/+/g, '/');

    if (route.handle?.roles?.includes(role)) {
      return fullPath || null;
    }

    if (Array.isArray(route.children)) {
      const found = findRoleInRoutes(route.children, role, fullPath);
      if (found !== null) {
        return found;
      }
    }
  }
  return null;
}

export function getUrlByRouteRole(role: string) {
  const { apps, externalRoutes } = getSiteConfig();

  if (apps) {
    for (const app of apps) {
      if (Array.isArray(app.routes)) {
        const found = findRoleInRoutes(app.routes, role);
        if (found !== null) {
          return found;
        }
      }
    }
  }

  if (externalRoutes) {
    for (const externalRoute of externalRoutes) {
      if (externalRoute.role === role) {
        return externalRoute.url;
      }
    }
  }

  return null;
}

export function isRoleRouteObject(match: RouteObject): match is RoleRouteObject {
  return match.handle !== undefined && 'roles' in match.handle;
}

/**
 * Whether `url` is a path within this site, one react-router can navigate to, rather than an
 * absolute or protocol-relative URL.
 *
 * @param {string} url
 * @returns {boolean}
 */
export function isInternalUrl(url: string): boolean {
  return url.startsWith('/') && !url.startsWith('//');
}

export interface ResolvedRoute {
  /** The path or URL to link to. */
  url: string;
  /** Whether `url` is a path in this site, so a react-router `Link` can navigate to it. */
  isInternal: boolean;
}

/**
 * Resolves the route the site provides for `role`, if any, ready to link to: the path of an
 * installed app's route, or the URL of an external route, as `getUrlByRouteRole` finds it.  An app
 * route's path has its params filled from `params` and a trailing splat dropped, as react-router's
 * `generatePath` does, so a missing required param throws; an external URL is returned as
 * configured.  `isInternal` tells the two apart.
 *
 * ```
 * const gradebook = resolveRouteByRole('org.openedx.frontend.role.gradebook', { courseId });
 * if (gradebook?.isInternal) {
 *   return <Button as={Link} to={gradebook.url}>View gradebook</Button>;
 * }
 * return <Button as="a" href={gradebook?.url ?? legacyGradebookUrl}>View gradebook</Button>;
 * ```
 *
 * @param {string} role
 * @param {Object.<string, string>} [params] Values for the route's params, by name.
 * @returns {ResolvedRoute|null} `null` when no app or external route provides the role.
 */
export function resolveRouteByRole(role: string, params: Record<string, string> = {}): ResolvedRoute | null {
  const path = getUrlByRouteRole(role);
  if (path === null) {
    return null;
  }
  const isInternal = isInternalUrl(path);
  return { url: isInternal ? generatePath(path, params) : path, isInternal };
}

export interface LinkProps {
  as?: ElementType;
  to?: string;
  href?: string;
}

/**
 * Props for linking to `url` from a component that accepts `as`, such as Paragon's `Button`,
 * `Hyperlink`, `NavLink` or `Dropdown.Item`: a react-router `Link` for a path in this site, so the
 * navigation stays in the client, and a plain anchor `href` for anything else.
 *
 * ```
 * <Button {...getLinkProps(url)}>Go</Button>
 * ```
 *
 * @param {string} url
 * @returns {LinkProps}
 */
export function getLinkProps(url: string): LinkProps {
  if (isInternalUrl(url)) {
    return { as: Link, to: url };
  }
  return { href: url };
}
