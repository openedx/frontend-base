import { Link } from 'react-router-dom';
import { getAppUrl, isValidApp } from '../../runtime/routing';

export default function HomePage() {
  return (
    <div className="p-3">
      <p>Home page content.</p>
      <ul>
        {isValidApp('child1') && (
          <li><Link to={getAppUrl('child1')}>Go to child one page</Link></li>
        )}
        <li><Link to="/dashboard">Go to dashboard page</Link></li>
      </ul>
    </div>
  );
}
