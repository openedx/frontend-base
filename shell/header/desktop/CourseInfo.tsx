import { Truncate } from '@openedx/paragon';

export default function CourseInfo() {
  const course = {
    title: 'My Course Has A Pretty Long Title',
    number: '101',
    org: 'DavidX',
  };

  return (
    <div className="d-flex flex-column flex-shrink-1 mx-3">
      <Truncate className="font-weight-bold small">{course.title}</Truncate>
      <Truncate className="x-small">{`${course.org} ${course.number}`}</Truncate>
    </div>
  );
}
