import path from 'node:path';
import { fileURLToPath } from 'node:url';

import rootPackage from '../../package.json' with { type: 'json' };

import type { NextConfig } from 'next';

const clientRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: rootPackage.version,
  },

  // Статический экспорт: Tauri грузит готовые файлы из out/,
  // без Node-сервера внутри приложения.
  output: 'export',

  reactCompiler: true,
  reactStrictMode: true,

  images: {
    unoptimized: true,
  },

  sassOptions: {
    // Позволяет писать `@use '@/shared/styles/mixins' as *` вместо ../../../
    loadPaths: [clientRoot],
  },

  turbopack: {
    resolveAlias: {
      '@': clientRoot,
    },
  },
};

export default nextConfig;
