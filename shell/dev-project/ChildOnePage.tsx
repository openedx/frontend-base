import { Link } from 'react-router-dom';

export default function ChildOnePage() {
  return (
    <div className="p-3">
      <p>Child one content.</p>
      <Link to="/">Go to home page</Link>
    </div>
  );
}
