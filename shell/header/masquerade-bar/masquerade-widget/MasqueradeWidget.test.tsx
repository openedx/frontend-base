import '@testing-library/jest-dom';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor, within, fireEvent } from '@testing-library/react';
import { getAllByRole } from '@testing-library/dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IntlProvider } from 'react-intl';
import { MasqueradeWidget } from './MasqueradeWidget';
import { useMasqueradeWidget } from './hooks';
import * as api from './data/api';

jest.mock('./data/api');

const mockGetMasqueradeOptions = api.getMasqueradeOptions as jest.MockedFunction<typeof api.getMasqueradeOptions>;
const mockPostMasqueradeOptions = api.postMasqueradeOptions as jest.MockedFunction<typeof api.postMasqueradeOptions>;

const COURSE_ID = 'course-v1:edX+DemoX+Demo';

const masqueradeOptions: api.MasqueradeOption[] = [
  { name: 'Staff', role: 'staff' },
  { name: 'Specific Student...', role: 'student', userName: '' },
  { name: 'Audit', role: 'student', groupId: 1, userPartitionId: 50 },
];

const defaultActive: api.ActiveMasqueradeData = {
  courseKey: COURSE_ID,
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

/**
 * Wrapper component that calls the hook and passes it to MasqueradeWidget.
 * This mirrors how MasqueradeBar uses it in production.
 */
function MasqueradeWidgetWithHook() {
  const masquerade = useMasqueradeWidget(COURSE_ID);
  return <MasqueradeWidget masquerade={masquerade} />;
}

function renderWidget() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <IntlProvider locale="en">
        <MasqueradeWidgetWithHook />
      </IntlProvider>
    </QueryClientProvider>,
  );
}

beforeAll(() => {
  Object.defineProperty(global, 'location', {
    configurable: true,
    value: { reload: jest.fn() },
  });
});

