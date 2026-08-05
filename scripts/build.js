import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('📦 [ShopEZ Build] Starting production build...');

// 1. Run client build
execSync('npm run build --prefix client', { cwd: rootDir, stdio: 'inherit' });

const clientDist = path.join(rootDir, 'client', 'dist');
const clientBuild = path.join(rootDir, 'client', 'build');
const rootDist = path.join(rootDir, 'dist');
const rootBuild = path.join(rootDir, 'build');

// Helper to copy folder recursively
const copyFolder = (src, dest) => {
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true, force: true });
    console.log(`✅ [ShopEZ Build] Synced publish directory: ${dest}`);
  }
};

// 2. Sync build output to all common deployment directory names (dist, build, client/build)
copyFolder(clientDist, clientBuild);
copyFolder(clientDist, rootDist);
copyFolder(clientDist, rootBuild);

console.log('✨ [ShopEZ Build] Build complete! Publish directories (dist, build, client/build, client/dist) are ready.');
