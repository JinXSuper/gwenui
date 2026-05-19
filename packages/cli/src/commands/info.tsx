import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import SpinnerImport from 'ink-spinner';
import SelectInputImport from 'ink-select-input';
import fs from 'fs';
import path from 'path';
import { theme } from '../theme.js';
import { readConfig } from '../utils/config.js';
import { detectPackageManager } from '../utils/detectPackageManager.js';
import { getCliVersion } from '../utils/version.js';
import { REGISTRY_URLS } from '../utils/registryUrl.js';

const Spinner = (SpinnerImport as any).default || SpinnerImport;
const SelectInput = (SelectInputImport as any).default || SelectInputImport;

interface InfoFlowProps {
  onComplete: () => void;
}

export const InfoFlow: React.FC<InfoFlowProps> = ({ onComplete }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [framework, setFramework] = useState<string>('Unknown');
  const [hasTs, setHasTs] = useState<boolean>(false);
  const [tailwindVer, setTailwindVer] = useState<string>('none');
  const [pm, setPm] = useState<string>('npm');
  const [configInfo, setConfigInfo] = useState<any>(null);
  
  const [primaryReachable, setPrimaryReachable] = useState<boolean>(false);
  const [fallbackReachable, setFallbackReachable] = useState<boolean>(false);

  useEffect(() => {
    async function collectInfo() {
      // 1. Detect framework & dependencies
      const pkgPath = path.join(process.cwd(), 'package.json');
      let deps: Record<string, string> = {};
      let devDeps: Record<string, string> = {};

      if (fs.existsSync(pkgPath)) {
        try {
          const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
          deps = pkg.dependencies || {};
          devDeps = pkg.devDependencies || {};
        } catch (e) {}
      }

      // Next.js version detection
      let nextVer = deps['next'];
      if (nextVer) {
        const isApp = fs.existsSync(path.join(process.cwd(), 'src', 'app')) || fs.existsSync(path.join(process.cwd(), 'app'));
        setFramework(`Next.js ${nextVer} (${isApp ? 'App Router' : 'Pages Router'})`);
      } else {
        setFramework('Unknown / Custom React');
      }

      // TypeScript detection
      setHasTs(fs.existsSync(path.join(process.cwd(), 'tsconfig.json')));

      // Tailwind detection
      const tw = deps['tailwindcss'] || devDeps['tailwindcss'];
      setTailwindVer(tw ? tw : 'none');

      // Package manager detection
      setPm(detectPackageManager(process.cwd()));

      // 2. Read config
      const config = readConfig();
      setConfigInfo(config);

      // 3. Ping registry URLs
      async function pingUrl(url: string): Promise<boolean> {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 2000);
        try {
          const res = await fetch(url, { signal: controller.signal });
          clearTimeout(id);
          return res.ok;
        } catch (e) {
          clearTimeout(id);
          return false;
        }
      }

      const pReachable = await pingUrl(REGISTRY_URLS.primary);
      const fReachable = await pingUrl(REGISTRY_URLS.fallback);

      setPrimaryReachable(pReachable);
      setFallbackReachable(fReachable);

      setLoading(false);
    }

    collectInfo();
  }, []);

  if (loading) {
    return (
      <Box flexDirection="row" paddingY={1}>
        <Text color={theme.primary}>
          <Spinner type="dots" />
        </Text>
        <Text> Collecting project configuration details...</Text>
      </Box>
    );
  }

  const installedBlocks = configInfo?.installedBlocks || [];

  return (
    <Box flexDirection="column" paddingY={1}>
      {/* Header Box */}
      <Box borderStyle="round" borderColor={theme.primary} paddingX={2} paddingY={0} width={50}>
        <Text color={theme.primary}>⚙  GwenUI Project Info</Text>
      </Box>

      {/* Project Section */}
      <Box flexDirection="column" marginTop={1}>
        <Text color={theme.primary} bold>Project</Text>
        <Text color={theme.muted}>───────</Text>
        <Box flexDirection="row">
          <Box width={18}>
            <Text>Framework</Text>
          </Box>
          <Text color={theme.muted}>{framework}</Text>
        </Box>
        <Box flexDirection="row">
          <Box width={18}>
            <Text>TypeScript</Text>
          </Box>
          {hasTs ? (
            <Text color={theme.success}>✓</Text>
          ) : (
            <Text color={theme.muted}>✗</Text>
          )}
        </Box>
        <Box flexDirection="row">
          <Box width={18}>
            <Text>Tailwind</Text>
          </Box>
          <Text color={theme.muted}>{tailwindVer}</Text>
        </Box>
        <Box flexDirection="row">
          <Box width={18}>
            <Text>Package Manager</Text>
          </Box>
          <Text color={theme.muted}>{pm}</Text>
        </Box>
      </Box>

      {/* Configuration Section */}
      <Box flexDirection="column" marginTop={1}>
        <Text color={theme.primary} bold>GwenUI Config (~/.gwen/config.json)</Text>
        <Text color={theme.muted}>────────────────────────────────────</Text>
        {configInfo ? (
          <Box flexDirection="column">
            <Box flexDirection="row">
              <Box width={18}>
                <Text>CLI Version</Text>
              </Box>
              <Text color={theme.muted}>{getCliVersion()}</Text>
            </Box>
            <Box flexDirection="row">
              <Box width={18}>
                <Text>Blocks Dir</Text>
              </Box>
              <Text color={theme.muted}>{configInfo.blocksDir}</Text>
            </Box>
            <Box flexDirection="row">
              <Box width={18}>
                <Text>Styles Dir</Text>
              </Box>
              <Text color={theme.muted}>{configInfo.stylesDir}</Text>
            </Box>
            <Box flexDirection="row">
              <Box width={18}>
                <Text>Supreme</Text>
              </Box>
              {configInfo.supreme ? (
                <Text color={theme.success}>✓ installed</Text>
              ) : (
                <Text color={theme.muted}>✗ skipped</Text>
              )}
            </Box>
            <Box flexDirection="row">
              <Box width={18}>
                <Text>Initialized</Text>
              </Box>
              <Text color={theme.muted}>
                {configInfo.initializedAt ? configInfo.initializedAt.split('T')[0] : 'Unknown'}
              </Text>
            </Box>
          </Box>
        ) : (
          <Text color={theme.error}>No config file found. Run "gwenui init" first.</Text>
        )}
      </Box>

      {/* Installed Blocks Section */}
      <Box flexDirection="column" marginTop={1}>
        <Text color={theme.primary} bold>Installed Blocks ({installedBlocks.length})</Text>
        <Text color={theme.muted}>─────────────────────</Text>
        {installedBlocks.length > 0 ? (
          installedBlocks.map((block: any) => {
            const idStr = block.id.padEnd(16);
            const verStr = block.version.padEnd(8);
            const tierStr = (block.tier === 'supreme' ? 'Supreme' : 'Basic').padEnd(8);
            const licenseStr = block.license;

            return (
              <Box key={block.id} flexDirection="row">
                <Text color={theme.primary}>{idStr}</Text>
                <Text color={theme.muted}>{verStr}</Text>
                <Text color={block.tier === 'supreme' ? theme.primary : theme.muted}>{tierStr}</Text>
                <Text color={theme.muted}>{licenseStr}</Text>
              </Box>
            );
          })
        ) : (
          <Text color={theme.muted}>No blocks currently installed. Run "gwenui add" to get started.</Text>
        )}
      </Box>

      {/* Registry Section */}
      <Box flexDirection="column" marginTop={1}>
        <Text color={theme.primary} bold>Registry</Text>
        <Text color={theme.muted}>────────</Text>
        <Box flexDirection="row">
          <Box width={18}>
            <Text>Primary</Text>
          </Box>
          <Text color={theme.muted}>gwenui.com </Text>
          {primaryReachable ? (
            <Text color={theme.success}>✓ reachable</Text>
          ) : (
            <Text color={theme.error}>✗ unreachable</Text>
          )}
        </Box>
        <Box flexDirection="row">
          <Box width={18}>
            <Text>Fallback</Text>
          </Box>
          <Text color={theme.muted}>github </Text>
          {fallbackReachable ? (
            <Text color={theme.success}>✓ reachable</Text>
          ) : (
            <Text color={theme.error}>✗ unreachable</Text>
          )}
        </Box>
      </Box>

      <Box marginTop={1} flexDirection="column">
        <Text color={theme.muted}>Docs: https://gwenui.com/docs</Text>
        <Box marginTop={1}>
          <SelectInput
            items={[{ label: 'Return to Menu', value: 'menu' }]}
            onSelect={onComplete}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default InfoFlow;
