import { Icon } from '@openedx/paragon';
import { BookOpen } from '@openedx/paragon/icons';

export default function CoursesLink() {
  return (
    <div className="d-flex">
      <Icon src={BookOpen} className="mr-2" />
      <span>Courses</span>
    </div>
  );
}
