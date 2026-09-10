import { spawn } from 'child_process';
import path from 'path';
import os from 'os';

// Ensure Cargo / Rust bin directory is in PATH for all developer environments
const cargoPath = path.join(os.homedir(), '.cargo', 'bin');
const env = {
  ...process.env,
  PATH: `${cargoPath}${path.delimiter}${process.env.PATH || ''}`,
  Path: `${cargoPath}${path.delimiter}${process.env.Path || ''}`
};

const isWin = process.platform === 'win32';
const cmd = isWin ? 'npx.cmd' : 'npx';
const args = ['tauri', process.argv[2] === 'build' ? 'build' : 'dev'];

const child = spawn(cmd, args, {
  stdio: 'inherit',
  env,
  shell: true
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
