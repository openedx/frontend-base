import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useIntl } from '@openedx/frontend-base';
import { Alert } from '@openedx/paragon';

import MasqueradeWidget, { useMasqueradeWidget } from './masquerade-widget';
import StudioLink from './StudioLink';

/**
 * Inner component that has access to QueryClientProvider context.
 * The hook needs useQueryClient which requires a provider above it.
 */
const MasqueradeBarContent: React.FC<{ courseId: string, unitId: string }> = ({
  courseId,
  unitId,
}) => {
  const masquerade = useMasqueradeWidget(courseId);
  const { formatMessage } = useIntl();

  return (
    <div role="toolbar" aria-label="Masquerade toolbar">
      <div className="bg-primary text-white">
        <div className="container-xl py-3 d-md-flex justify-content-end align-items-start">
          <div className="align-items-center flex-grow-1 d-md-flex mx-1 my-1">
            <MasqueradeWidget masquerade={masquerade} />
          </div>
          <StudioLink courseId={courseId} unitId={unitId} />
        </div>
      </div>
      {masquerade.queryErrorMessage && (
        <div className="container-xl mt-3">
          <Alert variant="danger" dismissible={false}>
            {formatMessage(masquerade.queryErrorMessage)}
          </Alert>
        </div>
      )}
    </div>
  );
};

const MasqueradeBar: React.FC = () => {
  const { courseId = '', unitId = '' } = useParams();

  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { retry: false, refetchOnWindowFocus: false },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <MasqueradeBarContent courseId={courseId} unitId={unitId} />
    </QueryClientProvider>
  );
};

export default MasqueradeBar;
