import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import MasqueradeBar from './MasqueradeBar';
import * as api from './masquerade-widget/data/api';
import { getSiteConfig } from '@openedx/frontend-base';

jest.mock('./masquerade-widget/data/api');
jest.mock('@openedx/frontend-base', () => {
  const actual = jest.requireActual('@openedx/frontend-base');
  return {
    ...actual,
    getSiteConfig: jest.fn().mockReturnValue({}),
  };
});

const mockGetSiteConfig = getSiteConfig as jest.MockedFunction<typeof getSiteConfig>;

const mockGetMasqueradeOptions = api.getMasqueradeOptions as jest.MockedFunction<typeof api.getMasqueradeOptions>;

const COURSE_ID = 'course-v1:edX+DemoX+Demo';
const UNIT_ID = 'block-v1:edX+DemoX+Demo+type@vertical+block@abc123';

const defaultMasqueradeResponse: api.MasqueradeStatus = {
  success: true,
  active: {
    courseKey: COURSE_ID,
    groupId: null,
    role: 'staff',
    userName: null,
    userPartitionId: null,
    groupName: null,
  },
  available: [
    { name: 'Staff', role: 'staff' },
    { name: 'Specific Student...', role: 'student', userName: '' },
  ],
};

function renderMasqueradeBar(
  path = `/course/${COURSE_ID}/unit/${UNIT_ID}`,
  siteConfig: Record<string, unknown> = {},
) {
  mockGetMasqueradeOptions.mockResolvedValue(defaultMasqueradeResponse);
  mockGetSiteConfig.mockReturnValue(siteConfig as any);

  const result = render(
    <IntlProvider locale="en">
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/course/:courseId/unit/:unitId" element={<MasqueradeBar />} />
          <Route path="/course/:courseId" element={<MasqueradeBar />} />
        </Routes>
      </MemoryRouter>
    </IntlProvider>,
  );

  return result;
}

describe('MasqueradeBar', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the masquerade widget and does not display alerts by default', async () => {
    renderMasqueradeBar();

    await waitFor(() => expect(mockGetMasqueradeOptions).toHaveBeenCalledWith(COURSE_ID));
    expect(screen.getByRole('toolbar', { name: /masquerade/i })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('displays masquerade error when API returns success: false', async () => {
    mockGetMasqueradeOptions.mockResolvedValue({
      ...defaultMasqueradeResponse,
      success: false,
    });

    renderMasqueradeBar();

    await waitFor(() => expect(mockGetMasqueradeOptions).toHaveBeenCalled());
    expect(screen.getByRole('toolbar', { name: /masquerade/i })).toBeInTheDocument();
  });

  it('displays Studio link when studioBaseUrl is configured', async () => {
    renderMasqueradeBar(
      `/course/${COURSE_ID}/unit/${UNIT_ID}`,
      { studioBaseUrl: 'http://localhost:18010' },
    );

    await waitFor(() => expect(mockGetMasqueradeOptions).toHaveBeenCalled());

    expect(screen.getByText('View course in:')).toBeInTheDocument();
    const studioLink = screen.getByRole('link', { name: 'Studio' });
    expect(studioLink).toHaveAttribute('href', `http://localhost:18010/container/${UNIT_ID}`);
  });

  it('builds Studio URL with courseId when unitId is not in the route', async () => {
    renderMasqueradeBar(
      `/course/${COURSE_ID}`,
      { studioBaseUrl: 'http://localhost:18010' },
    );

    await waitFor(() => expect(mockGetMasqueradeOptions).toHaveBeenCalled());

    const studioLink = screen.getByRole('link', { name: 'Studio' });
    expect(studioLink).toHaveAttribute('href', `http://localhost:18010/course/${COURSE_ID}`);
  });

  it('does not display Studio link when studioBaseUrl is not configured', async () => {
    renderMasqueradeBar(
      `/course/${COURSE_ID}/unit/${UNIT_ID}`,
      {},
    );

    await waitFor(() => expect(mockGetMasqueradeOptions).toHaveBeenCalled());

    expect(screen.queryByText('View course in:')).not.toBeInTheDocument();
    expect(screen.queryByText('Studio')).not.toBeInTheDocument();
  });
});
