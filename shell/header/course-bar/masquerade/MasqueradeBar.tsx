import { useIntl } from '@openedx/frontend-base';
import { Alert, Container } from '@openedx/paragon';
import { useParams } from 'react-router-dom';

import { MasqueradeContext } from './MasqueradeContext';
import MasqueradeWidget from './masquerade-widget';
import { formatErrorMessage, useMasqueradeState } from './hooks';
import StudioLink from './StudioLink';
import messages from './messages';

export default function MasqueradeBar() {
  const { formatMessage } = useIntl();
  const { courseId = '', unitId = '' } = useParams();
  const masquerade = useMasqueradeState(courseId);
  const {
    errorMessage, isLoading, isDenied, isUnreachable,
  } = masquerade;

  /* Render nothing while we wait for the first response, and when the server
   * tells us this user can't masquerade.  Other failures fall through to a
   * partial bar plus an alert. */
  if (isLoading || isDenied) {
    return null;
  }

  return (
    <MasqueradeContext.Provider value={masquerade}>
      <div role="region" aria-label={formatMessage(messages.ariaLabel)}>
        <div className="bg-primary text-white">
          <Container fluid size="xl">
            <div className="py-3 d-md-flex justify-content-end align-items-start">
              {!isUnreachable && (
                <div className="align-items-center flex-grow-1 d-md-flex mx-1 my-1">
                  <MasqueradeWidget />
                </div>
              )}
              <StudioLink courseId={courseId} unitId={unitId} />
            </div>
          </Container>
        </div>
        {errorMessage && (
          <Container fluid size="xl" className="mt-3">
            <Alert variant="warning" role="alert" dismissible={false} className="mb-0">
              {formatErrorMessage(formatMessage, errorMessage)}
            </Alert>
          </Container>
        )}
      </div>
    </MasqueradeContext.Provider>
  );
}
