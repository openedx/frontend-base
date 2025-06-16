import { createContext } from 'react';
import { SiteConfig, User } from '../../types';
import { getConfig } from '../config';

/**
 * `SiteContext` provides data from `App` in a way that React components can readily consume, even
 * if it's mutable data. `SiteContext` contains the following data structure:
 *
 * ```
 * {
 *   authenticatedUser: <THE App.authenticatedUser OBJECT>,
 *   config: <THE App.config OBJECT>
 *   locale: <THE App.locale OBJECT>
 * }
 * ```
 * If the `App.authenticatedUser` or `App.config` data changes, `SiteContext` will be updated
 * accordingly and pass those changes onto React components using the context.
 *
 * `SiteContext` is used in a React application like any other `[React Context](https://reactjs.org/docs/context.html)
 * @memberof module:React
 */
const SiteContext = createContext<{
  authenticatedUser: User | null,
  config: SiteConfig,
  locale: string,
}>({
  authenticatedUser: null,
  config: getConfig(),
  locale: 'en',
});

export default SiteContext;
