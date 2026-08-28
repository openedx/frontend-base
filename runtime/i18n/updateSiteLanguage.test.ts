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
  const mockAuthHttpClient = { patch: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthHttpClient.patch.mockReset();
    mockGetAuthenticatedHttpClient.mockReturnValue(mockAuthHttpClient as any);
    mockGetSiteConfig.mockReturnValue({
      lmsBaseUrl: 'http://localhost:18000',
    } as any);
  });

  it('should update the UI before persisting for anonymous users', async () => {
    mockGetAuthenticatedUser.mockReturnValue(null);
    mockAuthHttpClient.patch.mockResolvedValue({});

    await updateSiteLanguage('es-419');

    expect(mockUpdateLocale).toHaveBeenCalledWith('es-419');
    expect(mockUpdateLocale.mock.invocationCallOrder[0])
      .toBeLessThan((mockAuthHttpClient.patch as jest.Mock).mock.invocationCallOrder[0]);
    expect(mockAuthHttpClient.patch).toHaveBeenCalledWith(
      'http://localhost:18000/lang_pref/update_language',
      { 'pref-lang': 'es-419' },
      { isPublic: true },
    );
  });

  it('should patch user preferences for authenticated users after updating the UI', async () => {
    mockGetAuthenticatedUser.mockReturnValue({ username: 'testuser' } as any);
    mockAuthHttpClient.patch.mockResolvedValue({});

    await updateSiteLanguage('ar');

    expect(mockUpdateLocale).toHaveBeenCalledWith('ar');
    expect(mockUpdateLocale.mock.invocationCallOrder[0])
      .toBeLessThan((mockAuthHttpClient.patch as jest.Mock).mock.invocationCallOrder[0]);
    expect(mockAuthHttpClient.patch).toHaveBeenCalledWith(
      'http://localhost:18000/api/user/v1/preferences/testuser',
      { 'pref-lang': 'ar' },
      { headers: { 'Content-Type': 'application/merge-patch+json' } },
    );
  });

  it('should still set the session language if the user preference patch fails', async () => {
    mockGetAuthenticatedUser.mockReturnValue({ username: 'testuser' } as any);
    mockAuthHttpClient.patch.mockImplementation((url: string) => (
      url.includes('/api/user/v1/preferences/')
        ? Promise.reject(new Error('Network error'))
        : Promise.resolve({})
    ));

    await expect(updateSiteLanguage('es-419')).rejects.toThrow(AggregateError);
    expect(mockUpdateLocale).toHaveBeenCalledWith('es-419');
    expect(mockAuthHttpClient.patch).toHaveBeenCalledWith(
      'http://localhost:18000/lang_pref/update_language',
      { 'pref-lang': 'es-419' },
      { isPublic: true },
    );
  });

  it('should still patch user preferences if the update_language call fails', async () => {
    mockGetAuthenticatedUser.mockReturnValue({ username: 'testuser' } as any);
    mockAuthHttpClient.patch.mockImplementation((url: string) => (
      url.includes('/lang_pref/update_language')
        ? Promise.reject(new Error('update_language failed'))
        : Promise.resolve({})
    ));

    await expect(updateSiteLanguage('es-419')).rejects.toThrow(AggregateError);
    expect(mockUpdateLocale).toHaveBeenCalledWith('es-419');
    expect(mockAuthHttpClient.patch).toHaveBeenCalledWith(
      'http://localhost:18000/api/user/v1/preferences/testuser',
      { 'pref-lang': 'es-419' },
      { headers: { 'Content-Type': 'application/merge-patch+json' } },
    );
  });

  it('should aggregate the failures when both requests fail', async () => {
    mockGetAuthenticatedUser.mockReturnValue({ username: 'testuser' } as any);
    mockAuthHttpClient.patch.mockRejectedValue(new Error('Network error'));

    await expect(updateSiteLanguage('es-419')).rejects.toMatchObject({
      errors: [new Error('Network error'), new Error('Network error')],
    });
    expect(mockUpdateLocale).toHaveBeenCalledWith('es-419');
  });
});
