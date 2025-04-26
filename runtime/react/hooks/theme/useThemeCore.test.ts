import { act, renderHook, fireEvent } from '@testing-library/react';

import { logError } from '../../../logging';

import useThemeCore from './useThemeCore';

jest.mock('../../../logging');

describe('useThemeCore', () => {
  const onComplete = jest.fn();
  let testParams: any;

  beforeEach(() => {
    document.head.innerHTML = '';
    testParams = {
      themeCore: {
        url: 'https://cdn.jsdelivr.net/npm/@openedx/brand@1.0.0/dist/core.min.css',
      },
      onComplete,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should load the core url and change the loading state to true', () => {
    renderHook(() => useThemeCore(testParams));

    const createdLinkTag: HTMLAnchorElement | null = document.head.querySelector('link[data-theme-core="true"]');
    act(() => {
      if (createdLinkTag) {
        fireEvent.load(createdLinkTag);
      }
    });
    expect(createdLinkTag?.href).toBe(testParams.themeCore.url);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('should dispatch a log error if the theme link cannot be loaded', () => {
    renderHook(() => useThemeCore(testParams));

    const createdLinkTag: HTMLAnchorElement | null = document.head.querySelector('link[data-theme-core="true"]');
    act(() => {
      if (createdLinkTag) {
        fireEvent.error(createdLinkTag);
      }
    });
    expect(logError).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('should not create a link if there is no configured theme core URL', () => {
    testParams = {
      themeCore: {
        foo: 'bar',
      },
      onComplete,
    };

    renderHook(() => useThemeCore(testParams));
    expect(document.head.querySelectorAll('link').length).toBe(0);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
