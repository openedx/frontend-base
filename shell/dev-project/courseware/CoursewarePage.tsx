import { Link } from 'react-router-dom';
import { useCourseInfoProvider } from '../../../runtime/react/learning/hooks';

export default function CoursewarePage() {
  useCourseInfoProvider({
    title: 'My Course',
    number: '101',
    org: 'Open edX',
  });

  return (
    <div className="p-3">
      <p>Courseware content.</p>
      <Link to="/">Go to home page</Link>
    </div>
  );
}
