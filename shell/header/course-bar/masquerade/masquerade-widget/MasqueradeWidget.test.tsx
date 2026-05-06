import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IntlProvider } from 'react-intl';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import MasqueradeBar from '../MasqueradeBar';
import * as api from '../data/api';
import * as service from '../../data/service';
import * as sharedUtils from '../../utils';

const mockNavigate = jest.fn();

jest.mock('../data/api');
/* Keep findActiveTab and the queryKey real; mock only the network call. */
jest.mock('../../data/service', () => ({
  ...jest.requireActual('../../data/service'),
  getCourseHomeCourseMetadata: jest.fn(),
}));
jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  isClientRoute: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockGetMasqueradeOptions = api.getMasqueradeOptions as jest.MockedFunction<typeof api.getMasqueradeOptions>;
const mockPostMasqueradeOptions = api.postMasqueradeOptions as jest.MockedFunction<typeof api.postMasqueradeOptions>;
const mockGetCourseHomeCourseMetadata = service.getCourseHomeCourseMetadata as jest.MockedFunction<typeof service.getCourseHomeCourseMetadata>;
const mockIsClientRoute = sharedUtils.isClientRoute as jest.MockedFunction<typeof sharedUtils.isClientRoute>;

const mockLocationAssign = jest.fn();

beforeAll(() => {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { ...window.location, assign: mockLocationAssign },
  });
});

const COURSE_ID = 'course-v1:edX+DemoX+Demo';

const masqueradeOptions: api.MasqueradeOption[] = [
  { name: 'Staff', role: 'staff' },
  { name: 'Specific Student...', role: 'student', userName: '' },
  { name: 'Audit', role: 'student', groupId: 1, userPartitionId: 50 },
];

const defaultActive: api.ActiveMasqueradeData = {
  groupId: null,
  role: 'staff',
  userName: null,
  userPartitionId: null,
  groupName: null,
};

const defaultResponse: api.MasqueradeStatus = {
  success: true,
  active: defaultActive,
  available: masqueradeOptions,
};

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function renderWidget() {
  const queryClient = createTestQueryClient();
  const result = render(
    <QueryClientProvider client={queryClient}>
      <IntlProvider locale="en">
        <MemoryRouter initialEntries={[`/course/${COURSE_ID}`]}>
          <Routes>
            <Route path="/course/:courseId" element={<MasqueradeBar />} />
          </Routes>
        </MemoryRouter>
      </IntlProvider>
    </QueryClientProvider>,
  );
  return { ...result, queryClient };
}

