import { useEffect } from 'react';
import { subscribe, unsubscribe } from '../../subscriptions';

/**
 * A React hook that allows functional components to subscribe to application events.  This should
 * be used sparingly - for the most part, Context should be used higher-up in the application to
 * provide necessary data to a given component, rather than utilizing a non-React-like Pub/Sub
 * mechanism.
 *
 * @memberof module:React
 * @param {string} type
 * @param {function} callback
 */
const useSiteEvent = (type, callback) => {
  useEffect(() => {
    subscribe(type, callback);

    return () => {
      unsubscribe(type, callback);
    };
  }, [callback, type]);
};

export default useSiteEvent;
