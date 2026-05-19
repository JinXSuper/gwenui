import fs from 'fs';
import path from 'path';
import { readConfig } from './config.js';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export function detectPackageManager(projectRoot: string): PackageManager {
  // 1. Check config override first
  const config = readConfig();
  if (config && config.packageManager) {
    return config.packageManager;
  }

  // 2. Check lockfiles
  if (fs.existsSync(path.join(projectRoot, 'bun.lockb'))) {
    return 'bun';
  }
  if (fs.existsSync(path.join(projectRoot, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  if (fs.existsSync(path.join(projectRoot, 'yarn.lock'))) {
    return 'yarn';
  }

  return 'npm';
}
