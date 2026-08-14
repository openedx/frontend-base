import { updateSiteLanguage } from './updateSiteLanguage';
import { getAuthenticatedUser, getAuthenticatedHttpClient } from '../auth';
import { getSiteConfig } from '../config';
import { updateLocale } from './lib';

jest.mock('../auth');
jest.mock('../config');
jest.mock('./lib');

const mockGetAuthenticatedUser = getAuthenticatedUser as jest.MockedFunction<typeof getAuthenticatedUser>;
const mockGetAuthenticatedHttpClient = getAuthenticatedHttpClient as jest.MockedFunction<typeof getAuthenticatedHttpClient>;
const mockGetSiteConfig = getSiteConfig as jest.MockedFunction<typeof getSiteConfig>;
const mockUpdateLocale = updateLocale as jest.MockedFunction<typeof updateLocale>;

describe('updateSiteLanguage', () => {
  const mockAuthHttpClient = { patch: jest.fn(), post: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAuthenticatedHttpClient.mockReturnValue(mockAuthHttpClient as any);
    mockGetSiteConfig.mockReturnValue({
      lmsBaseUrl: 'http://localhost:18000',
    } as any);
  });

  it('should post to setlang and update locale for anonymous users', async () => {
    mockGetAuthenticatedUser.mockReturnValue(null);
    mockAuthHttpClient.patch.mockResolvedValue({});

    await updateSiteLanguage('es-419');

    expect(mockAuthHttpClient.patch).toHaveBeenCalledWith(
      'http://localhost:18000/lang_pref/update_language',
      { 'pref-lang': 'es-419' },
      { isPublic: true },
    );
    expect(mockUpdateLocale).toHaveBeenCalled();
  });

  it('should patch user preferences for authenticated users', async () => {
    mockGetAuthenticatedUser.mockReturnValue({ username: 'testuser' } as any);
    mockAuthHttpClient.patch.mockResolvedValue({});

    await updateSiteLanguage('ar');

    expect(mockAuthHttpClient.patch).toHaveBeenCalledWith(
      'http://localhost:18000/api/user/v1/preferences/testuser',
      { 'pref-lang': 'ar' },
      { headers: { 'Content-Type': 'application/merge-patch+json' } },
    );
    expect(mockUpdateLocale).toHaveBeenCalled();
  });

  it('should propagate errors from patchUserPreferences', async () => {
    mockGetAuthenticatedUser.mockReturnValue({ username: 'testuser' } as any);
    mockAuthHttpClient.patch.mockRejectedValueOnce(new Error('Network error'));

    await expect(updateSiteLanguage('es-419')).rejects.toThrow('Network error');
    expect(mockUpdateLocale).not.toHaveBeenCalled();
  });

  it('should propagate errors from postSetlang', async () => {
    mockGetAuthenticatedUser.mockReturnValue(null);
    mockAuthHttpClient.patch.mockRejectedValue(new Error('Setlang failed'));

    await expect(updateSiteLanguage('es-419')).rejects.toThrow('Setlang failed');
    expect(mockUpdateLocale).not.toHaveBeenCalled();
  });
});
