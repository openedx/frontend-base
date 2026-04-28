import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from '../../runtime/i18n';
import HelpButton from './HelpButton';

function renderHelpButton(getUrl: () => string | undefined) {
  return render(
    <IntlProvider locale="en">
      <MemoryRouter>
        <HelpButton getUrl={getUrl} />
      </MemoryRouter>
    </IntlProvider>
  );
}

describe('HelpButton', () => {
  it('renders nothing when getUrl returns undefined', () => {
    const { container } = renderHelpButton(() => undefined);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when getUrl returns an empty string', () => {
    const { container } = renderHelpButton(() => '');
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a Help link to the URL when getUrl returns a string', () => {
    renderHelpButton(() => 'https://help.example.com');
    const link = screen.getByRole('link', { name: 'Help' });
    expect(link).toHaveAttribute('href', 'https://help.example.com');
  });

  it('invokes getUrl on each render so config changes are picked up', () => {
    const getUrl = jest.fn().mockReturnValue('https://help.example.com');
    const { rerender } = render(
      <IntlProvider locale="en">
        <MemoryRouter>
          <HelpButton getUrl={getUrl} />
        </MemoryRouter>
      </IntlProvider>
    );
    expect(screen.getByRole('link', { name: 'Help' })).toHaveAttribute('href', 'https://help.example.com');

    getUrl.mockReturnValue('https://help.example.com/v2');
    rerender(
      <IntlProvider locale="en">
        <MemoryRouter>
          <HelpButton getUrl={getUrl} />
        </MemoryRouter>
      </IntlProvider>
    );
    expect(screen.getByRole('link', { name: 'Help' })).toHaveAttribute('href', 'https://help.example.com/v2');
  });
});
