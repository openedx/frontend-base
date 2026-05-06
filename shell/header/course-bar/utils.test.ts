import { isClientRoute, isCourseBarMasqueradeRoute, isCourseBarRoute } from './utils';
import * as runtime from '../../../runtime';
import { providesCourseBarMasqueradeRolesId, providesCourseBarRolesId } from '../constants';

jest.mock('../../../runtime');

const mockGetActiveRoles = runtime.getActiveRoles as jest.MockedFunction<typeof runtime.getActiveRoles>;
const mockGetProvidesAsStrings = runtime.getProvidesAsStrings as jest.MockedFunction<typeof runtime.getProvidesAsStrings>;
const mockGetUrlByRouteRole = runtime.getUrlByRouteRole as jest.MockedFunction<typeof runtime.getUrlByRouteRole>;

beforeEach(() => {
  jest.resetAllMocks();
});

/* Stub `getProvidesAsStrings` to return per-key role lists. */
function provideRoles(byKey: { courseBar?: string[], masquerade?: string[] }) {
  mockGetProvidesAsStrings.mockImplementation(id => {
    if (id === providesCourseBarRolesId) {
      return byKey.courseBar ?? [];
    }
    if (id === providesCourseBarMasqueradeRolesId) {
      return byKey.masquerade ?? [];
    }
    return [];
  });
}

describe('isCourseBarRoute', () => {
  it('returns true when a provided role is active', () => {
    provideRoles({ courseBar: ['org.openedx.frontend.role.instructorDashboard'] });
    mockGetActiveRoles.mockReturnValue(['org.openedx.frontend.role.instructorDashboard']);

    expect(isCourseBarRoute()).toBe(true);
  });

  it('returns false when no provided role is active', () => {
    provideRoles({ courseBar: ['org.openedx.frontend.role.instructorDashboard'] });
    mockGetActiveRoles.mockReturnValue(['org.openedx.frontend.role.learning']);

    expect(isCourseBarRoute()).toBe(false);
  });

  it('returns false when no providers exist', () => {
    provideRoles({});
    mockGetActiveRoles.mockReturnValue(['org.openedx.frontend.role.instructorDashboard']);

    expect(isCourseBarRoute()).toBe(false);
  });
});

describe('isCourseBarMasqueradeRoute', () => {
  it('returns true when a role appears in both opt-ins and is active', () => {
    provideRoles({
      courseBar: ['org.openedx.frontend.role.instructorDashboard'],
      masquerade: ['org.openedx.frontend.role.instructorDashboard'],
    });
    mockGetActiveRoles.mockReturnValue(['org.openedx.frontend.role.instructorDashboard']);

    expect(isCourseBarMasqueradeRoute()).toBe(true);
  });

  it('returns false when the active role only opted into the course bar', () => {
    provideRoles({
      courseBar: ['org.openedx.frontend.role.instructorDashboard'],
    });
    mockGetActiveRoles.mockReturnValue(['org.openedx.frontend.role.instructorDashboard']);

    expect(isCourseBarMasqueradeRoute()).toBe(false);
  });

  it('returns false when the active role only opted into masquerade', () => {
    /* Masquerade is a refinement of the course bar; a role that didn't opt
     * into the course bar can't enable masquerade on its own. */
    provideRoles({
      masquerade: ['org.openedx.frontend.role.instructorDashboard'],
    });
    mockGetActiveRoles.mockReturnValue(['org.openedx.frontend.role.instructorDashboard']);

    expect(isCourseBarMasqueradeRoute()).toBe(false);
  });

  it('returns false when no provided role is active', () => {
    provideRoles({
      courseBar: ['org.openedx.frontend.role.instructorDashboard'],
      masquerade: ['org.openedx.frontend.role.instructorDashboard'],
    });
    mockGetActiveRoles.mockReturnValue(['org.openedx.frontend.role.learning']);

    expect(isCourseBarMasqueradeRoute()).toBe(false);
  });
});

describe('isClientRoute', () => {
  it('matches a pathname under a static route path', () => {
    provideRoles({ courseBar: ['org.openedx.frontend.role.learning'] });
    mockGetUrlByRouteRole.mockReturnValue('/course');

    expect(isClientRoute('/course/outline')).toBe(true);
  });

  it('matches a pathname under a parameterized route path', () => {
    provideRoles({ courseBar: ['org.openedx.frontend.role.instructorDashboard'] });
    mockGetUrlByRouteRole.mockReturnValue('/instructor-dashboard/:courseId');

    expect(isClientRoute('/instructor-dashboard/course-v1:edX+DemoX+Demo')).toBe(true);
  });

  it('does not match a pathname outside the route prefix', () => {
    provideRoles({ courseBar: ['org.openedx.frontend.role.instructorDashboard'] });
    mockGetUrlByRouteRole.mockReturnValue('/instructor-dashboard/:courseId');

    expect(isClientRoute('/courses/some-course/instructor')).toBe(false);
  });

  it('returns false for external routes', () => {
    provideRoles({ courseBar: ['org.openedx.frontend.role.learning'] });
    mockGetUrlByRouteRole.mockReturnValue('https://external.example.com/course');

    expect(isClientRoute('/course/outline')).toBe(false);
  });

  it('returns false when role has no matching route', () => {
    provideRoles({ courseBar: ['org.openedx.frontend.role.learning'] });
    mockGetUrlByRouteRole.mockReturnValue(null);

    expect(isClientRoute('/course/outline')).toBe(false);
  });
});
