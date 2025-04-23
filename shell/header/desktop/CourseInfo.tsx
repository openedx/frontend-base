import { Truncate } from '@openedx/paragon';
import { useCourseInfo } from '../../../runtime/react/learning/hooks';

export default function CourseInfo() {
  const courseInfo = useCourseInfo();

  if (courseInfo === null) {
    return null;
  }

  return (
    <div className="d-flex flex-column flex-shrink-1 mx-3">
      <Truncate className="font-weight-bold small">{courseInfo.title}</Truncate>
      <Truncate className="x-small">{`${courseInfo.org} ${courseInfo.number}`}</Truncate>
    </div>
  );
}
