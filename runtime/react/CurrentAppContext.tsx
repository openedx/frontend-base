import { createContext } from 'react';
import { AppConfig } from '../../types';

/**
 * `CurrentAppContext` provides data from `App` in a way that React components can readily consume.
 * if it's mutable data. `CurrentAppContext` contains the following data structure:
 *
 * ```
 * {
 *   config: <THE App.config OBJECT>
 * }
 * ```
 * If the `App.config` data changes, `CurrentAppContext` will be updated
 * accordingly and pass those changes onto React components using the context.
 *
 * `CurrentAppContext` is used in a React application like any other `[React Context](https://reactjs.org/docs/context.html)
 * @memberof module:React
 */
const CurrentAppContext = createContext<{
  appConfig: AppConfig,
}>({
  appConfig: {},
});

export default CurrentAppContext;
