import { isClientRoute, isCourseNavigationRoute } from './utils';
import * as runtime from '../../../runtime';

jest.mock('../../../runtime');

const mockGetActiveRoles = runtime.getActiveRoles as jest.MockedFunction<typeof runtime.getActiveRoles>;
const mockGetProvidedData = runtime.getProvidedData as jest.MockedFunction<typeof runtime.getProvidedData>;
const mockGetUrlByRouteRole = runtime.getUrlByRouteRole as jest.MockedFunction<typeof runtime.getUrlByRouteRole>;

describe('isCourseNavigationRoute', () => {
  it('returns true when a provided role is active', () => {
    mockGetProvidedData.mockReturnValue([
      { courseNavigationRoles: ['org.openedx.frontend.role.instructor'] },
    ]);
    mockGetActiveRoles.mockReturnValue(['org.openedx.frontend.role.instructor']);

    expect(isCourseNavigationRoute()).toBe(true);
  });

  it('returns false when no provided roles are active', () => {
    mockGetProvidedData.mockReturnValue([
      { courseNavigationRoles: ['org.openedx.frontend.role.instructor'] },
    ]);
    mockGetActiveRoles.mockReturnValue(['org.openedx.frontend.role.learning']);

    expect(isCourseNavigationRoute()).toBe(false);
  });

  it('returns false when no providers exist', () => {
    mockGetProvidedData.mockReturnValue([]);
    mockGetActiveRoles.mockReturnValue(['org.openedx.frontend.role.instructor']);

    expect(isCourseNavigationRoute()).toBe(false);
  });
});

describe('isClientRoute', () => {
  it('matches a pathname under a static route path', () => {
    mockGetProvidedData.mockReturnValue([
      { courseNavigationRoles: ['org.openedx.frontend.role.learning'] },
    ]);
    mockGetUrlByRouteRole.mockReturnValue('/course');

    expect(isClientRoute('/course/outline')).toBe(true);
  });

  it('matches a pathname under a parameterized route path', () => {
    mockGetProvidedData.mockReturnValue([
      { courseNavigationRoles: ['org.openedx.frontend.role.instructor'] },
    ]);
    mockGetUrlByRouteRole.mockReturnValue('/instructor-dashboard/:courseId');

    expect(isClientRoute('/instructor-dashboard/course-v1:edX+DemoX+Demo')).toBe(true);
  });

  it('does not match a pathname outside the route prefix', () => {
    mockGetProvidedData.mockReturnValue([
      { courseNavigationRoles: ['org.openedx.frontend.role.instructor'] },
    ]);
    mockGetUrlByRouteRole.mockReturnValue('/instructor-dashboard/:courseId');

    expect(isClientRoute('/courses/some-course/instructor')).toBe(false);
  });

  it('returns false for external routes', () => {
    mockGetProvidedData.mockReturnValue([
      { courseNavigationRoles: ['org.openedx.frontend.role.learning'] },
    ]);
    mockGetUrlByRouteRole.mockReturnValue('https://external.example.com/course');

    expect(isClientRoute('/course/outline')).toBe(false);
  });

  it('returns false when role has no matching route', () => {
    mockGetProvidedData.mockReturnValue([
      { courseNavigationRoles: ['org.openedx.frontend.role.learning'] },
    ]);
    mockGetUrlByRouteRole.mockReturnValue(null);

    expect(isClientRoute('/course/outline')).toBe(false);
  });
});
