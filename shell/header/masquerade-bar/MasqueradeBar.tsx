import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getSiteConfig, useIntl, FormattedMessage, Slot } from '@openedx/frontend-base';
import { Alert } from '@openedx/paragon';

import MasqueradeWidget from './masquerade-widget';
import messages from './messages';

function getInsightsUrl(courseId?: string): string | undefined {
  const urlBase = (getSiteConfig() as any).INSIGHTS_BASE_URL;
  let urlFull: string | undefined;
  if (urlBase) {
    urlFull = `${urlBase}/courses`;
    if (courseId) {
      urlFull += `/${courseId}`;
    }
  }
  return urlFull;
}

function getStudioUrl(courseId?: string, unitId?: string): string | undefined {
  const urlBase = (getSiteConfig() as any).STUDIO_BASE_URL;
  let urlFull: string | undefined;
  if (urlBase) {
    if (unitId) {
      urlFull = `${urlBase}/container/${unitId}`;
    } else if (courseId) {
      urlFull = `${urlBase}/course/${courseId}`;
    }
  }
  return urlFull;
}

interface MasqueradeBarProps {
  isStudioButtonVisible?: boolean;
}

const MasqueradeBar: React.FC<MasqueradeBarProps> = ({
  isStudioButtonVisible = true,
}) => {
  const { courseId = '', unitId = '' } = useParams();

  const [didMount, setDidMount] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setDidMount(true);
    return () => setDidMount(false);
  });

  const urlInsights = getInsightsUrl(courseId);
  const urlStudio = getStudioUrl(courseId, unitId);
  const [masqueradeErrorMessage, showMasqueradeError] = useState<string | null>(null);
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { retry: false, refetchOnWindowFocus: false },
    },
  }));
  const { formatMessage } = useIntl();

  return (!didMount ? null : (
    <QueryClientProvider client={queryClient}>
      <div data-testid="instructor-toolbar">
        <div className="bg-primary text-white">
          <div className="container-xl py-3 d-md-flex justify-content-end align-items-start">
            <div className="align-items-center flex-grow-1 d-md-flex mx-1 my-1">
              <MasqueradeWidget courseId={courseId} onError={showMasqueradeError} />
            </div>
            {((urlStudio && isStudioButtonVisible) || urlInsights) && (
              <>
                <hr className="border-light" />
                <span className="mr-2 mt-1 col-form-label"><FormattedMessage {...messages.titleViewCourseIn} /></span>
              </>
            )}
            {urlStudio && isStudioButtonVisible && (
              <span className="mx-1 my-1">
                <a className="btn btn-inverse-outline-primary" href={urlStudio}>{formatMessage(messages.titleStudio)}</a>
              </span>
            )}
            {urlInsights && (
              <span className="mx-1 my-1">
                <a className="btn btn-inverse-outline-primary" href={urlInsights}>{formatMessage(messages.titleInsights)}</a>
              </span>
            )}
          </div>
        </div>
        {masqueradeErrorMessage && (
          <div className="container-xl mt-3">
            <Alert variant="danger" dismissible={false}>
              {masqueradeErrorMessage}
            </Alert>
          </div>
        )}
        // TODO: check this Slot
        {/* <Slot id="org.openedx.frontend.slot.header.masqueradeBar.alerts.v1" /> */}
      </div>
    </QueryClientProvider>
  ));
};

export default MasqueradeBar;
