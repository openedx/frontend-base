import path from 'path';

export const APP_ROOT = process.cwd();
export const FRONTEND_BASE_DIR = path.resolve(APP_ROOT, '..');
export const PACK_DIR = path.resolve(FRONTEND_BASE_DIR, 'pack');
export const TGZ_FILENAME = 'openedx-frontend-base.tgz';
export const TGZ_PATH = path.join(PACK_DIR, TGZ_FILENAME);
export const HOST = '127.0.0.1';
export const PORT = 8080;
export const INSTALL_DEBOUNCE_MS = 350;
