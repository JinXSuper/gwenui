import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getCliVersion(): string {
  try {
    let currentDir = __dirname;
    while (currentDir !== path.parse(currentDir).root) {
      const pkgPath = path.join(currentDir, 'package.json');
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        if (pkg.name === '@gwenui/cli') {
          return pkg.version || '0.0.1';
        }
      }
      currentDir = path.dirname(currentDir);
    }
  } catch (e) {
    // fallback
  }
  return '0.0.1';
}
