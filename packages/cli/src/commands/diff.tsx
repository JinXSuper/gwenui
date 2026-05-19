import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import SpinnerImport from 'ink-spinner';
import SelectInputImport from 'ink-select-input';
import fs from 'fs';
import path from 'path';
import { theme } from '../theme.js';
import { readConfig } from '../utils/config.js';
import { RegistryStatus } from '../components/RegistryStatus.js';
import { Registry, BlockPayload } from '../types/registry.js';
import { fetchFileContent } from '../utils/fetchFile.js';

const Spinner = (SpinnerImport as any).default || SpinnerImport;
const SelectInput = (SelectInputImport as any).default || SelectInputImport;

interface DiffFlowProps {
  blockId?: string;
  onComplete: () => void;
}

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
}

export const DiffFlow: React.FC<DiffFlowProps> = ({ blockId: initialBlockId, onComplete }) => {
  const [step, setStep] = useState<number>(1);
  // 1 = check config & local installation
  // 2 = select block (if no ID or multiple)
  // 3 = fetch registry (RegistryStatus)
  // 4 = fetch registry file content & compare
  // 5 = show diff
  // 6 = error screen

  const [config, setConfig] = useState<any>(null);
  const [registry, setRegistry] = useState<Registry | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<BlockPayload | null>(null);
  const [blockId, setBlockId] = useState<string>(initialBlockId || '');
  const [localVersion, setLocalVersion] = useState<string>('');
  
  const [diffLines, setDiffLines] = useState<DiffLine[]>([]);
  const [isTruncated, setIsTruncated] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [infoMsg, setInfoMsg] = useState<string>('');

  // 1. Initial local check
  useEffect(() => {
    const loadedConfig = readConfig();
    if (!loadedConfig) {
      setErrorMsg('No GwenUI configuration found. Please run "gwenui init" first.');
      setStep(6);
      return;
    }
    setConfig(loadedConfig);

    if (blockId) {
      // Check if installed in config
      const installed = loadedConfig.installedBlocks?.find(b => b.id === blockId);
      const targetFile = path.resolve(process.cwd(), loadedConfig.blocksDir, blockId, 'index.tsx');
      
      if (!installed || !fs.existsSync(targetFile)) {
        setInfoMsg(`✗ ${blockId} is not installed in this project.\nRun gwenui add ${blockId} to install it.`);
        setStep(6);
      } else {
        setLocalVersion(installed.version);
        setStep(3); // proceed to fetch registry
      }
    } else {
      setStep(2); // block select prompt
    }
  }, [blockId]);

  const handleRegistryLoaded = (loadedRegistry: Registry) => {
    setRegistry(loadedRegistry);
    
    let targetBlock = selectedBlock;
    if (!targetBlock && blockId) {
      targetBlock = loadedRegistry.blocks.find(b => b.id === blockId) || null;
    }

    if (!targetBlock) {
      setErrorMsg(`Block "${blockId}" not found in registry.`);
      setStep(6);
      return;
    }

    setSelectedBlock(targetBlock);
    setStep(4); // fetch registry file content & compare
  };

  const handleBlockSelect = (item: { value: string }) => {
    if (item.value === 'back') {
      onComplete();
      return;
    }
    const block = registry?.blocks.find(b => b.id === item.value);
    if (block) {
      setSelectedBlock(block);
      setBlockId(block.id);
      
      const installed = config.installedBlocks?.find((b: any) => b.id === block.id);
      if (!installed) {
        setInfoMsg(`✗ ${block.id} is not installed in this project.\nRun gwenui add ${block.id} to install it.`);
        setStep(6);
      } else {
        setLocalVersion(installed.version);
        setStep(3); // fetch registry
      }
    }
  };

  // Fetch registry source content and run simple diff
  useEffect(() => {
    if (step !== 4 || !selectedBlock || !config) return;

    async function runDiff() {
      try {
        const firstFile = selectedBlock!.files[0];
        if (!firstFile) {
          setErrorMsg('No source files found in block registry payload.');
          setStep(6);
          return;
        }

        const localFilePath = path.resolve(process.cwd(), config.blocksDir, selectedBlock!.id, firstFile.path.split('/').pop() || '');
        if (!fs.existsSync(localFilePath)) {
          setErrorMsg(`Local source file not found at: ${localFilePath}`);
          setStep(6);
          return;
        }

        const localContent = fs.readFileSync(localFilePath, 'utf-8');
        const remoteContent = await fetchFileContent(firstFile.url);

        // Simple line-by-line diff algorithm
        const localLines = localContent.split('\n');
        const remoteLines = remoteContent.split('\n');
        
        const linesDiff: DiffLine[] = [];
        const maxLen = Math.max(localLines.length, remoteLines.length);

        for (let i = 0; i < maxLen; i++) {
          const localLine = localLines[i];
          const remoteLine = remoteLines[i];

          if (localLine === remoteLine) {
            linesDiff.push({ type: 'unchanged', text: localLine || '' });
          } else {
            if (localLine !== undefined) {
              linesDiff.push({ type: 'removed', text: `- ${localLine}` });
            }
            if (remoteLine !== undefined) {
              linesDiff.push({ type: 'added', text: `+ ${remoteLine}` });
            }
          }
        }

        setDiffLines(linesDiff);
        setIsTruncated(linesDiff.length > 50);
        setStep(5);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to compare source codes.');
        setStep(6);
      }
    }

    runDiff();
  }, [step, selectedBlock, config]);

  const blockSelectionItems = config?.installedBlocks
    ? [
        ...config.installedBlocks.map((b: any) => ({
          label: `${b.id} (installed: v${b.version})`,
          value: b.id,
        })),
        { label: '← Go Back', value: 'back' },
      ]
    : [];

  return (
    <Box flexDirection="column" paddingY={1}>
      <Text color={theme.primary}>✦ GwenUI Block Differ ✦</Text>

      {step === 2 && (
        <Box flexDirection="column" marginTop={1}>
          <Text>Choose an installed block to compare with the registry:</Text>
          <Box marginTop={1}>
            <SelectInput items={blockSelectionItems} onSelect={handleBlockSelect} />
          </Box>
        </Box>
      )}

      {step === 3 && (
        <Box flexDirection="column" marginTop={1}>
          <RegistryStatus
            onComplete={handleRegistryLoaded}
            onError={(err) => {
              setErrorMsg(err.message);
              setStep(6);
            }}
          />
        </Box>
      )}

      {step === 4 && (
        <Box flexDirection="row" marginTop={1}>
          <Text color={theme.primary}>
            <Spinner type="dots" />
          </Text>
          <Text> Comparing with registry latest source...</Text>
        </Box>
      )}

      {step === 5 && selectedBlock && (
        <Box flexDirection="column" marginTop={1}>
          {localVersion === selectedBlock.version && diffLines.every(l => l.type === 'unchanged') ? (
            <Box marginTop={1} flexDirection="column">
              <Text color={theme.success}>✓ {selectedBlock.id} is up to date (v{localVersion})</Text>
            </Box>
          ) : (
            <Box flexDirection="column">
              {/* Header Box */}
              <Box borderStyle="round" borderColor={theme.primary} flexDirection="column" paddingX={2} paddingY={0} width={50}>
                <Text color={theme.primary}>↕  Diff: {selectedBlock.id}</Text>
                <Text color={theme.muted}>Local v{localVersion}  →  Registry v{selectedBlock.version}</Text>
              </Box>

              <Box flexDirection="column" marginTop={1}>
                <Text bold>{selectedBlock.files[0]?.path || 'index.tsx'}</Text>
                <Text color={theme.muted}>─────────────────────</Text>
                
                <Box marginY={0.5} paddingX={1} borderStyle="single" borderColor={theme.muted} flexDirection="column">
                  {diffLines.slice(0, 50).map((line, idx) => {
                    let color = 'white';
                    if (line.type === 'added') color = theme.success;
                    if (line.type === 'removed') color = theme.error;
                    if (line.type === 'unchanged') color = theme.muted;

                    return (
                      <Text key={idx} color={color}>
                        {line.text}
                      </Text>
                    );
                  })}
                </Box>

                {isTruncated && (
                  <Text color={theme.muted}>
                    ... (truncated, showing first 50 diff lines)
                  </Text>
                )}
                
                <Text color={theme.muted}>─────────────────────</Text>
              </Box>

              <Box marginTop={1}>
                <Text color={theme.primary}>Run gwenui update {selectedBlock.id} to apply changes.</Text>
              </Box>
            </Box>
          )}

          <Box marginTop={1}>
            <SelectInput
              items={[{ label: 'Return to Menu', value: 'menu' }]}
              onSelect={onComplete}
            />
          </Box>
        </Box>
      )}

      {step === 6 && (
        <Box flexDirection="column" marginTop={1}>
          {infoMsg ? (
            <Text color={theme.muted}>{infoMsg}</Text>
          ) : (
            <Box flexDirection="column">
              <Text color={theme.error}>✗ Diff Operation Failed</Text>
              <Box marginTop={1}>
                <Text color={theme.muted}>{errorMsg}</Text>
              </Box>
            </Box>
          )}
          <Box marginTop={1}>
            <SelectInput
              items={[{ label: 'Return to Menu', value: 'menu' }]}
              onSelect={onComplete}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default DiffFlow;
