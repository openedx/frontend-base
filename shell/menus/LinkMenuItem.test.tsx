import '@testing-library/jest-dom';
import { ComponentProps } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';

import { mergeSiteConfig } from '../../runtime';
import { IntlProvider } from '../../runtime/i18n';
import LinkMenuItem from './LinkMenuItem';

const accountRole = 'org.openedx.frontend.role.linkMenuItemTest.account';
const profileRole = 'org.openedx.frontend.role.linkMenuItemTest.profile';
const externalUrl = 'https://apps.example.com/profile/';

mergeSiteConfig({
  apps: [{
    appId: 'org.openedx.frontend.app.linkMenuItemTest',
    routes: [{ path: '/account/*', handle: { roles: [accountRole] } }],
  }],
  externalRoutes: [{ role: profileRole, url: externalUrl }],
});

function LocationDisplay() {
  const { pathname } = useLocation();
  return <div data-testid="location">{pathname}</div>;
}

function renderItem(props: Partial<ComponentProps<typeof LinkMenuItem>>, initialEntry = '/home') {
  return render(
    <IntlProvider locale="en">
      <MemoryRouter initialEntries={[initialEntry]}>
        <LinkMenuItem label="Account" {...props} />
        <LocationDisplay />
      </MemoryRouter>
    </IntlProvider>
  );
}

// jsdom cannot navigate, so keep a plain anchor's click from reaching it.
function clickWithoutNavigating(link: HTMLElement) {
  link.addEventListener('click', (event) => event.preventDefault());
  fireEvent.click(link);
}

const variants = ['hyperlink', 'navLink', 'navDropdownItem', 'dropdownItem'] as const;

describe('LinkMenuItem', () => {
  describe.each(variants)('as %s', (variant) => {
    it('navigates to a route an app provides without leaving the client', () => {
      renderItem({ role: accountRole, variant });

      const link = screen.getByRole('link', { name: 'Account' });
      expect(link).toHaveAttribute('href', '/account');

      fireEvent.click(link);
      expect(screen.getByTestId('location')).toHaveTextContent('/account');
    });

    it('links to an external route with a plain anchor', () => {
      renderItem({ role: profileRole, variant });

      const link = screen.getByRole('link', { name: 'Account' });
      expect(link).toHaveAttribute('href', externalUrl);

      clickWithoutNavigating(link);
      expect(screen.getByTestId('location')).toHaveTextContent('/home');
    });
  });

  it('treats a URL given directly the same way', () => {
    renderItem({ url: '/help', variant: 'navLink' });

    fireEvent.click(screen.getByRole('link', { name: 'Account' }));
    expect(screen.getByTestId('location')).toHaveTextContent('/help');
  });

  it('marks the nav link active on its own route', () => {
    renderItem({ role: accountRole, variant: 'navLink' }, '/account/');

    expect(screen.getByRole('link', { name: 'Account' })).toHaveClass('active');
  });

  it('renders nothing when no app or external route provides the role', () => {
    renderItem({ role: 'org.openedx.frontend.role.linkMenuItemTest.missing', variant: 'dropdownItem' });

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
