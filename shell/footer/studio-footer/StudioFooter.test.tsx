import { fireEvent, render, screen } from '@testing-library/react';
import {
  AppProvider,
  initializeMockApp,
  mergeConfig
} from '../../../runtime';
import StudioFooter from './StudioFooter';
import messages from './messages';

describe('Footer', () => {
  beforeEach(() => {
    initializeMockApp({ messages: [], authenticatedUser: null });
  });

  describe('help section default view', () => {
    it('help button should read Looking for help with Studio?', () => {
      render(
        <AppProvider>
          <StudioFooter />
        </AppProvider>
      );
      expect(screen.getByText(messages.openHelpButtonLabel.defaultMessage))
        .toBeVisible();
    });
    it('help button link row should not be visible', () => {
      render(
        <AppProvider>
          <StudioFooter />
        </AppProvider>
      );
      expect(screen.queryByTestId('helpButtonRow')).toBeNull();
    });
  });
  describe('help section expanded view', () => {
    it('help button should read Hide Studio help', () => {
      render(
        <AppProvider>
          <StudioFooter />
        </AppProvider>
      );
      const helpToggleButton = screen.getByText(messages.openHelpButtonLabel.defaultMessage);
      fireEvent.click(helpToggleButton);
      expect(screen.getByText(messages.closeHelpButtonLabel.defaultMessage))
        .toBeVisible();
    });
    it('help button link row should be visible', () => {
      render(
        <AppProvider>
          <StudioFooter />
        </AppProvider>
      );
      const helpToggleButton = screen.getByText(messages.openHelpButtonLabel.defaultMessage);
      fireEvent.click(helpToggleButton);
      expect(screen.getByTestId('helpButtonRow')).toBeVisible();
    });
    it('Open edX portal button should be visible', () => {
      render(
        <AppProvider>
          <StudioFooter />
        </AppProvider>
      );
      const helpToggleButton = screen.getByText(messages.openHelpButtonLabel.defaultMessage);
      fireEvent.click(helpToggleButton);
      expect(screen.getByTestId('openEdXPortalButton')).toBeVisible();
    });
    it('should not show contact us button', () => {
      render(
        <AppProvider>
          <StudioFooter />
        </AppProvider>
      );
      const helpToggleButton = screen.getByText(messages.openHelpButtonLabel.defaultMessage);
      fireEvent.click(helpToggleButton);
      expect(screen.queryByTestId('contactUsButton')).toBeNull();
    });
    it('should show contact us button', () => {
      mergeConfig({
        SUPPORT_EMAIL: 'support@email.com',
      });
      render(
        <AppProvider>
          <StudioFooter />
        </AppProvider>
      );
      const helpToggleButton = screen.getByText(messages.openHelpButtonLabel.defaultMessage);
      fireEvent.click(helpToggleButton);
      expect(screen.getByTestId('contactUsButton')).toBeVisible();
    });
  });
  describe('policy link row', () => {
    it('should only show LMS link', () => {
      render(
        <AppProvider>
          <StudioFooter />
        </AppProvider>
      );
      expect(screen.getByText('LMS')).toBeVisible();
      expect(screen.queryByTestId('termsOfService')).toBeNull();
      expect(screen.queryByTestId('privacyPolicy')).toBeNull();
      expect(screen.queryByTestId('accessibilityRequest')).toBeNull();
    });
    it('should show terms of service link', () => {
      mergeConfig({
        TERMS_OF_SERVICE_URL: 'termsofserviceurl',
      });
      render(
        <AppProvider>
          <StudioFooter />
        </AppProvider>
      );
      expect(screen.getByText('LMS')).toBeVisible();
      expect(screen.queryByTestId('termsOfService')).toBeVisible();
      expect(screen.queryByTestId('privacyPolicy')).toBeNull();
      expect(screen.queryByTestId('accessibilityRequest')).toBeNull();
    });
    it('should show privacy policy link', () => {
      mergeConfig({
        PRIVACY_POLICY_URL: 'privacypolicyurl',
      });
      render(
        <AppProvider>
          <StudioFooter />
        </AppProvider>
      );
      expect(screen.getByText('LMS')).toBeVisible();
      expect(screen.queryByTestId('termsOfService')).toBeNull();
      expect(screen.queryByTestId('privacyPolicy')).toBeVisible();
      expect(screen.queryByTestId('accessibilityRequest')).toBeNull();
    });
    it('should show accessibilty request link', () => {
      mergeConfig({
        ACCESSIBILITY_URL: 'accessibilityurl',
      });
      render(
        <AppProvider>
          <StudioFooter />
        </AppProvider>
      );
      expect(screen.getByText('LMS')).toBeVisible();
      expect(screen.queryByTestId('termsOfService')).toBeNull();
      expect(screen.queryByTestId('privacyPolicy')).toBeNull();
      expect(screen.queryByTestId('accessibilityRequest')).toBeVisible();
    });
  });
});
