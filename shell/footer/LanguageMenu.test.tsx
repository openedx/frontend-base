import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';

import { SiteContext, configureI18n } from '../../runtime';

import LanguageMenu from './LanguageMenu';

jest.mock('../../runtime', () => ({
  ...jest.requireActual('../../runtime'),
  updateSiteLanguage: jest.fn(),
  updateLocale: jest.fn(),
}));

const mockUpdateSiteLanguage = jest.requireMock('../../runtime').updateSiteLanguage as jest.Mock;
const mockUpdateLocale = jest.requireMock('../../runtime').updateLocale as jest.Mock;

function renderLanguageMenu(locale = 'en') {
  return render(
    <SiteContext.Provider value={{ locale } as never}>
      <IntlProvider locale="en">
        <LanguageMenu />
      </IntlProvider>
    </SiteContext.Provider>,
  );
}

describe('LanguageMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    configureI18n({
      messages: {
        'es-419': {},
        ar: {},
      },
    });
  });

  it('switches to the selected language', async () => {
    const user = userEvent.setup();
    mockUpdateSiteLanguage.mockResolvedValue(undefined);
    renderLanguageMenu();

    await user.click(screen.getByRole('button', { name: 'English' }));
    await user.click(screen.getByText(/español/i));

    await waitFor(() => expect(mockUpdateSiteLanguage).toHaveBeenCalledWith('es-419'));
  });

  it('shows the selected language on the toggle while the change is pending', async () => {
    const user = userEvent.setup();
    mockUpdateSiteLanguage.mockImplementation(() => new Promise(() => {}));
    renderLanguageMenu();

    await user.click(screen.getByRole('button', { name: 'English' }));
    await user.click(screen.getByText(/español/i));

    expect(screen.getByRole('button', { expanded: false })).toHaveTextContent(/español/i);
  });

  it('keeps the optimistic change and shows a toast when the preference save fails', async () => {
    const user = userEvent.setup();
    mockUpdateSiteLanguage.mockRejectedValue(new Error('Network Error'));
    renderLanguageMenu();

    await user.click(screen.getByRole('button', { name: 'English' }));
    await user.click(screen.getByText(/español/i));

    const toast = await screen.findByRole('alert');
    expect(toast).toHaveTextContent(/could not save your language preference/i);
    expect(mockUpdateLocale).not.toHaveBeenCalled();
  });
});
