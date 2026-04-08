import { prepare, pull } from '../utils/translations';
import { runPrepare, runPull } from './translations';

jest.mock('../utils/translations');

describe('runPrepare', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls prepare with siteRoot set to cwd', () => {
    runPrepare();

    expect(jest.mocked(prepare)).toHaveBeenCalledWith({ siteRoot: process.cwd() });
  });
});

describe('runPull', () => {
  const originalArgv = process.argv;

  beforeEach(() => {
    jest.clearAllMocks();
    process.argv = ['node', 'openedx'];
  });

  afterEach(() => {
    process.argv = originalArgv;
  });

  it('calls pull with siteRoot set to cwd', () => {
    runPull();

    expect(jest.mocked(pull)).toHaveBeenCalledWith(expect.objectContaining({
      siteRoot: process.cwd(),
    }));
  });

  it('passes shouldPrepare: true by default', () => {
    runPull();

    expect(jest.mocked(pull)).toHaveBeenCalledWith(expect.objectContaining({
      shouldPrepare: true,
    }));
  });

  it('passes shouldPrepare: false when --no-prepare is in argv', () => {
    process.argv = ['node', 'openedx', '--no-prepare'];

    runPull();

    expect(jest.mocked(pull)).toHaveBeenCalledWith(expect.objectContaining({
      shouldPrepare: false,
    }));
  });

  it('passes atlasOptions when --atlas-options= is in argv', () => {
    process.argv = ['node', 'openedx', '--atlas-options=--revision=main'];

    runPull();

    expect(jest.mocked(pull)).toHaveBeenCalledWith(expect.objectContaining({
      atlasOptions: '--revision=main',
    }));
  });

  it('passes atlasOptions as undefined when not in argv', () => {
    runPull();

    expect(jest.mocked(pull)).toHaveBeenCalledWith(expect.objectContaining({
      atlasOptions: undefined,
    }));
  });
});
