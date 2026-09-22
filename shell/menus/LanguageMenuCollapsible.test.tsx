import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';

import { SiteContext, configureI18n } from '../../runtime';

import LanguageMenuCollapsible from './LanguageMenuCollapsible';

jest.mock('../../runtime', () => ({
  ...jest.requireActual('../../runtime'),
  updateSiteLanguage: jest.fn(),
}));

const mockUpdateSiteLanguage = jest.requireMock('../../runtime').updateSiteLanguage as jest.Mock;

function renderCollapsible(locale = 'en') {
  return render(
    <SiteContext.Provider value={{ locale } as never}>
      <IntlProvider locale="en">
        <LanguageMenuCollapsible />
      </IntlProvider>
    </SiteContext.Provider>,
  );
}

describe('LanguageMenuCollapsible', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    configureI18n({
      messages: {
        'es-419': {},
        ar: {},
      },
    });
  });

  it('keeps the languages collapsed behind the current one', () => {
    renderCollapsible();

    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.queryByText(/español/i)).not.toBeInTheDocument();
  });

  it('switches to a language picked from the expanded list', async () => {
    const user = userEvent.setup();
    mockUpdateSiteLanguage.mockResolvedValue(undefined);
    renderCollapsible();

    await user.click(screen.getByText('English'));
    await user.click(await screen.findByText(/español/i));

    await waitFor(() => expect(mockUpdateSiteLanguage).toHaveBeenCalledWith('es-419'));
  });

  it('shows a toast when the preference save fails', async () => {
    const user = userEvent.setup();
    mockUpdateSiteLanguage.mockRejectedValue(new Error('Network Error'));
    renderCollapsible();

    await user.click(screen.getByText('English'));
    await user.click(await screen.findByText(/español/i));

    const toast = await screen.findByRole('alert');
    expect(toast).toHaveTextContent(/could not save your language preference/i);
  });
});
