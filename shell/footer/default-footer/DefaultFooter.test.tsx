import { fireEvent, render, screen } from '@testing-library/react';
import { useMemo } from 'react';
import renderer from 'react-test-renderer';

// @ts-expect-error 'site.config' is set up via webpack alias, so we know it works, but TypeScript
// can't figure out what it means.
import siteConfig from 'site.config';
import {
  AppContext,
  IntlProvider
} from '../../../runtime';

import Footer from './DefaultFooter';

const FooterWithContext = ({ locale = 'en' }: { locale: string }) => {
  const contextValue = useMemo(() => ({
    authenticatedUser: null,
    config: {
      ...siteConfig,
      LOGO_TRADEMARK_URL: siteConfig.LOGO_TRADEMARK_URL,
      LMS_BASE_URL: siteConfig.LMS_BASE_URL,
    },
    locale: 'en',
  }), []);

  return (
    <IntlProvider locale={locale}>
      <AppContext.Provider
        value={contextValue}
      >
        <Footer />
      </AppContext.Provider>
    </IntlProvider>
  );
};

const FooterWithLanguageSelector = ({
  languageSelected = () => {}
}: { languageSelected?: (languageCode: string) => void }) => {
  const contextValue = useMemo(() => ({
    authenticatedUser: null,
    config: {
      ...siteConfig,
      LOGO_TRADEMARK_URL: siteConfig.LOGO_TRADEMARK_URL,
      LMS_BASE_URL: siteConfig.LMS_BASE_URL,
    },
    locale: 'en',
  }), []);

  return (
    <IntlProvider locale="en">
      <AppContext.Provider
        value={contextValue}
      >
        <Footer
          onLanguageSelected={languageSelected}
          supportedLanguages={[
            { label: 'English', value: 'en' },
            { label: 'Español', value: 'es' },
          ]}
        />
      </AppContext.Provider>
    </IntlProvider>
  );
};

describe('<Footer />', () => {
  describe('renders correctly', () => {
    it('renders without a language selector', () => {
      const tree = renderer
        .create(<FooterWithContext locale="en" />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('renders with a language selector', () => {
      const tree = renderer
        .create(<FooterWithLanguageSelector />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('handles language switching', () => {
    it('calls onLanguageSelected prop when a language is changed', () => {
      const mockHandleLanguageSelected = jest.fn();
      render(<FooterWithLanguageSelector languageSelected={mockHandleLanguageSelected} />);

      fireEvent.submit(screen.getByTestId('site-footer-submit-btn'), {
        target: {
          elements: {
            'site-footer-language-select': {
              value: 'es',
            },
          },
        },
      });

      expect(mockHandleLanguageSelected).toHaveBeenCalledWith('es');
    });
  });
});
