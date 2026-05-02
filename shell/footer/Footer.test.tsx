import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LayoutOperationTypes, WidgetOperationTypes } from '../../runtime';
import { getSiteConfig, setSiteConfig } from '../../runtime/config';
import { IntlProvider } from '../../runtime/i18n';
import { initializeMockApp } from '../../runtime/testing';
import footerApp from './app';
import Footer from './Footer';

function renderFooter() {
  return render(
    <IntlProvider locale="en">
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    </IntlProvider>
  );
}

describe('Footer', () => {
  let baseSiteConfig: ReturnType<typeof getSiteConfig>;

  beforeAll(() => {
    initializeMockApp();
    baseSiteConfig = getSiteConfig();
  });

  afterEach(() => {
    setSiteConfig({ ...baseSiteConfig, apps: [] });
  });

  it('renders the default desktop footer layout', () => {
    setSiteConfig({ ...baseSiteConfig, apps: [footerApp] });

    const { container } = renderFooter();

    expect(container.querySelector('footer')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /powered by/i })).toBeInTheDocument();
  });

  it('replaces the entire footer when desktopLayout.v1 widget is replaced', () => {
    setSiteConfig({
      ...baseSiteConfig,
      apps: [
        footerApp,
        {
          appId: 'test-app',
          slots: [
            {
              slotId: 'org.openedx.frontend.slot.footer.desktop.v1',
              id: 'test-app.customFooter',
              relatedId: 'org.openedx.frontend.widget.footer.desktopLayout.v1',
              op: WidgetOperationTypes.REPLACE,
              element: <div>Custom Footer Replacement</div>,
            },
          ],
        },
      ],
    });

    const { container } = renderFooter();

    expect(screen.getByText('Custom Footer Replacement')).toBeInTheDocument();
    expect(container.querySelector('footer')).not.toBeInTheDocument();
    expect(screen.queryByRole('img', { name: /powered by/i })).not.toBeInTheDocument();
  });

  it('replaces the entire footer when the desktop slot layout is replaced', () => {
    function CustomFooterLayout() {
      return <div>Custom Layout Replacement</div>;
    }

    setSiteConfig({
      ...baseSiteConfig,
      apps: [
        footerApp,
        {
          appId: 'test-app',
          slots: [
            {
              slotId: 'org.openedx.frontend.slot.footer.desktop.v1',
              op: LayoutOperationTypes.REPLACE,
              component: CustomFooterLayout,
            },
          ],
        },
      ],
    });

    const { container } = renderFooter();

    expect(screen.getByText('Custom Layout Replacement')).toBeInTheDocument();
    expect(container.querySelector('footer')).not.toBeInTheDocument();
    expect(screen.queryByRole('img', { name: /powered by/i })).not.toBeInTheDocument();
  });
});
