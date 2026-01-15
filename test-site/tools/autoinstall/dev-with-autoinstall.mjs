#!/usr/bin/env node

import net from 'net';
import { spawn } from 'child_process';
import { createInstaller } from './autoinstall-frontend-base-tarballs.mjs';
import { APP_ROOT, HOST, PORT } from './env.mjs';

const portInUse = () => {
  return new Promise((resolve) => {
    const portProbe = net.createServer();
    portProbe.once('error', () => resolve(true));
    portProbe.once('listening', () => portProbe.close(() => resolve(false)));
    portProbe.listen(PORT, HOST);
  });
};

const waitForPortFree = async (timeoutMs = 8000) => {
  const start = Date.now();
  while (await portInUse()) {
    if ((Date.now() - start) > timeoutMs) {
      throw new Error(`Port ${PORT} still in use after ${timeoutMs}ms`);
    }

    await new Promise((r) => setTimeout(r, 150));
  }
};

let devServerProcess = null;

const startDev = () => {
  console.log('\n[dev] start: npm run dev\n');
  devServerProcess = spawn('npm', ['run', 'dev'], {
    cwd: APP_ROOT,
    stdio: 'inherit',
    shell: false,
    detached: true,
    env: process.env,
  });
  devServerProcess?.once('error', (e) => console.error('[dev] spawn failed:', e));
  devServerProcess?.unref();
};

const WAIT_BETWEEN_TERM_AND_KILL_MS = 1200;
const stopDev = async () => {
  if (!devServerProcess) {
    return;
  }

  console.log('\n[dev] stop\n');

  try {
    process.kill(-devServerProcess.pid, 'SIGTERM');
  } catch (e) {
    if (e.code !== 'ESRCH') {
      throw e;
    }
  }

  await new Promise((r) => setTimeout(r, WAIT_BETWEEN_TERM_AND_KILL_MS));

  if (await portInUse()) {
    try {
      process.kill(-devServerProcess.pid, 'SIGKILL');
    } catch (e) {
      if (e.code !== 'ESRCH') {
        throw e;
      }
    }
  }

  await waitForPortFree();
  devServerProcess = null;
};

let shuttingDown = false;

const installer = createInstaller({
  onInstall: async (trigger) => {
    if (shuttingDown) {
      return;
    }

    console.log(`\n[watch] restart (${trigger})`);
    await stopDev();
    if (!shuttingDown) {
      startDev();
    }
  },
});

const shutdown = async () => {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;

  console.log('\n[exit]');
  try {
    await installer.stop();
    await stopDev();
  } finally {
    process.exit(0);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

await installer.start();
startDev();
