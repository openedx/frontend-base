import { Link } from 'react-router-dom';
import { useIntl } from '../../../runtime';
import { getUrlByRole } from '../../../runtime/routing';
import messages from './messages';

export default function HomePage() {
  const coursewareUrl = getUrlByRole('courseware');
  const dashboardUrl = getUrlByRole('learnerDashboard');
  const intl = useIntl();

  return (
    <div className="p-3">
      <p>{intl.formatMessage(messages.homeContent)}</p>
      <ul>
        {coursewareUrl !== null && (
          <li><Link to={coursewareUrl}>Go to courseware page</Link></li>
        )}
        {dashboardUrl !== null && (
          <li><Link to={dashboardUrl}>Go to dashboard page</Link></li>
        )}
      </ul>
    </div>
  );
}
