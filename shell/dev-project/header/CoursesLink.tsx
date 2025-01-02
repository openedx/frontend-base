import { Icon } from '@openedx/paragon';
import { BookOpen } from '@openedx/paragon/icons';
import { useWidgetOptions } from '../../../runtime/slots/data/hooks';

export default function CoursesLink() {
  const options = useWidgetOptions();
  const title = options.title ?? 'Courses';

  return (
    <div className="d-flex">
      <Icon src={BookOpen} className="mr-2" />
      <span>{title}</span>
    </div>
  );
}
