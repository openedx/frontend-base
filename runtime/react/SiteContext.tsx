import { createContext } from 'react';
import { SiteConfig, User } from '../../types';
import { getSiteConfig } from '../config';

/**
 * `SiteContext` provides data from `App` in a way that React components can readily consume, even
 * if it's mutable data. `SiteContext` contains the following data structure:
 *
 * ```
 * {
 *   authenticatedUser
 *   siteConfig
 *   locale
 * }
 * ```
 * If `authenticatedUser`, `siteConfig`, or `locale` data changes, `SiteContext` will be updated
 * accordingly and pass those changes onto React components using the context.
 *
 * `SiteContext` is used in a React application like any other `[React Context](https://reactjs.org/docs/context.html)
 * @memberof module:React
 */
const SiteContext = createContext<{
  authenticatedUser: User | null,
  siteConfig: SiteConfig,
  locale: string,
}>({
  authenticatedUser: null,
  siteConfig: getSiteConfig(),
  locale: 'en',
});

export default SiteContext;
