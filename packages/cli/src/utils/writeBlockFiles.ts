import fs from 'fs';
import path from 'path';
import { BlockFile } from '../types/registry.js';
import { fetchFileContent } from './fetchFile.js';

export type ConflictResolution = 'overwrite' | 'skip' | 'cancel';

export interface WriteResult {
  written: string[];
  skipped: string[];
}

export async function writeBlockFiles(
  files: BlockFile[],
  blocksDir: string,
  onConflict: (filePath: string) => Promise<ConflictResolution>
): Promise<WriteResult> {
  const result: WriteResult = {
    written: [],
    skipped: [],
  };

  for (const file of files) {
    const targetPath = path.resolve(blocksDir, file.path);

    // 1. Fetch file content
    const content = await fetchFileContent(file.url);

    // 2. Conflict check
    if (fs.existsSync(targetPath)) {
      const resolution = await onConflict(file.path);
      if (resolution === 'cancel') {
        // Return immediately on cancel
        return result;
      }
      if (resolution === 'skip') {
        result.skipped.push(file.path);
        continue;
      }
    }

    // 3. Write file
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, content, 'utf-8');
    result.written.push(file.path);
  }

  return result;
}
