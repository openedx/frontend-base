import { getAuthenticatedHttpClient } from '../auth';
import { validatePermissions, PERMISSIONS_VALIDATE_PATH } from './api';

jest.mock('../auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));

const BASE_URL = 'http://lms.example.com';
const QUERY = {
  canRead: { action: 'example.read', scope: 'lib:org:test' },
  canWrite: { action: 'example.write', scope: 'lib:org:test' },
};

describe('validatePermissions', () => {
  beforeEach(() => jest.clearAllMocks());

  it('posts to the correct URL', async () => {
    const postMock = jest.fn().mockResolvedValue({ data: [] });
    (getAuthenticatedHttpClient as jest.Mock).mockReturnValue({ post: postMock });

    await validatePermissions(BASE_URL, QUERY);

    expect(postMock).toHaveBeenCalledWith(
      `${BASE_URL}${PERMISSIONS_VALIDATE_PATH}`,
      expect.any(Array),
    );
  });

  it('sends all query items as an array in the request body', async () => {
    const postMock = jest.fn().mockResolvedValue({ data: [] });
    (getAuthenticatedHttpClient as jest.Mock).mockReturnValue({ post: postMock });

    await validatePermissions(BASE_URL, QUERY);

    const body = postMock.mock.calls[0][1];
    expect(body).toHaveLength(2);
    expect(body).toEqual(expect.arrayContaining([
      { action: 'example.read', scope: 'lib:org:test' },
      { action: 'example.write', scope: 'lib:org:test' },
    ]));
  });

  it('maps response array back to caller keys', async () => {
    (getAuthenticatedHttpClient as jest.Mock).mockReturnValue({
      post: jest.fn().mockResolvedValue({
        data: [
          { action: 'example.read', scope: 'lib:org:test', allowed: true },
          { action: 'example.write', scope: 'lib:org:test', allowed: false },
        ],
      }),
    });

    const result = await validatePermissions(BASE_URL, QUERY);

    expect(result).toEqual({ canRead: true, canWrite: false });
  });

  it('defaults missing keys to false', async () => {
    (getAuthenticatedHttpClient as jest.Mock).mockReturnValue({
      post: jest.fn().mockResolvedValue({ data: [] }),
    });

    const result = await validatePermissions(BASE_URL, QUERY);

    expect(result).toEqual({ canRead: false, canWrite: false });
  });

  it('defaults a partially missing key to false', async () => {
    (getAuthenticatedHttpClient as jest.Mock).mockReturnValue({
      post: jest.fn().mockResolvedValue({
        data: [{ action: 'example.read', scope: 'lib:org:test', allowed: true }],
      }),
    });

    const result = await validatePermissions(BASE_URL, QUERY);

    expect(result.canRead).toBe(true);
    expect(result.canWrite).toBe(false);
  });
});
