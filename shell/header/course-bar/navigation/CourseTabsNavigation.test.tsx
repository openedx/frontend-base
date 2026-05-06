import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IntlProvider } from '../../../../runtime/i18n';
import CourseTabsNavigation from './CourseTabsNavigation';
import * as service from '../data/service';
import * as utils from '../utils';

/* Mock just the network call; keep findActiveTab + queryKey real. */
jest.mock('../data/service', () => ({
  ...jest.requireActual('../data/service'),
  getCourseHomeCourseMetadata: jest.fn(),
}));
jest.mock('../utils');

const mockGetCourseHomeCourseMetadata = service.getCourseHomeCourseMetadata as jest.MockedFunction<typeof service.getCourseHomeCourseMetadata>;
const mockIsClientRoute = utils.isClientRoute as jest.MockedFunction<typeof utils.isClientRoute>;

const COURSE_ID = 'course-v1:edX+DemoX+Demo';
const LMS_BASE = 'https://lms.example.com';

const defaultTabs: service.CourseTab[] = [
  { tabId: 'course_info', title: 'Course Info', url: `${LMS_BASE}/instructor-dashboard/${COURSE_ID}/course_info` },
  { tabId: 'enrollments', title: 'Enrollments', url: `${LMS_BASE}/instructor-dashboard/${COURSE_ID}/enrollments` },
  { tabId: 'grading', title: 'Grading', url: `${LMS_BASE}/instructor-dashboard/${COURSE_ID}/grading` },
];

function renderComponent(pathname: string, tabs: service.CourseTab[] = defaultTabs) {
  mockGetCourseHomeCourseMetadata.mockResolvedValue({ tabs });

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <IntlProvider locale="en">
        <MemoryRouter initialEntries={[pathname]}>
          <Routes>
            <Route path="/instructor-dashboard/:courseId/*" element={<CourseTabsNavigation />} />
          </Routes>
        </MemoryRouter>
      </IntlProvider>
    </QueryClientProvider>
  );
}

describe('CourseTabsNavigation', () => {
  beforeEach(() => {
    mockIsClientRoute.mockReturnValue(false);
  });

  it('renders all tabs', async () => {
    renderComponent(`/instructor-dashboard/${COURSE_ID}/course_info`);

    expect(await screen.findByText('Course Info')).toBeInTheDocument();
    expect(screen.getByText('Enrollments')).toBeInTheDocument();
    expect(screen.getByText('Grading')).toBeInTheDocument();
  });

  // Note: Paragon's Nav.Link uses CSS class "active" rather than aria-current
  // for active state. This is a Paragon limitation.
  it('marks the matching tab as active (exact match)', async () => {
    renderComponent(`/instructor-dashboard/${COURSE_ID}/enrollments`);

    const enrollmentsLink = await screen.findByRole('link', { name: 'Enrollments' });
    expect(enrollmentsLink).toHaveClass('active');

    const courseInfoLink = screen.getByRole('link', { name: 'Course Info' });
    expect(courseInfoLink).not.toHaveClass('active');
  });

  it('marks the longest prefix match as active', async () => {
    renderComponent(`/instructor-dashboard/${COURSE_ID}/grading/some-detail`);

    const gradingLink = await screen.findByRole('link', { name: 'Grading' });
    expect(gradingLink).toHaveClass('active');
  });

  it('does not mark any tab active when no path matches', async () => {
    renderComponent(`/instructor-dashboard/${COURSE_ID}/unknown`);

    await screen.findByRole('link', { name: 'Course Info' });
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).not.toHaveClass('active');
    });
  });

  it('renders tabs as <a href> when isClientRoute returns false', async () => {
    mockIsClientRoute.mockReturnValue(false);
    renderComponent(`/instructor-dashboard/${COURSE_ID}/course_info`);

    const link = await screen.findByText('Course Info');
    expect(link.closest('a')).toHaveAttribute('href', `${LMS_BASE}/instructor-dashboard/${COURSE_ID}/course_info`);
  });

  it('renders tabs as Link when isClientRoute returns true', async () => {
    mockIsClientRoute.mockReturnValue(true);
    renderComponent(`/instructor-dashboard/${COURSE_ID}/course_info`);

    const link = await screen.findByText('Course Info');
    expect(link.closest('a')).toHaveAttribute('href', `/instructor-dashboard/${COURSE_ID}/course_info`);
  });

  it('renders a loading skeleton while fetching', () => {
    mockGetCourseHomeCourseMetadata.mockReturnValue(new Promise(() => {}));
    renderComponent(`/instructor-dashboard/${COURSE_ID}/course_info`);

    expect(screen.getByText((_, el) => el?.classList.contains('react-loading-skeleton') ?? false)).toBeInTheDocument();
  });

  it('renders nothing when tabs are empty', async () => {
    renderComponent(`/instructor-dashboard/${COURSE_ID}/course_info`, []);

    // Wait for the query to settle, then verify nothing rendered
    await new Promise(resolve => {
      setTimeout(resolve, 50);
    });
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('has an accessible label', async () => {
    renderComponent(`/instructor-dashboard/${COURSE_ID}/course_info`);

    await screen.findByText('Course Info');
    expect(screen.getByLabelText('Course Navigation Bar')).toBeInTheDocument();
  });
});
