import { Link } from 'react-router-dom';

export default function DashboardPage() {
  return (
    <div className="p-3">
      <p>Dashboard content.</p>
      <Link to="/">Go to home page</Link>
    </div>
  );
}
