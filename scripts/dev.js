import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('--------------------------------------------------');
console.log('🚀 [ShopEZ Startup] Launching Backend Server & Frontend Client...');
console.log('--------------------------------------------------');

const server = spawn('node', ['server/server.js'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true,
});

const client = spawn('npm', ['run', 'dev', '--prefix', 'client'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true,
});

const cleanup = () => {
  console.log('\n🛑 [ShopEZ Shutdown] Terminating processes...');
  server.kill();
  client.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
