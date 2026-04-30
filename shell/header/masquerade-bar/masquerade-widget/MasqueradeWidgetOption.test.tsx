import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import { getAllByRole } from '@testing-library/dom';
import { act } from '@testing-library/react';
import { MasqueradeWidgetOption } from './MasqueradeWidgetOption';
import { MasqueradeContext, MasqueradeContextValue } from './MasqueradeContext';
import { MasqueradeOption } from './data/api';

function buildContextValue(overrides: Partial<MasqueradeContextValue> = {}): MasqueradeContextValue {
  return {
    select: jest.fn(),
    selectedOptionName: 'Staff',
    showUserNameInput: false,
    ...overrides,
  };
}

function renderWithContext(
  option: MasqueradeOption,
  contextOverrides: Partial<MasqueradeContextValue> = {},
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
  it('renders active option correctly', () => {
    const option: MasqueradeOption = { name: 'Staff', role: 'staff' };
    const { container } = renderWithContext(option, { selectedOptionName: 'Staff' });
    const button = getAllByRole(container, 'button', { hidden: true })[0];
    expect(button).toHaveTextContent('Staff');
    expect(button).toHaveClass('active');
  });

  it('renders inactive option correctly', () => {
    const option: MasqueradeOption = { name: 'Specific Student...', role: 'student', userName: '' };
    const { container } = renderWithContext(option, { selectedOptionName: 'Staff' });
    const button = getAllByRole(container, 'button', { hidden: true })[0];
    expect(button).toHaveTextContent('Specific Student...');
    expect(button).not.toHaveClass('active');
  });

  it('calls select with the option when clicked', () => {
    const option: MasqueradeOption = { name: 'Staff', role: 'staff' };
    const select = jest.fn();
    const { container } = renderWithContext(option, { select });
    const button = getAllByRole(container, 'button', { hidden: true })[0];
    act(() => {
      fireEvent.click(button);
    });
    expect(select).toHaveBeenCalledWith(option);
  });

  it('calls select with student option when clicked', () => {
    const option: MasqueradeOption = { name: 'Specific Student...', role: 'student', userName: '' };
    const select = jest.fn();
    const { container } = renderWithContext(option, { select });
    const button = getAllByRole(container, 'button', { hidden: true })[0];
    act(() => {
      fireEvent.click(button);
    });
    expect(select).toHaveBeenCalledWith(option);
  });

  it('renders nothing when option name is empty', () => {
    const option: MasqueradeOption = { name: '', role: 'staff' };
    const { container } = renderWithContext(option);
    expect(container.innerHTML).toBe('');
  });
});
