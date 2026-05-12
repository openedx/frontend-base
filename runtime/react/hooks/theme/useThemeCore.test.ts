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

  it('should not append a duplicate link when a core link for the same URL already exists', () => {
    const existing = document.createElement('link');
    existing.href = testParams.themeCore.url;
    existing.rel = 'stylesheet';
    existing.dataset.themeCore = 'true';
    document.head.appendChild(existing);

    renderHook(() => useThemeCore(testParams));

    const coreLinks = document.head.querySelectorAll('link[data-theme-core="true"]');
    expect(coreLinks.length).toBe(1);
    expect(coreLinks[0]).toBe(existing);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('should replace an existing core link when the URL changes', () => {
    const existing = document.createElement('link');
    existing.href = 'https://example.com/old-core.min.css';
    existing.rel = 'stylesheet';
    existing.dataset.themeCore = 'true';
    document.head.appendChild(existing);

    renderHook(() => useThemeCore(testParams));

    const coreLinks = document.head.querySelectorAll('link[data-theme-core="true"]');
    expect(coreLinks.length).toBe(1);
    expect(coreLinks[0]).not.toBe(existing);
    expect((coreLinks[0] as HTMLLinkElement).href).toBe(testParams.themeCore.url);
  });
});
