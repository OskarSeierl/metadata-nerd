import { fileURLToPath } from 'node:url';
import path from 'node:path';

// ESM Workaround for __dirname
export const currentDir = path.dirname(fileURLToPath(import.meta.url));

// App Paths
export const APP_ROOT = path.join(currentDir, '..');
export const MAIN_DIST = path.join(APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(APP_ROOT, 'dist');

// Vite Env Variables
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(APP_ROOT, 'public')
  : RENDERER_DIST;
