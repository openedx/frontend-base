import { render } from '@testing-library/react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

import { getSiteConfig } from '../../runtime/config';
import { initializeMockApp } from '../../runtime/testing';
import RouteError from './RouteError';

jest.mock('react-router-dom', () => ({
  isRouteErrorResponse: jest.fn(),
  useRouteError: jest.fn(),
}));

describe('RouteError', () => {
  let siteName: string;

  beforeEach(() => {
    initializeMockApp();
    siteName = getSiteConfig().siteName;
  });

  it('titles the not found page', () => {
    (useRouteError as jest.Mock).mockReturnValue({ status: 404 });
    (isRouteErrorResponse as unknown as jest.Mock).mockReturnValue(true);

    render(<RouteError />);
    expect(document.title).toBe(`Page not found | ${siteName}`);
  });

  it('titles the error page', () => {
    (useRouteError as jest.Mock).mockReturnValue(new Error('boom'));
    (isRouteErrorResponse as unknown as jest.Mock).mockReturnValue(false);

    render(<RouteError />);
    expect(document.title).toBe(`Error | ${siteName}`);
  });
});
