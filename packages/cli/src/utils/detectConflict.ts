import { execaSync } from 'execa';

export function detectGwenuiConflict(): { 
  exists: boolean; 
  version?: string 
} {
  try {
    const result = execaSync('gwenui', ['--version']);
    return { exists: true, version: result.stdout.trim() };
  } catch {
    return { exists: false };
  }
}
