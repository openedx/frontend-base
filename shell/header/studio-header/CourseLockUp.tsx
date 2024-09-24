import {
  OverlayTrigger,
  Tooltip,
} from '@openedx/paragon';
import { useIntl } from '../../../runtime';
import messages from './messages';

interface CourseLockUpProps {
  number: string,
  org: string,
  title: string,
  outlineLink?: string,
}

export default function CourseLockUp({
  outlineLink,
  org,
  number,
  title,
}: CourseLockUpProps) {
  const intl = useIntl();
  return (
    <OverlayTrigger
      placement="bottom"
      overlay={(
        <Tooltip id="course-lock-up">
          {title}
        </Tooltip>
    )}
    >
      {outlineLink ? (
        <a
          className="course-title-lockup mr-2"
          href={outlineLink}
          aria-label={intl.formatMessage(messages['header.label.courseOutline'])}
          data-testid="course-lock-up-block"
        >
          <span className="d-block small m-0 text-gray-800" data-testid="course-org-number">{org} {number}</span>
          <span className="d-block m-0 font-weight-bold text-gray-800" data-testid="course-title">{title}</span>
        </a>
      ) : (
        <span className="course-title-lockup mr-2">
          <span className="d-block small m-0 text-gray-800" data-testid="course-org-number">{org} {number}</span>
          <span className="d-block m-0 font-weight-bold text-gray-800" data-testid="course-title">{title}</span>
        </span>
      )}

    </OverlayTrigger>
  );
}
