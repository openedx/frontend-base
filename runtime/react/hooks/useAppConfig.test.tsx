import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';

import { addAppConfigs, mergeSiteConfig } from '../../config';
import CurrentAppProvider from '../CurrentAppProvider';
import useAppConfig from './useAppConfig';

describe('useAppConfig', () => {
  it('returns an empty object for an app with no config', () => {
    mergeSiteConfig({ apps: [{ appId: 'bare-app' }] });
    addAppConfigs();

    const wrapper = ({ children }: { children: ReactNode }) => (
      <CurrentAppProvider appId="bare-app">{children}</CurrentAppProvider>
    );
    const { result } = renderHook(() => useAppConfig(), { wrapper });
    expect(result.current).toEqual({});
  });
});