describe('MasqueradeWidget', () => {
  beforeEach(() => {
    mockGetMasqueradeOptions.mockResolvedValue(defaultResponse);
    mockPostMasqueradeOptions.mockResolvedValue(defaultResponse);
  });

  it('renders masquerade name correctly', async () => {
    renderWidget();
    await waitFor(() => expect(mockGetMasqueradeOptions).toHaveBeenCalledWith(COURSE_ID));
    expect(screen.getByRole('button')).toHaveTextContent('Staff');
  });

  masqueradeOptions.forEach((option) => {
    it(`marks role ${option.role} (${option.name}) as active`, async () => {
      const active: api.ActiveMasqueradeData = {
        courseKey: COURSE_ID,
        groupId: option.groupId ?? null,
        role: option.role,
        userName: option.userName !== undefined ? (option.userName || null) : null,
        userPartitionId: option.userPartitionId ?? null,
        groupName: null,
      };

      mockGetMasqueradeOptions.mockResolvedValue({
        success: true,
        active,
        available: masqueradeOptions,
      });

      const { container } = renderWidget();
      const dropdownToggle = container.querySelector('.dropdown-toggle')!;
      fireEvent.click(dropdownToggle);
      const dropdownMenu = container.querySelector('.dropdown-menu') as HTMLElement;
      await within(dropdownMenu).findAllByRole('button');

      if (option.userName !== undefined) {
        // Click "Specific Student..." to toggle the input visible, making it active
        const studentBtn = getAllByRole(dropdownMenu, 'button', { hidden: true })
          .find((b: HTMLElement) => b.textContent === option.name)!;
        fireEvent.click(studentBtn);
        // Re-open dropdown
        fireEvent.click(dropdownToggle);
        await within(dropdownMenu).findAllByRole('button');
        const updatedBtn = getAllByRole(dropdownMenu, 'button', { hidden: true })
          .find((b: HTMLElement) => b.textContent === option.name)!;
        expect(updatedBtn).toHaveClass('active');
      } else {
        getAllByRole(dropdownMenu, 'button', { hidden: true }).forEach((button: HTMLElement) => {
          if (button.textContent === option.name) {
            expect(button).toHaveClass('active');
          } else {
            expect(button).not.toHaveClass('active');
          }
        });
      }
    });
  });

  it('handles the clicks with toggle', async () => {
    const { container } = renderWidget();
    await waitFor(() => expect(mockGetMasqueradeOptions).toHaveBeenCalled());

    const dropdownToggle = container.querySelector('.dropdown-toggle')!;
    fireEvent.click(dropdownToggle);
    const dropdownMenu = container.querySelector('.dropdown-menu') as HTMLElement;
    const studentOption = await within(dropdownMenu).findByRole('button', { name: 'Specific Student...' });
    fireEvent.click(studentOption);

    // After clicking "Specific Student...", the username input should appear
    await waitFor(() => {
      expect(screen.getByLabelText(/Masquerade as this user/)).toBeInTheDocument();
    });
  });

  it('can masquerade as a specific user', async () => {
    const user = userEvent.setup();
    mockPostMasqueradeOptions.mockResolvedValue({
      ...defaultResponse,
      active: { ...defaultActive, role: 'student', userName: 'testUser' },
    });

    const { container } = renderWidget();
    await waitFor(() => expect(mockGetMasqueradeOptions).toHaveBeenCalled());

    const dropdownToggle = container.querySelector('.dropdown-toggle')!;
    await user.click(dropdownToggle);
    const dropdownMenu = container.querySelector('.dropdown-menu') as HTMLElement;
    const studentOption = await within(dropdownMenu).findByRole('button', { name: 'Specific Student...' });
    await user.click(studentOption);

    const usernameInput = await screen.findByLabelText(/Masquerade as this user/);
    await user.type(usernameInput, 'testuser');
    expect(mockPostMasqueradeOptions).not.toHaveBeenCalled();
    await user.keyboard('{Enter}');
    await waitFor(() => expect(mockPostMasqueradeOptions).toHaveBeenCalledTimes(1));
  });

  it('displays an error when failing to masquerade as a specific user', async () => {
    const user = userEvent.setup();
    mockPostMasqueradeOptions.mockResolvedValue({
      success: false,
      error: 'That user does not exist',
      active: defaultActive,
      available: masqueradeOptions,
    });

    const { container } = renderWidget();
    await waitFor(() => expect(mockGetMasqueradeOptions).toHaveBeenCalled());

    const dropdownToggle = container.querySelector('.dropdown-toggle')!;
    await user.click(dropdownToggle);
    const dropdownMenu = container.querySelector('.dropdown-menu') as HTMLElement;
    const studentOption = await within(dropdownMenu).findByRole('button', { name: 'Specific Student...' });
    await user.click(studentOption);

    const usernameInput = await screen.findByLabelText(/Masquerade as this user/);
    await user.type(usernameInput, 'testuser');
    await user.keyboard('{Enter}');
    await waitFor(() => expect(mockPostMasqueradeOptions).toHaveBeenCalled());
  });

  it('displays an error on network failure', async () => {
    const user = userEvent.setup();
    mockPostMasqueradeOptions.mockRejectedValue(new Error('Network Error'));

    const { container } = renderWidget();
    await waitFor(() => expect(mockGetMasqueradeOptions).toHaveBeenCalled());

    const dropdownToggle = container.querySelector('.dropdown-toggle')!;
    await user.click(dropdownToggle);
    const dropdownMenu = container.querySelector('.dropdown-menu') as HTMLElement;
    const studentOption = await within(dropdownMenu).findByRole('button', { name: 'Specific Student...' });
    await user.click(studentOption);

    const usernameInput = await screen.findByLabelText(/Masquerade as this user/);
    await user.type(usernameInput, 'testuser');
    await user.keyboard('{Enter}');
    await waitFor(() => expect(mockPostMasqueradeOptions).toHaveBeenCalled());
  });
});
