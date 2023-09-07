import { defineConfig, mergeConfig } from 'vite';

import base from './base.vite.config';

export default mergeConfig(base, defineConfig({}));
