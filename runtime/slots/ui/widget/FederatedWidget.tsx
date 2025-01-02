import { Spinner } from '@openedx/paragon';
import { Suspense } from 'react';
import { useRemoteComponent } from '../../../../shell/federation/hooks';

interface FederatedWidgetProps {
  remoteId: string,
  moduleId: string,
}

export default function FederatedWidget({ remoteId, moduleId }: FederatedWidgetProps) {
  const Component = useRemoteComponent(remoteId, moduleId);
  const fallback = (
    <Spinner animation="border" variant="light" screenReaderText="Loading" />
  );

  return (
    <Suspense fallback={fallback}>
      <Component />
    </Suspense>
  );
}
