import React from 'react';
import { useIntl, FormattedMessage, getSiteConfig } from '@openedx/frontend-base';

import messages from './messages';

function getStudioUrl(courseId: string, unitId: string): string | undefined {
  const urlBase = getSiteConfig().studioBaseUrl;
  if (!urlBase) {
    return undefined;
  }
  if (unitId) {
    return `${urlBase}/container/${unitId}`;
  }
  if (courseId) {
    return `${urlBase}/course/${courseId}`;
  }
  return undefined;
}

interface StudioLinkProps {
  courseId: string,
  unitId: string,
}

const StudioLink: React.FC<StudioLinkProps> = ({ courseId, unitId }) => {
  const { formatMessage } = useIntl();
  const url = getStudioUrl(courseId, unitId);

  if (!url) {
    return null;
  }

  return (
    <>
      <hr className="border-light" />
      <span className="mr-2 mt-1 col-form-label"><FormattedMessage {...messages.titleViewCourseIn} /></span>
      <span className="mx-1 my-1">
        <a className="btn btn-inverse-outline-primary" href={url}>{formatMessage(messages.titleStudio)}</a>
      </span>
    </>
  );
};

export default StudioLink;
