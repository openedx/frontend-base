import { createContext } from 'react';
import { AppConfig } from '../../types';

/**
 * `AppContext` provides data from `App` in a way that React components can readily consume, even
 * if it's mutable data. `AppContext` contains the following data structure:
 *
 * ```
 * {
 *   config: <THE App.config OBJECT>
 * }
 * ```
 * If the `App.config` data changes, `AppContext` will be updated
 * accordingly and pass those changes onto React components using the context.
 *
 * `AppContext` is used in a React application like any other `[React Context](https://reactjs.org/docs/context.html)
 * @memberof module:React
 */
const AppContext = createContext<{
  appConfig: AppConfig,
}>({
  appConfig: {},
});

export default AppContext;
