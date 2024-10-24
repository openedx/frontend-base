import { Link } from 'react-router-dom';
import { getAppUrl } from '../../runtime/routing';

export default function HomePage() {
  const child1Url = getAppUrl('child1');
  const dashboardUrl = getAppUrl('learner-dashboard');

  return (
    <div className="p-3">
      <p>Home page content.</p>
      <ul>
        {child1Url !== null && (
          <li><Link to={child1Url}>Go to child one page</Link></li>
        )}
        {dashboardUrl !== null && (
          <li><Link to={dashboardUrl}>Go to dashboard page</Link></li>
        )}
      </ul>
    </div>
  );
}
