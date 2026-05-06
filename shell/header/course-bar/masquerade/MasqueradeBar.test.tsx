import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setSiteConfig, getSiteConfig } from '@openedx/frontend-base';

import MasqueradeBar from './MasqueradeBar';
import * as api from './data/api';

jest.mock('./data/api');

const mockGetMasqueradeOptions = api.getMasqueradeOptions as jest.MockedFunction<typeof api.getMasqueradeOptions>;

const COURSE_ID = 'course-v1:edX+DemoX+Demo';
const UNIT_ID = 'block-v1:edX+DemoX+Demo+type@vertical+block@abc123';

const defaultMasqueradeResponse: api.MasqueradeStatus = {
  success: true,
  active: {
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

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function renderMasqueradeBar(
  path = `/course/${COURSE_ID}/unit/${UNIT_ID}`,
  cmsBaseUrl = '',
) {
  mockGetMasqueradeOptions.mockResolvedValue(defaultMasqueradeResponse);
  setSiteConfig({ ...getSiteConfig(), cmsBaseUrl });

  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <IntlProvider locale="en">
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/course/:courseId/unit/:unitId" element={<MasqueradeBar />} />
            <Route path="/course/:courseId" element={<MasqueradeBar />} />
          </Routes>
        </MemoryRouter>
      </IntlProvider>
    </QueryClientProvider>,
  );
}

describe('MasqueradeBar', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders the masquerade widget', async () => {
    renderMasqueradeBar();

    expect(await screen.findByRole('region', { name: /masquerade bar/i })).toBeInTheDocument();
    expect(screen.getByText('View this course as:')).toBeInTheDocument();
  });

  it('displays Studio link when cmsBaseUrl is configured', async () => {
    renderMasqueradeBar(`/course/${COURSE_ID}/unit/${UNIT_ID}`, 'http://localhost:18010');

    const studioLink = await screen.findByRole('link', { name: 'Studio' });
    expect(screen.getByText('View course in:')).toBeInTheDocument();
    expect(studioLink).toHaveAttribute('href', `http://localhost:18010/container/${UNIT_ID}`);
  });

  it('builds Studio URL with courseId when unitId is not in the route', async () => {
    renderMasqueradeBar(`/course/${COURSE_ID}`, 'http://localhost:18010');

    const studioLink = await screen.findByRole('link', { name: 'Studio' });
    expect(studioLink).toHaveAttribute('href', `http://localhost:18010/course/${COURSE_ID}`);
  });

  it('does not display Studio link when cmsBaseUrl is not configured', async () => {
    renderMasqueradeBar(`/course/${COURSE_ID}/unit/${UNIT_ID}`, '');

    /* Wait until the bar is visible before asserting the link's absence. */
    await screen.findByRole('region', { name: /masquerade bar/i });
    expect(screen.queryByText('View course in:')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Studio' })).not.toBeInTheDocument();
  });
});
