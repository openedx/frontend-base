/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { sendPageEvent } from '../analytics';

/**
 * A Wrapper component that calls `sendPageEvent` when it becomes active.
 *
 * @see {@link module:frontend-base~sendPageEvent}
 * @memberof module:React
 * @param {Object} props
 */
export default function PageWrap({ children }) {
  const location = useLocation();

  useEffect(() => {
    sendPageEvent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return children;
}
