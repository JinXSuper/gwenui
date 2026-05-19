import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import SpinnerImport from 'ink-spinner';
import SelectInputImport from 'ink-select-input';
import { execa } from 'execa';
import { theme } from '../theme.js';
import { RegistryStatus } from '../components/RegistryStatus.js';
import { Registry } from '../types/registry.js';

const Spinner = (SpinnerImport as any).default || SpinnerImport;
const SelectInput = (SelectInputImport as any).default || SelectInputImport;

interface DocsFlowProps {
  blockId?: string;
  onComplete: () => void;
}

export const DocsFlow: React.FC<DocsFlowProps> = ({ blockId, onComplete }) => {
  const [step, setStep] = useState<number>(blockId ? 1 : 2);
  // 1 = fetch registry (only if blockId provided, to verify it exists)
  // 2 = open docs
  // 3 = done/exit

  const [registry, setRegistry] = useState<Registry | null>(null);
  const [urlToOpen, setUrlToOpen] = useState<string>('https://gwenui.com/docs');
  const [statusMsg, setStatusMsg] = useState<string>('✓ Opening GwenUI Docs...');

  const handleRegistryLoaded = (loadedRegistry: Registry) => {
    setRegistry(loadedRegistry);
    if (blockId) {
      const block = loadedRegistry.blocks.find(b => b.id === blockId);
      if (block) {
        setStatusMsg(`✓ Opening docs for ${blockId}...`);
        setUrlToOpen(`https://gwenui.com/docs/blocks/${blockId}`);
      } else {
        setStatusMsg(`✗ Block '${blockId}' not found in registry.\nOpening docs homepage instead...`);
        setUrlToOpen('https://gwenui.com/docs');
      }
    }
    setStep(2);
  };

  const handleRegistryError = () => {
    // If registry check fails, open home page as fallback
    setStatusMsg(`✗ Registry connection failed.\nOpening docs homepage instead...`);
    setUrlToOpen('https://gwenui.com/docs');
    setStep(2);
  };

  useEffect(() => {
    if (step !== 2) return;

    async function openBrowser() {
      try {
        let cmd = 'open';
        let args = [urlToOpen];

        if (process.platform === 'win32') {
          cmd = 'cmd';
          args = ['/c', 'start', '', urlToOpen];
        } else if (process.platform === 'linux') {
          cmd = 'xdg-open';
        }

        await execa(cmd, args);
        setStep(3);
      } catch (err) {
        // Fallback or print info if browser fails to spawn
        setStep(3);
      }
    }

    openBrowser();
  }, [step, urlToOpen]);

  // Complete and exit
  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, onComplete]);

  return (
    <Box flexDirection="column" paddingY={1}>
      <Text color={theme.primary}>✦ GwenUI Browser Docs ✦</Text>

      {step === 1 && (
        <RegistryStatus
          onComplete={handleRegistryLoaded}
          onError={handleRegistryError}
        />
      )}

      {step === 2 && (
        <Box flexDirection="row" marginTop={1}>
          <Text color={theme.primary}>
            <Spinner type="dots" />
          </Text>
          <Text> Spawning default system browser...</Text>
        </Box>
      )}

      {step === 3 && (
        <Box flexDirection="column" marginTop={1}>
          <Text color={statusMsg.startsWith('✓') ? theme.success : theme.error}>
            {statusMsg.split('\n')[0]}
          </Text>
          {statusMsg.includes('\n') && (
            <Text color={theme.muted}>{statusMsg.split('\n')[1]}</Text>
          )}
          <Box marginTop={1}>
            <Text color={theme.primary}>{urlToOpen}</Text>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default DocsFlow;
