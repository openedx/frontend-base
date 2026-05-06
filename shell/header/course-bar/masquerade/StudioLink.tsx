import { useIntl, FormattedMessage, getSiteConfig } from '@openedx/frontend-base';
import { Button } from '@openedx/paragon';

import messages from './messages';

interface Props {
  courseId?: string,
  unitId?: string,
}

function buildStudioUrl(courseId?: string, unitId?: string): string | null {
  const base = getSiteConfig().cmsBaseUrl;
  if (!base) {
    return null;
  }
  if (unitId) {
    return `${base}/container/${unitId}`;
  }
  if (courseId) {
    return `${base}/course/${courseId}`;
  }
  return null;
}

export function StudioLink({ courseId, unitId }: Props) {
  const { formatMessage } = useIntl();
  const url = buildStudioUrl(courseId, unitId);

  if (!url) {
    return null;
  }

  return (
    <>
      <hr className="border-light" />
      <span className="mr-2 mt-1 col-form-label">
        <FormattedMessage {...messages.titleViewCourseIn} />
      </span>
      <span className="mx-1 my-1">
        <Button variant="inverse-outline-primary" href={url}>
          {formatMessage(messages.titleStudio)}
        </Button>
      </span>
    </>
  );
}

export default StudioLink;
