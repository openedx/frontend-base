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

// Paragon's Hyperlink defaults target to _self, adds noopener noreferrer to any rel on a _blank
// link, and appends "in a new tab" to a _blank link's accessible name. The other variants render
// exactly what LinkMenuItem passes them.
const plainExpectations = { defaultTarget: null, explicitNoopenerRel: 'noopener', newTabName: 'Account' };
const expected = {
  hyperlink: { defaultTarget: '_self', explicitNoopenerRel: 'noopener noreferrer', newTabName: 'Account in a new tab' },
  navLink: plainExpectations,
  navDropdownItem: plainExpectations,
  dropdownItem: plainExpectations,
};

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

    it('renders neither target nor rel by default', () => {
      renderItem({ role: profileRole, variant });
      const link = screen.getByRole('link', { name: 'Account' });
      expect(link.getAttribute('target')).toBe(expected[variant].defaultTarget);
      expect(link).not.toHaveAttribute('rel');
    });

    it('defaults rel to noopener noreferrer when opening a new tab', () => {
      renderItem({ role: profileRole, variant, target: '_blank' });
      const link = screen.getByRole('link', { name: expected[variant].newTabName });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('uses an explicit rel unchanged', () => {
      renderItem({ role: profileRole, variant, target: '_blank', rel: 'noopener' });
      const link = screen.getByRole('link', { name: expected[variant].newTabName });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', expected[variant].explicitNoopenerRel);
    });

    it('passes any other target through without a rel', () => {
      renderItem({ role: profileRole, variant, target: 'studio-help' });
      const link = screen.getByRole('link', { name: 'Account' });
      expect(link).toHaveAttribute('target', 'studio-help');
      expect(link).not.toHaveAttribute('rel');
    });

    it('keeps target and rel on a route an app provides', () => {
      renderItem({ role: accountRole, variant, target: '_blank' });
      const link = screen.getByRole('link', { name: expected[variant].newTabName });
      expect(link).toHaveAttribute('href', '/account');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
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
