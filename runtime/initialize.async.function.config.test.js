import { initialize } from './initialize';

import {
  ensureAuthenticatedUser,
  fetchAuthenticatedUser,
  hydrateAuthenticatedUser,
} from './auth';
import { getConfig } from './config';
import {
  logError,
} from './logging';

jest.mock('./logging');
jest.mock('./auth');
jest.mock('./analytics');
jest.mock('./i18n');
jest.mock('./auth/LocalForageCache');
jest.mock('env.config.js', () => async () => new Promise((resolve) => {
  resolve({
    JS_FILE_VAR: 'JS_FILE_VAR_VALUE_ASYNC_FUNCTION',
  });
}));

let config = null;

describe('initialize with async function js file config', () => {
  beforeEach(() => {
    jest.resetModules();
    config = getConfig();
    fetchAuthenticatedUser.mockReset();
    ensureAuthenticatedUser.mockReset();
    hydrateAuthenticatedUser.mockReset();
    logError.mockReset();
    global.PubSub.clearAllSubscriptions();
  });

  it('should initialize the app with async function javascript file configuration', async () => {
    const messages = { i_am: 'a message' };
    await initialize({ messages });

    expect(config.JS_FILE_VAR).toEqual('JS_FILE_VAR_VALUE_ASYNC_FUNCTION');
  });
});