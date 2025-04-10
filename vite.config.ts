
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create package.json scripts for development and production builds
const fs = require('fs');
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

if (!packageJson.scripts) {
  packageJson.scripts = {};
}

// Add the missing dev script if it doesn't exist
if (!packageJson.scripts.dev) {
  packageJson.scripts.dev = 'vite';
}

// Ensure the start script exists
if (!packageJson.scripts.start) {
  packageJson.scripts.start = 'vite';
}

// Ensure the build script exists
if (!packageJson.scripts.build) {
  packageJson.scripts.build = 'vite build';
}

// Write the updated package.json back to the file
fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));

export default defineConfig({
  plugins: [
    react({
      babel: {
        babelrc: false,
        configFile: false,
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8080,
    open: true,
    host: true
  },
  build: {
    target: 'esnext',
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
  },
});