describe('MasqueradeWidget', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockGetMasqueradeOptions.mockResolvedValue(defaultResponse);
    mockPostMasqueradeOptions.mockResolvedValue(defaultResponse);
    mockGetCourseHomeCourseMetadata.mockResolvedValue({ tabs: [] });
    mockIsClientRoute.mockReturnValue(false);
  });

  it('renders the active option name in the dropdown toggle', async () => {
    renderWidget();
    expect(await screen.findByRole('button', { name: 'Staff' })).toBeInTheDocument();
    expect(mockGetMasqueradeOptions).toHaveBeenCalledWith(COURSE_ID);
  });

  masqueradeOptions.forEach((option) => {
    it(`marks role ${option.role} (${option.name}) as active`, async () => {
      const user = userEvent.setup();
      mockGetMasqueradeOptions.mockResolvedValue({
        success: true,
        active: {
          groupId: option.groupId ?? null,
          role: option.role,
          userName: option.userName ?? null,
          userPartitionId: option.userPartitionId ?? null,
          groupName: null,
        },
        available: masqueradeOptions,
      });

      renderWidget();
      await user.click(await screen.findByRole('button', { expanded: false }));

      const items = await screen.findAllByRole('button', { hidden: true });
      items.filter(button => button.classList.contains('dropdown-item')).forEach((button) => {
        if (button.textContent === option.name) {
          expect(button).toHaveClass('active');
        } else {
          expect(button).not.toHaveClass('active');
        }
      });
    });
  });

  it('highlights "Specific Student..." when masquerading as a specific user', async () => {
    const user = userEvent.setup();
    mockGetMasqueradeOptions.mockResolvedValue({
      ...defaultResponse,
      active: { ...defaultActive, role: 'student', userName: 'alice' },
    });

    renderWidget();
    await user.click(await screen.findByRole('button', { expanded: false }));

    const items = await screen.findAllByRole('button', { hidden: true });
    const dropdownItems = items.filter(b => b.classList.contains('dropdown-item'));
    const specific = dropdownItems.find(b => b.textContent === 'Specific Student...')!;
    expect(specific).toHaveClass('active');
    dropdownItems.filter(b => b !== specific).forEach((b) => expect(b).not.toHaveClass('active'));
  });

  it('does not overwrite the user\'s typing when the query refetches', async () => {
    const user = userEvent.setup();
    mockGetMasqueradeOptions
      .mockResolvedValueOnce(defaultResponse)
      .mockResolvedValueOnce({
        ...defaultResponse,
        active: { ...defaultActive, role: 'student', userName: 'externalUser' },
      });

    const { queryClient } = renderWidget();
    await user.click(await screen.findByRole('button', { name: 'Staff' }));
    await user.click(await screen.findByRole('button', { name: 'Specific Student...' }));
    const usernameInput = await screen.findByLabelText(/Username or email/) as HTMLInputElement;
    await user.type(usernameInput, 'myDraft');
    expect(usernameInput.value).toBe('myDraft');

    /* Simulate another tab changing masquerade: invalidate, second mock fires. */
    await queryClient.invalidateQueries({ queryKey: ['masquerade', COURSE_ID] });
    await waitFor(() => expect(mockGetMasqueradeOptions).toHaveBeenCalledTimes(2));

    expect(usernameInput.value).toBe('myDraft');
  });

  it('submits the group payload when a group option is selected', async () => {
    const user = userEvent.setup();
    renderWidget();
    await user.click(await screen.findByRole('button', { name: 'Staff' }));
    await user.click(await screen.findByRole('button', { name: 'Audit' }));

    await waitFor(() => expect(mockPostMasqueradeOptions).toHaveBeenCalledWith(
      COURSE_ID,
      { role: 'student', group_id: 1, user_partition_id: 50 },
    ));
  });

  it('clears the masquerade when the Staff option is selected', async () => {
    const user = userEvent.setup();
    mockGetMasqueradeOptions.mockResolvedValue({
      ...defaultResponse,
      active: { ...defaultActive, role: 'student', userName: 'alice' },
    });

    renderWidget();
    /* Toggle shows the active username; it's the only collapsed button. */
    await user.click(await screen.findByRole('button', { expanded: false }));
    await user.click(await screen.findByRole('button', { name: 'Staff' }));

    await waitFor(() => expect(mockPostMasqueradeOptions).toHaveBeenCalledWith(
      COURSE_ID,
      { role: 'staff' },
    ));
  });

  it('opens the username input when "Specific Student..." is selected', async () => {
    const user = userEvent.setup();
    renderWidget();
    await user.click(await screen.findByRole('button', { name: 'Staff' }));
    await user.click(await screen.findByRole('button', { name: 'Specific Student...' }));

    expect(await screen.findByLabelText(/Username or email/)).toBeInTheDocument();
  });

  it('updates the toggle label optimistically when an option is clicked', async () => {
    const user = userEvent.setup();
    renderWidget();

    /* Toggle starts on "Staff" (the active server state). */
    await user.click(await screen.findByRole('button', { name: 'Staff' }));
    await user.click(await screen.findByRole('button', { name: 'Specific Student...' }));

    /* Toggle should now reflect the click, even though no submit has happened. */
    expect(screen.getByRole('button', { expanded: false })).toHaveTextContent('Specific Student...');
  });

  it('submits a username and refetches masquerade state', async () => {
    const user = userEvent.setup();
    mockPostMasqueradeOptions.mockResolvedValue({
      ...defaultResponse,
      active: { ...defaultActive, role: 'student', userName: 'testuser' },
    });

    renderWidget();
    await user.click(await screen.findByRole('button', { name: 'Staff' }));
    await user.click(await screen.findByRole('button', { name: 'Specific Student...' }));

    const usernameInput = await screen.findByLabelText(/Username or email/);
    await user.type(usernameInput, 'testuser');
    expect(mockPostMasqueradeOptions).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(mockPostMasqueradeOptions).toHaveBeenCalledWith(
      COURSE_ID,
      { role: 'student', user_name: 'testuser' },
    ));
  });

  it('shows the "no student found" error on a 404', async () => {
    const user = userEvent.setup();
    const error = Object.assign(new Error('Not Found'), {
      customAttributes: { httpErrorStatus: 404 },
    });
    mockPostMasqueradeOptions.mockRejectedValue(error);

    renderWidget();
    await user.click(await screen.findByRole('button', { name: 'Staff' }));
    await user.click(await screen.findByRole('button', { name: 'Specific Student...' }));

    const usernameInput = await screen.findByLabelText(/Username or email/);
    await user.type(usernameInput, 'missing');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(
      await screen.findByText(/No student with this username or email could be found/),
    ).toBeInTheDocument();
  });

  it('shows an alert when masquerade options fail to load', async () => {
    mockGetMasqueradeOptions.mockRejectedValue(new Error('Boom'));

    renderWidget();

    expect(
      await screen.findByText(/Unable to load masquerade options/),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Staff' })).not.toBeInTheDocument();
  });

  it('hides the bar entirely when the server returns success: false', async () => {
    mockGetMasqueradeOptions.mockResolvedValue({ ...defaultResponse, success: false });

    renderWidget();

    await waitFor(() => expect(mockGetMasqueradeOptions).toHaveBeenCalled());
    expect(screen.queryByRole('region', { name: /masquerade bar/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/Unable to load masquerade options/)).not.toBeInTheDocument();
  });

  it('hides the bar entirely on 403', async () => {
    const error = Object.assign(new Error('Forbidden'), {
      customAttributes: { httpErrorStatus: 403 },
    });
    mockGetMasqueradeOptions.mockRejectedValue(error);

    renderWidget();

    await waitFor(() => expect(mockGetMasqueradeOptions).toHaveBeenCalled());
    expect(screen.queryByRole('region', { name: /masquerade bar/i })).not.toBeInTheDocument();
  });

  it('renders nothing while the initial query is in flight', () => {
    mockGetMasqueradeOptions.mockImplementation(() => new Promise(() => { /* never resolves */ }));

    renderWidget();

    expect(screen.queryByRole('region', { name: /masquerade bar/i })).not.toBeInTheDocument();
  });

  it('shows a generic error on network failures', async () => {
    const user = userEvent.setup();
    mockPostMasqueradeOptions.mockRejectedValue(new Error('Network Error'));

    renderWidget();
    await user.click(await screen.findByRole('button', { name: 'Staff' }));
    await user.click(await screen.findByRole('button', { name: 'Specific Student...' }));

    const usernameInput = await screen.findByLabelText(/Username or email/);
    await user.type(usernameInput, 'testuser');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(
      await screen.findByText(/An error has occurred; please try again/),
    ).toBeInTheDocument();
  });

  it('shows an alert below the bar when a dropdown-option mutation fails', async () => {
    const user = userEvent.setup();
    mockPostMasqueradeOptions.mockRejectedValue(new Error('Network Error'));

    renderWidget();
    await user.click(await screen.findByRole('button', { name: 'Staff' }));
    await user.click(await screen.findByRole('button', { name: 'Audit' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/An error has occurred; please try again/);
    /* The alert sits outside the blue bar's container so colour and layout don't fight. */
    expect(alert.closest('.bg-primary')).toBeNull();
  });

  it('reverts the toggle to the active option when a dropdown-option mutation fails', async () => {
    const user = userEvent.setup();
    mockPostMasqueradeOptions.mockRejectedValue(new Error('Network Error'));

    renderWidget();
    await user.click(await screen.findByRole('button', { name: 'Staff' }));
    await user.click(await screen.findByRole('button', { name: 'Audit' }));

    /* Once the failure lands, the toggle must drop the optimistic "Audit" pick
     * and snap back to the real active option ("Staff"). */
    await screen.findByRole('alert');
    await waitFor(() => {
      expect(document.getElementById('masquerade-widget-toggle')).toHaveTextContent('Staff');
    });
  });

  it('keeps the input/submit row intact when a username submission fails', async () => {
    const user = userEvent.setup();
    mockPostMasqueradeOptions.mockRejectedValue(new Error('Network Error'));

    renderWidget();
    await user.click(await screen.findByRole('button', { name: 'Staff' }));
    await user.click(await screen.findByRole('button', { name: 'Specific Student...' }));
    const usernameInput = await screen.findByLabelText(/Username or email/);
    await user.type(usernameInput, 'testuser');
    const submit = screen.getByRole('button', { name: 'Submit' });
    await user.click(submit);

    /* Once the error appears, the input and the submit are still in the same flex row. */
    await screen.findByRole('alert');
    expect(usernameInput.closest('form')).toBe(submit.closest('form'));
  });

  it('uses the server-provided error string when success is false', async () => {
    const user = userEvent.setup();
    mockPostMasqueradeOptions.mockResolvedValue({
      ...defaultResponse,
      success: false,
      error: 'Tried to masquerade as a deactivated user.',
    });

    renderWidget();
    await user.click(await screen.findByRole('button', { name: 'Staff' }));
    await user.click(await screen.findByRole('button', { name: 'Specific Student...' }));

    const usernameInput = await screen.findByLabelText(/Username or email/);
    await user.type(usernameInput, 'deactivated');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(
      await screen.findByText('Tried to masquerade as a deactivated user.'),
    ).toBeInTheDocument();
  });

  it('clears a stale mutation error when a new option is selected', async () => {
    const user = userEvent.setup();
    mockPostMasqueradeOptions.mockRejectedValueOnce(new Error('Network Error'));

    renderWidget();

    /* Trigger an error from a dropdown click. */
    await user.click(await screen.findByRole('button', { name: 'Staff' }));
    await user.click(await screen.findByRole('button', { name: 'Audit' }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();

    /* Selecting "Specific Student..." should clear it before opening the input. */
    await user.click(await screen.findByRole('button', { expanded: false }));
    await user.click(await screen.findByRole('button', { name: 'Specific Student...' }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(
      screen.queryByText(/An error has occurred; please try again/),
    ).not.toBeInTheDocument();
  });

  describe('demotion redirect', () => {
    /* The route the widget renders at, /course/${COURSE_ID}, is what
     * `location.pathname` resolves to inside the hook.  We compose tab
     * fixtures that either include this path (no redirect) or don't (redirect
     * to the first tab the new role can still see). */
    const externalLearning = `http://learning.example/learning/course/${COURSE_ID}`;
    const inAppOutline = `https://lms.example/course/${COURSE_ID}/outline`;
    const currentPathTab = `https://lms.example/course/${COURSE_ID}`;

    it('uses window.location when the new role lives on a different origin', async () => {
      const user = userEvent.setup();
      /* Tabs the demoted user can see: only an external "course home". The
       * current path /course/${COURSE_ID} isn't in the list, so we redirect. */
      mockGetCourseHomeCourseMetadata.mockResolvedValue({
        tabs: [{ tabId: 'outline', title: 'Course', url: externalLearning }],
      });
      mockPostMasqueradeOptions.mockResolvedValue({ success: true } as api.MasqueradeStatus);

      renderWidget();
      await user.click(await screen.findByRole('button', { name: 'Staff' }));
      await user.click(await screen.findByRole('button', { name: 'Audit' }));

      await waitFor(() => expect(mockLocationAssign).toHaveBeenCalledWith(externalLearning));
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('uses react-router navigate when the first remaining tab is in-app', async () => {
      const user = userEvent.setup();
      mockGetCourseHomeCourseMetadata.mockResolvedValue({
        tabs: [{ tabId: 'outline', title: 'Outline', url: inAppOutline }],
      });
      mockIsClientRoute.mockReturnValue(true);
      mockPostMasqueradeOptions.mockResolvedValue({ success: true } as api.MasqueradeStatus);

      renderWidget();
      await user.click(await screen.findByRole('button', { name: 'Staff' }));
      await user.click(await screen.findByRole('button', { name: 'Audit' }));

      await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith(
        `/course/${COURSE_ID}/outline`,
        { replace: true },
      ));
      expect(mockLocationAssign).not.toHaveBeenCalled();
    });

    it('does not navigate when the current path is still a tab', async () => {
      /* The demoted user can still see the page they're on, so the redirect
       * is suppressed — but the bar must still refetch its query state. */
      const user = userEvent.setup();
      mockGetCourseHomeCourseMetadata.mockResolvedValue({
        tabs: [{ tabId: 'outline', title: 'Outline', url: currentPathTab }],
      });
      mockPostMasqueradeOptions.mockResolvedValue({ success: true } as api.MasqueradeStatus);

      renderWidget();
      await user.click(await screen.findByRole('button', { name: 'Staff' }));
      await user.click(await screen.findByRole('button', { name: 'Audit' }));

      await waitFor(() => expect(mockPostMasqueradeOptions).toHaveBeenCalled());
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(mockLocationAssign).not.toHaveBeenCalled();
      await waitFor(() => expect(mockGetMasqueradeOptions).toHaveBeenCalledTimes(2));
    });

    it('redirects on the bare {success: true} response shape the LMS actually returns', async () => {
      /* The POST endpoint returns only `{success: true}` — no `active` or
       * `available`.  The redirect logic relies on the submitted payload's
       * role, not the response, to decide whether to check the new tabs. */
      const user = userEvent.setup();
      mockGetCourseHomeCourseMetadata.mockResolvedValue({
        tabs: [{ tabId: 'outline', title: 'Course', url: externalLearning }],
      });
      mockPostMasqueradeOptions.mockResolvedValue({ success: true } as api.MasqueradeStatus);

      renderWidget();
      await user.click(await screen.findByRole('button', { name: 'Staff' }));
      await user.click(await screen.findByRole('button', { name: 'Audit' }));

      await waitFor(() => expect(mockLocationAssign).toHaveBeenCalledWith(externalLearning));
    });

    it('does not navigate when the new identity can still see the current page', async () => {
      const user = userEvent.setup();
      /* Picking Staff while alice is masquerading: the tabs API returns the
       * staff-visible set, which still includes the current path, so no
       * redirect — but the tabs are still fetched. */
      mockGetCourseHomeCourseMetadata.mockResolvedValue({
        tabs: [{ tabId: 'outline', title: 'Outline', url: currentPathTab }],
      });
      mockGetMasqueradeOptions.mockResolvedValue({
        ...defaultResponse,
        active: { ...defaultActive, role: 'student', userName: 'alice' },
      });
      mockPostMasqueradeOptions.mockResolvedValue({
        ...defaultResponse,
        active: defaultActive, /* role: 'staff' */
      });

      renderWidget();
      /* Toggle shows the active username; click it then click Staff. */
      await user.click(await screen.findByRole('button', { expanded: false }));
      await user.click(await screen.findByRole('button', { name: 'Staff' }));

      await waitFor(() => expect(mockPostMasqueradeOptions).toHaveBeenCalled());
      expect(mockLocationAssign).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('does not navigate when the new identity has no remaining tabs', async () => {
      const user = userEvent.setup();
      mockGetCourseHomeCourseMetadata.mockResolvedValue({ tabs: [] });
      mockPostMasqueradeOptions.mockResolvedValue({
        ...defaultResponse,
        active: { ...defaultActive, role: 'student', groupId: 1, userPartitionId: 50 },
      });

      renderWidget();
      await user.click(await screen.findByRole('button', { name: 'Staff' }));
      await user.click(await screen.findByRole('button', { name: 'Audit' }));

      await waitFor(() => expect(mockPostMasqueradeOptions).toHaveBeenCalled());
      expect(mockLocationAssign).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('does not navigate when the server returns success: false', async () => {
      const user = userEvent.setup();
      mockPostMasqueradeOptions.mockResolvedValue({
        ...defaultResponse,
        success: false,
        error: 'Tried to masquerade as a deactivated user.',
      });

      renderWidget();
      await user.click(await screen.findByRole('button', { name: 'Staff' }));
      await user.click(await screen.findByRole('button', { name: 'Audit' }));

      await waitFor(() => expect(mockPostMasqueradeOptions).toHaveBeenCalled());
      expect(mockLocationAssign).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(mockGetCourseHomeCourseMetadata).not.toHaveBeenCalled();
    });
  });
});
