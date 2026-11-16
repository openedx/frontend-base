import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { WidgetOperationTypes } from '../runtime';
import { getSiteConfig, setSiteConfig } from '../runtime/config';
import { IntlProvider } from '../runtime/i18n';
import { initializeMockApp } from '../runtime/testing';
import { App } from '../types';
import shellApp from './app';
import DefaultLayout from './DefaultLayout';

const barsApp: App = {
  appId: 'test-bars',
  slots: [
    {
      slotId: 'org.openedx.frontend.slot.header.masqueradeBar.v1',
      id: 'test-bars.masqueradeBar',
      op: WidgetOperationTypes.APPEND,
      element: <div>Masquerade Bar</div>,
    },
    {
      slotId: 'org.openedx.frontend.slot.header.courseNavigationBar.v1',
      id: 'test-bars.courseNavigationBar',
      op: WidgetOperationTypes.APPEND,
      element: <div>Course Navigation Bar</div>,
    },
  ],
};

function renderLayout() {
  return render(
    <IntlProvider locale="en">
      <MemoryRouter>
        <DefaultLayout />
      </MemoryRouter>
    </IntlProvider>
  );
}

describe('DefaultLayout', () => {
  let baseSiteConfig: ReturnType<typeof getSiteConfig>;

  beforeAll(() => {
    initializeMockApp();
    baseSiteConfig = getSiteConfig();
  });

  afterEach(() => {
    setSiteConfig({ ...baseSiteConfig, apps: [] });
  });

  it('renders the masquerade and course navigation bars between the header and the content', () => {
    setSiteConfig({ ...baseSiteConfig, apps: [shellApp, barsApp] });

    const { container } = renderLayout();

    const header = container.querySelector('header');
    const masqueradeBar = screen.getByText('Masquerade Bar');
    const courseNavigationBar = screen.getByText('Course Navigation Bar');
    const content = container.querySelector('#main-content');

    expect(header).toBeInTheDocument();
    expect(header).not.toContainElement(masqueradeBar);
    expect(header).not.toContainElement(courseNavigationBar);
    expect(header!.compareDocumentPosition(masqueradeBar)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(masqueradeBar.compareDocumentPosition(courseNavigationBar)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(courseNavigationBar.compareDocumentPosition(content!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('keeps both bars when the header main widget is replaced', () => {
    setSiteConfig({
      ...baseSiteConfig,
      apps: [
        shellApp,
        barsApp,
        {
          appId: 'test-app',
          slots: [
            {
              slotId: 'org.openedx.frontend.slot.header.main.v1',
              id: 'test-app.customHeader',
              relatedId: 'org.openedx.frontend.widget.header.main.v1',
              op: WidgetOperationTypes.REPLACE,
              element: <div>Custom Header Replacement</div>,
            },
          ],
        },
      ],
    });

    const { container } = renderLayout();

    expect(screen.getByText('Custom Header Replacement')).toBeInTheDocument();
    expect(container.querySelector('header')).not.toBeInTheDocument();
    expect(screen.getByText('Masquerade Bar')).toBeInTheDocument();
    expect(screen.getByText('Course Navigation Bar')).toBeInTheDocument();
  });
});
