import {
  FunctionComponent,
  ReactNode,
  useEffect, useMemo, useState,
} from 'react';

import { useIntl } from '../../../../i18n';
import { ErrorBoundary } from '../../../../react';
import { IFRAME_RESIZE } from './constants';
import {
  dispatchMountedEvent,
  dispatchReadyEvent,
  dispatchUnmountedEvent,
  useHostEvent
} from './hooks';
import messages from './IFrameContentWrapper.messages';

const ErrorFallbackDefault = () => {
  const { formatMessage } = useIntl();
  return (
    <div>
      <h2>
        {formatMessage(messages.unexpectedError)}
      </h2>
    </div>
  );
};

interface IFrameContentWrapperProps {
  children: ReactNode,
  className?: string,
  style?: Record<string, string>,
  ready?: boolean,
  errorFallbackComponent?: FunctionComponent,
}

export default function IFrameContentWrapper({
  children, className, style = {}, ready = true, errorFallbackComponent,
}: IFrameContentWrapperProps) {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  const finalStyle = useMemo(() => ({
    ...dimensions,
    ...style,
  }), [dimensions, style]);

  // Need to confirm: When an error is caught here, the logging will be sent to the child MFE's logging service

  const ErrorFallback = errorFallbackComponent ?? ErrorFallbackDefault;

  useHostEvent(IFRAME_RESIZE, ({ payload }) => {
    setDimensions({
      width: payload.width,
      height: payload.height,
    });
  });

  useEffect(() => {
    dispatchMountedEvent();

    return () => {
      dispatchUnmountedEvent();
    };
  }, []);

  useEffect(() => {
    // Ready defaults to true, but can be used to defer rendering the Plugin until certain processes
    // have occurred or conditions have been met
    if (ready) {
      dispatchReadyEvent();
    }
  }, [ready]);

  return (
    <div className={className} style={finalStyle}>
      <ErrorBoundary fallbackComponent={<ErrorFallback />}>
        {children}
      </ErrorBoundary>
    </div>
  );
};
