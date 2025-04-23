import { Spinner } from '@openedx/paragon';
import { useEffect, useState } from 'react';

import classNames from 'classnames';
import { dispatchPluginEvent, useElementSize, usePluginEvent } from './hooks';
import { IFRAME_FEATURE_POLICY, IFRAME_MOUNTED, IFRAME_READY, IFRAME_RESIZE } from './constants';

interface IFrameWidgetProps {
  url: string,
  title: string,
}

export default function IFrameWidget({ url, title }: IFrameWidgetProps) {
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);

  const { ref: iframeRef, element: iframeElement, width, height } = useElementSize();

  useEffect(() => {
    if (mounted) {
      dispatchPluginEvent(iframeElement as HTMLIFrameElement, {
        type: IFRAME_RESIZE,
        payload: {
          width,
          height,
        },
      }, url);
    }
  }, [iframeElement, mounted, width, height, url]);

  usePluginEvent(iframeElement, IFRAME_MOUNTED, () => {
    setMounted(true);
  });

  usePluginEvent(iframeElement, IFRAME_READY, () => {
    setReady(true);
  });

  const fallback = (
    <Spinner animation="border" variant="light" screenReaderText="Loading" />
  );

  return (
    <>
      <iframe
        ref={iframeRef}
        title={title}
        src={url}
        allow={IFRAME_FEATURE_POLICY}
        referrerPolicy="origin" // The sent referrer will be limited to the origin of the referring page: its scheme, host, and port.
        className={classNames(
          'border border-0 w-100',
          { 'd-none': !ready },
        )}
      />
      {!ready && fallback}
    </>
  );
}
