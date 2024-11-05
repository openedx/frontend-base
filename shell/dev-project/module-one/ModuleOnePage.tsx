import { Link } from 'react-router-dom';

export default function ModuleOnePage() {
  return (
    <div className="p-3">
      <p>Module one content.</p>
      <Link to="/">Go to home page</Link>
    </div>
  );
}
