import reactRefresh from 'eslint-plugin-react-hooks';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'eslint-plugin-react-hooks';
import js from 'eslint-plugin-react-hooks';
import { defineConfig, globalIgnores } from 'eslint/config'
import {globals} from 'eslint/conf/default-cli-options.js';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
