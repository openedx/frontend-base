import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '../../runtime/i18n';
import SkipLink from './SkipLink';

function renderSkipLink(page: React.ReactNode = null) {
  return render(
    <IntlProvider locale="en">
      <SkipLink />
      {page}
    </IntlProvider>
  );
}

describe('SkipLink', () => {
  const scrollIntoView = jest.fn();

  beforeAll(() => {
    Element.prototype.scrollIntoView = scrollIntoView;
  });

  beforeEach(() => {
    scrollIntoView.mockClear();
  });

  it('renders the skip link to the main content', () => {
    renderSkipLink();
    expect(screen.getByRole('link', { name: 'Skip to main content.' })).toHaveAttribute('href', '#main-content');
  });

  it('moves focus to the main landmark and makes it focusable', async () => {
    const user = userEvent.setup();
    renderSkipLink(<main>Content</main>);
    await user.click(screen.getByRole('link'));
    const main = screen.getByRole('main');
    expect(main).toHaveFocus();
    expect(main).toHaveAttribute('tabindex', '-1');
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it('passes over a hidden main landmark', async () => {
    const user = userEvent.setup();
    renderSkipLink(
      <>
        <main hidden>Hidden</main>
        <main>Content</main>
      </>
    );
    await user.click(screen.getByRole('link'));
    expect(screen.getByText('Content')).toHaveFocus();
  });

  it('keeps a tabindex the main landmark already has', async () => {
    const user = userEvent.setup();
    renderSkipLink(<main tabIndex={0}>Content</main>);
    await user.click(screen.getByRole('link'));
    expect(screen.getByRole('main')).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('main')).toHaveFocus();
  });

  it('falls back to the main-content wrapper when there is no main landmark', async () => {
    const user = userEvent.setup();
    renderSkipLink(<div id="main-content">Content</div>);
    await user.click(screen.getByRole('link'));
    expect(screen.getByText('Content')).toHaveFocus();
  });

  it('leaves the click alone when there is nothing to focus', async () => {
    const user = userEvent.setup();
    renderSkipLink();
    const link = screen.getByRole('link');
    const onClick = jest.fn();
    link.addEventListener('click', onClick);
    await user.click(link);
    expect(onClick.mock.calls[0][0].defaultPrevented).toBe(false);
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
