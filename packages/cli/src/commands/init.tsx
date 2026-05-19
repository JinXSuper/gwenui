import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import TextInputImport from 'ink-text-input';
import SelectInputImport from 'ink-select-input';
import SpinnerImport from 'ink-spinner';
import { writeConfig, GwenConfig } from '../utils/config.js';
import { theme } from '../theme.js';
import { BASE_DEPS, SUPREME_DEPS, SUPREME_DEV_DEPS } from '../constants/deps.js';
import { installDependencies } from '../utils/installDependencies.js';

const TextInput = (TextInputImport as any).default || TextInputImport;
const SelectInput = (SelectInputImport as any).default || SelectInputImport;
const Spinner = (SpinnerImport as any).default || SpinnerImport;

interface InitFlowProps {
  onComplete?: () => void;
}

export const InitFlow: React.FC<InitFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);
  // 1 = blocksDir prompt
  // 2 = stylesDir prompt
  // 3 = packageManager select
  // 4 = supreme prompt
  // 5 = installing base dependencies
  // 6 = installing supreme dependencies
  // 7 = success screen
  // 8 = error screen

  const [blocksDir, setBlocksDir] = useState<string>('');
  const [stylesDir, setStylesDir] = useState<string>('');
  const [packageManager, setPackageManager] = useState<'npm' | 'pnpm' | 'yarn' | 'bun'>('npm');
  const [installSupreme, setInstallSupreme] = useState<boolean>(false);
  const [installStatus, setInstallStatus] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleBlocksSubmit = (val: string) => {
    setBlocksDir(val.trim() || 'src/components/blocks');
    setStep(2);
  };

  const handleStylesSubmit = (val: string) => {
    setStylesDir(val.trim() || 'src/app');
    setStep(3);
  };

  const handlePackageManagerSelect = (item: { value: string }) => {
    setPackageManager(item.value as 'npm' | 'pnpm' | 'yarn' | 'bun');
    setStep(4); // proceed to supreme prompt
  };

  const handleSupremeSelect = (item: { value: string }) => {
    const chosen = item.value === 'yes';
    setInstallSupreme(chosen);
    setStep(5); // proceed to install base deps
  };

  // Trigger Base Dependencies installation
  useEffect(() => {
    if (step !== 5) return;

    async function installBase() {
      try {
        setInstallStatus('Installing base dependencies...');
        await installDependencies(BASE_DEPS, [], packageManager, process.cwd());

        if (installSupreme) {
          setStep(6); // proceed to install supreme deps
        } else {
          // Complete and write config
          const config: GwenConfig = {
            version: '0.1.0',
            blocksDir: blocksDir || 'src/components/blocks',
            stylesDir: stylesDir || 'src/app',
            packageManager: packageManager,
            supreme: false,
            initializedAt: new Date().toISOString(),
            installedBlocks: [],
          };
          writeConfig(config);
          setStep(7);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to install base dependencies.');
        setStep(8);
      }
    }

    installBase();
  }, [step, packageManager, installSupreme, blocksDir, stylesDir]);

  // Trigger Supreme Dependencies installation
  useEffect(() => {
    if (step !== 6) return;

    async function installSupremeDeps() {
      try {
        setInstallStatus('Installing Supreme dependencies...');
        await installDependencies(SUPREME_DEPS, SUPREME_DEV_DEPS, packageManager, process.cwd());

        // Complete and write config
        const config: GwenConfig = {
          version: '0.1.0',
          blocksDir: blocksDir || 'src/components/blocks',
          stylesDir: stylesDir || 'src/app',
          packageManager: packageManager,
          supreme: true,
          initializedAt: new Date().toISOString(),
          installedBlocks: [],
        };
        writeConfig(config);
        setStep(7);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to install Supreme dependencies.');
        setStep(8);
      }
    }

    installSupremeDeps();
  }, [step, packageManager, installSupreme, blocksDir, stylesDir]);

  // Handle post-success autocompletion exit
  useEffect(() => {
    if (step === 7 && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [step, onComplete]);

  const pmItems = [
    { label: 'npm', value: 'npm' },
    { label: 'pnpm', value: 'pnpm' },
    { label: 'yarn', value: 'yarn' },
    { label: 'bun', value: 'bun' },
  ];

  const supremeItems = [
    { label: "Yes, I'll use Supreme blocks", value: 'yes' },
    { label: 'No, Basic blocks only', value: 'no' },
  ];

  return (
    <Box flexDirection="column" paddingY={1}>
      {/* Welcome Screen Box */}
      <Box flexDirection="column" borderStyle="round" borderColor={theme.primary} paddingX={2} paddingY={1} width={36} marginBottom={1}>
        <Text color={theme.primary}>🌟 GwenUI CLI — Init</Text>
        <Text color={theme.muted}>Setting up your project...</Text>
      </Box>

      {step === 1 && (
        <Box flexDirection="column">
          <Text>Where should blocks be installed? <Text color={theme.muted}>(src/components/blocks)</Text></Text>
          <Box flexDirection="row">
            <Text color={theme.primary}>❯ </Text>
            <TextInput
              value={blocksDir}
              onChange={setBlocksDir}
              onSubmit={handleBlocksSubmit}
            />
          </Box>
        </Box>
      )}

      {step === 2 && (
        <Box flexDirection="column">
          <Text color={theme.muted}>Blocks dir: {blocksDir}</Text>
          <Box marginTop={1}>
            <Text>Where is your styles directory? <Text color={theme.muted}>(src/app)</Text></Text>
          </Box>
          <Box flexDirection="row">
            <Text color={theme.primary}>❯ </Text>
            <TextInput
              value={stylesDir}
              onChange={setStylesDir}
              onSubmit={handleStylesSubmit}
            />
          </Box>
        </Box>
      )}

      {step === 3 && (
        <Box flexDirection="column">
          <Text color={theme.muted}>Blocks dir: {blocksDir}</Text>
          <Text color={theme.muted}>Styles dir: {stylesDir}</Text>
          <Box marginTop={1} marginBottom={1}>
            <Text>Package manager?</Text>
          </Box>
          <SelectInput
            items={pmItems}
            onSelect={handlePackageManagerSelect}
          />
        </Box>
      )}

      {step === 4 && (
        <Box flexDirection="column">
          <Text color={theme.muted}>Blocks dir: {blocksDir}</Text>
          <Text color={theme.muted}>Styles dir: {stylesDir}</Text>
          <Text color={theme.muted}>Package manager: {packageManager}</Text>
          
          <Box marginTop={1} marginBottom={0.5}>
            <Text>Install Supreme (3D) dependencies?</Text>
            <Text color={theme.muted}>R3F, OGL, Three.js, Lenis (~500kb+)</Text>
          </Box>
          <SelectInput
            items={supremeItems}
            onSelect={handleSupremeSelect}
          />
        </Box>
      )}

      {step === 5 && (
        <Box flexDirection="column" marginTop={1}>
          <Box flexDirection="row">
            <Text color={theme.primary}>
              <Spinner type="dots" />
            </Text>
            <Text> {installStatus}</Text>
          </Box>
          <Box marginTop={1}>
            <Text color={theme.muted}>
              framer-motion, lucide-react, clsx,
            </Text>
            <Text color={theme.muted}>
              tailwind-merge, class-variance-authority,
            </Text>
            <Text color={theme.muted}>
              @gwenui/themes + 26 Radix UI primitives
            </Text>
          </Box>
        </Box>
      )}

      {step === 6 && (
        <Box flexDirection="column" marginTop={1}>
          <Box flexDirection="row">
            <Text color={theme.primary}>
              <Spinner type="dots" />
            </Text>
            <Text> {installStatus}</Text>
          </Box>
          <Box marginTop={1}>
            <Text color={theme.muted}>
              @react-three/fiber, @react-three/drei,
            </Text>
            <Text color={theme.muted}>
              three, ogl, @studio-freight/lenis
            </Text>
          </Box>
        </Box>
      )}

      {step === 7 && (
        <Box flexDirection="column" marginTop={1}>
          <Text color={theme.success}>✓ GwenUI initialized successfully!</Text>
          
          <Box flexDirection="column" marginTop={1}>
            <Box flexDirection="row">
              <Text>Blocks dir      →  </Text>
              <Text color={theme.primary}>{blocksDir || 'src/components/blocks'}</Text>
            </Box>
            <Box flexDirection="row">
              <Text>Styles dir      →  </Text>
              <Text color={theme.primary}>{stylesDir || 'src/app'}</Text>
            </Box>
            <Box flexDirection="row">
              <Text>Package manager →  </Text>
              <Text color={theme.primary}>{packageManager}</Text>
            </Box>
            <Box flexDirection="row">
              <Text>Supreme         →  </Text>
              {installSupreme ? (
                <Text color={theme.success}>✓ installed</Text>
              ) : (
                <Text color={theme.muted}>✗ skipped</Text>
              )}
            </Box>
          </Box>

          <Box flexDirection="column" marginTop={1}>
            <Text>Dependencies installed:</Text>
            <Text color={theme.primary}>→ 26 Radix UI primitives</Text>
            <Text color={theme.primary}>→ framer-motion, lucide-react, clsx,</Text>
            <Text color={theme.primary}>  tailwind-merge, class-variance-authority,</Text>
            <Text color={theme.primary}>  @gwenui/themes</Text>
            {installSupreme && (
              <Text color={theme.primary}>→ @react-three/fiber, three, ogl, lenis</Text>
            )}
          </Box>

          <Box marginTop={1}>
            <Text color={theme.muted}>Run gwenui add &lt;block&gt; to install your first block.</Text>
            <Text color={theme.muted}>Browse blocks at https://gwenui.com/blocks</Text>
          </Box>
        </Box>
      )}

      {step === 8 && (
        <Box flexDirection="column" marginTop={1}>
          <Text color={theme.error}>✗ Failed to initialize GwenUI configuration!</Text>
          <Box marginTop={1}>
            <Text color={theme.muted}>{errorMsg}</Text>
          </Box>
          {onComplete && (
            <Box marginTop={1}>
              <SelectInput items={[{ label: 'Return to Main Menu', value: 'menu' }]} onSelect={onComplete} />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default InitFlow;
