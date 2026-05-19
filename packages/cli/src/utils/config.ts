import os from 'os';
import path from 'path';
import fs from 'fs';

export interface InstalledBlock {
  id: string;
  version: string;
  tier: 'basic' | 'supreme';
  license: string;
  installedAt: string;   // ISO date
}

export interface GwenConfig {
  version: string;
  blocksDir: string;       // e.g. "src/components/blocks"
  stylesDir: string;       // e.g. "src/app"
  packageManager: 'npm' | 'pnpm' | 'yarn' | 'bun';
  supreme: boolean;
  initializedAt: string;   // ISO date string
  installedBlocks: InstalledBlock[];
}

const CONFIG_DIR = path.join(os.homedir(), '.gwen');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
const LOCAL_CONFIG_FILE = path.join(process.cwd(), 'gwenui.json');

export function configExists(): boolean {
  return fs.existsSync(LOCAL_CONFIG_FILE) || fs.existsSync(CONFIG_FILE);
}

export function readConfig(): GwenConfig | null {
  try {
    if (fs.existsSync(LOCAL_CONFIG_FILE)) {
      const data = fs.readFileSync(LOCAL_CONFIG_FILE, 'utf-8');
      const parsed = JSON.parse(data) as GwenConfig;
      if (!parsed.installedBlocks) parsed.installedBlocks = [];
      return parsed;
    }
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
      const parsed = JSON.parse(data) as GwenConfig;
      if (!parsed.installedBlocks) parsed.installedBlocks = [];
      return parsed;
    }
    return null;
  } catch (err) {
    return null;
  }
}

export function writeConfig(config: GwenConfig): void {
  try {
    // 1. Write to global configuration
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');

    // 2. Write to local configuration in the current working directory
    fs.writeFileSync(LOCAL_CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');

    // 3. Create the directories locally in the project if they do not exist
    const localBlocksDir = path.resolve(process.cwd(), config.blocksDir);
    const localStylesDir = path.resolve(process.cwd(), config.stylesDir);

    if (!fs.existsSync(localBlocksDir)) {
      fs.mkdirSync(localBlocksDir, { recursive: true });
    }
    if (!fs.existsSync(localStylesDir)) {
      fs.mkdirSync(localStylesDir, { recursive: true });
    }
  } catch (err: any) {
    throw new Error(`Failed to write GwenUI configuration: ${err.message}`);
  }
}
export { CONFIG_FILE, LOCAL_CONFIG_FILE };
