export interface BlockFile {
  path: string;   // relative path e.g. "auth-login/index.tsx"
  url: string;    // direct download URL to raw file content
}

export interface BlockPayload {
  id: string;                          // e.g. "auth-login"
  name: string;                        // e.g. "Auth — Login"
  description: string;                 // short description
  tier: 'basic' | 'supreme';          // block tier
  version: string;                     // semver e.g. "1.0.0"
  license: 'ELv2' | 'BSL-1.1' | 'MIT+CommonsClause';
  files: BlockFile[];                  // source files to copy
  dependencies: string[];              // npm deps to install
  devDependencies: string[];           // npm devDeps to install
  requiresTailwind: boolean;
  requiresGwenTheme: boolean;
}

export interface Registry {
  version: string;                     // registry schema version
  updatedAt: string;                   // ISO date string
  blocks: BlockPayload[];
}
