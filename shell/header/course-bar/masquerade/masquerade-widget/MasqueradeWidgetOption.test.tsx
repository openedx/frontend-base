import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MasqueradeWidgetOption } from './MasqueradeWidgetOption';
import { MasqueradeContext } from '../MasqueradeContext';
import type { MasqueradeState } from '../hooks';
import type { ActiveMasqueradeData, MasqueradeOption } from '../data/api';

const defaultActive: ActiveMasqueradeData = {
  groupId: null,
  role: 'staff',
  userName: null,
  userPartitionId: null,
  groupName: null,
};

function buildContextValue(
  overrides: Partial<MasqueradeState> = {},
): MasqueradeState {
  return {
    active: defaultActive,
    available: [],
    pendingOption: null,
    showUserNameInput: false,
    userName: '',
    setUserName: jest.fn(),
    select: jest.fn(),
    submitUserName: jest.fn(),
    errorMessage: null,
    isSubmitting: false,
    isLoading: false,
    isDenied: false,
    isUnreachable: false,
    ...overrides,
  };
}

function renderWithContext(
  option: MasqueradeOption,
  contextOverrides: Partial<MasqueradeState> = {},
) {
  const contextValue = buildContextValue(contextOverrides);
  return {
    ...render(
      <MasqueradeContext.Provider value={contextValue}>
        <MasqueradeWidgetOption option={option} />
      </MasqueradeContext.Provider>,
    ),
    contextValue,
  };
}

describe('MasqueradeWidgetOption', () => {
  it('renders the active option with the active class', () => {
    renderWithContext({ name: 'Staff', role: 'staff' });
    const button = screen.getByRole('button', { name: 'Staff', hidden: true });
    expect(button).toHaveClass('active');
  });

  it('renders an inactive option without the active class', () => {
    renderWithContext({ name: 'Specific Student...', role: 'student', userName: '' });
    const button = screen.getByRole('button', { name: 'Specific Student...', hidden: true });
    expect(button).not.toHaveClass('active');
  });

  it('calls select with the option when clicked', async () => {
    const user = userEvent.setup();
    const select = jest.fn();
    const option: MasqueradeOption = { name: 'Staff', role: 'staff' };
    renderWithContext(option, { select });

    await user.click(screen.getByRole('button', { name: 'Staff', hidden: true }));

    expect(select).toHaveBeenCalledWith(option);
  });

  it('renders nothing when option name is empty', () => {
    const { container } = renderWithContext({ name: '', role: 'staff' });
    expect(container).toBeEmptyDOMElement();
  });

  it('highlights the pending option even when active does not match', () => {
    const pending: MasqueradeOption = { name: 'Specific Student...', role: 'student', userName: '' };
    renderWithContext(pending, { pendingOption: pending });
    const button = screen.getByRole('button', { name: 'Specific Student...', hidden: true });
    expect(button).toHaveClass('active');
  });

  it('does not highlight a non-pending option while another option is pending', () => {
    const pending: MasqueradeOption = { name: 'Specific Student...', role: 'student', userName: '' };
    renderWithContext({ name: 'Staff', role: 'staff' }, { pendingOption: pending });
    const button = screen.getByRole('button', { name: 'Staff', hidden: true });
    expect(button).not.toHaveClass('active');
  });
});
