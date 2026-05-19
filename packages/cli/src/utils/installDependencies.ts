import fs from 'fs';
import path from 'path';
import { execa } from 'execa';
import { PackageManager } from './detectPackageManager.js';

export async function installDependencies(
  deps: string[],
  devDeps: string[],
  packageManager: PackageManager,
  projectRoot: string
): Promise<void> {
  if (deps.length === 0 && devDeps.length === 0) {
    return;
  }

  // 1. Read package.json to identify already installed dependencies
  const pkgPath = path.join(projectRoot, 'package.json');
  let installedDeps: Record<string, string> = {};
  let installedDevDeps: Record<string, string> = {};

  if (fs.existsSync(pkgPath)) {
    try {
      const pkgContent = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      installedDeps = pkgContent.dependencies || {};
      installedDevDeps = pkgContent.devDependencies || {};
    } catch (err: any) {
      throw new Error(`Failed to parse package.json: ${err.message}`);
    }
  }

  const allInstalled = { ...installedDeps, ...installedDevDeps };

  // Filter out dependencies that are already installed
  const missingDeps = deps.filter(dep => !allInstalled[dep]);
  const missingDevDeps = devDeps.filter(dep => !allInstalled[dep]);

  if (missingDeps.length === 0 && missingDevDeps.length === 0) {
    console.log('✓ All dependencies already installed, skipping.');
    return;
  }

  const runInstall = async (packages: string[], isDev: boolean) => {
    if (packages.length === 0) return;

    let cmd = packageManager as string;
    let args: string[] = [];

    if (packageManager === 'npm') {
      args.push('install');
      if (isDev) {
        args.push('-D');
      }
    } else {
      args.push('add');
      if (isDev) {
        args.push(packageManager === 'bun' ? '-d' : '-D');
      }
    }

    args.push(...packages);

    try {
      await execa(cmd, args, { cwd: projectRoot });
    } catch (err: any) {
      throw new Error(
        `Failed to install packages using ${packageManager}. Command "${cmd} ${args.join(' ')}" failed: ${err.message}. Please try installing manually: npm install ${packages.join(' ')}`
      );
    }
  };

  // Run installations
  await runInstall(missingDeps, false);
  await runInstall(missingDevDeps, true);
}
