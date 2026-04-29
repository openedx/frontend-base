import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import { getAllByRole } from '@testing-library/dom';
import { act } from '@testing-library/react';
import { MasqueradeWidgetOption } from './MasqueradeWidgetOption';
import { MasqueradeContext, MasqueradeContextValue } from './MasqueradeContext';
import { ActiveMasqueradeData } from './data/api';

const defaultActive: ActiveMasqueradeData = {
  courseKey: 'course-v1:edX+DemoX+Demo',
  groupId: null,
  role: 'staff',
  userName: null,
  userPartitionId: null,
  groupName: null,
};

function buildContextValue(overrides: Partial<MasqueradeContextValue> = {}): MasqueradeContextValue {
  return {
    active: defaultActive,
    onSubmit: jest.fn().mockResolvedValue({ success: true }),
    onError: jest.fn(),
    userNameInputToggle: jest.fn(),
    ...overrides,
  };
}

function renderWithContext(
  ui: React.ReactElement,
  contextOverrides: Partial<MasqueradeContextValue> = {},
) {
  const contextValue = buildContextValue(contextOverrides);
  return {
    ...render(
      <MasqueradeContext.Provider value={contextValue}>
        {ui}
      </MasqueradeContext.Provider>,
    ),
    contextValue,
  };
}

beforeAll(() => {
  Object.defineProperty(global, 'location', {
    configurable: true,
    value: { reload: jest.fn() },
  });
});

describe('MasqueradeWidgetOption', () => {
  it('renders active option correctly', () => {
    const { container } = renderWithContext(
      <MasqueradeWidgetOption groupName="Staff" role="staff" />,
    );
    const button = getAllByRole(container, 'button', { hidden: true })[0];
    expect(button).toHaveTextContent('Staff');
    expect(button).toHaveClass('active');
  });

  it('renders inactive option correctly', () => {
    const { container } = renderWithContext(
      <MasqueradeWidgetOption groupName="Specific Student..." role="student" userName="" />,
    );
    const button = getAllByRole(container, 'button', { hidden: true })[0];
    expect(button).toHaveTextContent('Specific Student...');
    expect(button).not.toHaveClass('active');
  });

  it('calls onSubmit when clicking a regular option', () => {
    const onSubmit = jest.fn().mockResolvedValue({ success: true });
    const { container } = renderWithContext(
      <MasqueradeWidgetOption groupName="Staff" role="staff" />,
      { onSubmit },
    );
    const button = getAllByRole(container, 'button', { hidden: true })[0];
    act(() => {
      fireEvent.click(button);
    });
    expect(onSubmit).toHaveBeenCalled();
  });

  it('calls userNameInputToggle when clicking a student option', () => {
    const userNameInputToggle = jest.fn();
    const { container } = renderWithContext(
      <MasqueradeWidgetOption groupName="Specific Student..." role="student" userName="" />,
      { userNameInputToggle },
    );
    const button = getAllByRole(container, 'button', { hidden: true })[0];
    act(() => {
      fireEvent.click(button);
    });
    expect(userNameInputToggle).toHaveBeenCalled();
  });

  it('renders nothing when groupName is empty', () => {
    const { container } = renderWithContext(
      <MasqueradeWidgetOption groupName="" role="staff" />,
    );
    expect(container.innerHTML).toBe('');
  });
});
