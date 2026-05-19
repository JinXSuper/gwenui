import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import SpinnerImport from 'ink-spinner';
import SelectInputImport from 'ink-select-input';
import path from 'path';
import fs from 'fs';
import { theme } from '../theme.js';
import { readConfig, writeConfig } from '../utils/config.js';
import { RegistryStatus } from '../components/RegistryStatus.js';
import { Registry, BlockPayload, BlockFile } from '../types/registry.js';
import { detectPackageManager, PackageManager } from '../utils/detectPackageManager.js';
import { installDependencies } from '../utils/installDependencies.js';
import { fetchFileContent } from '../utils/fetchFile.js';
import { ConflictResolutionPrompt } from '../components/ConflictResolutionPrompt.js';
import { ConflictResolution } from '../utils/writeBlockFiles.js';

const Spinner = (SpinnerImport as any).default || SpinnerImport;
const SelectInput = (SelectInputImport as any).default || SelectInputImport;

function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

interface AddFlowProps {
  blockId?: string;
  onComplete: () => void;
}

export const AddFlow: React.FC<AddFlowProps> = ({ blockId: initialBlockId, onComplete }) => {
  const [step, setStep] = useState<number>(0);
  // 0 = config check
  // 1 = fetch registry (RegistryStatus)
  // 2 = enter or select block ID
  // 3 = show block info and confirm
  // 4 = writing files (handling conflicts one by one)
  // 5 = installing dependencies
  // 6 = success screen
  // 7 = error screen

  const [config, setConfig] = useState<any>(null);
  const [registry, setRegistry] = useState<Registry | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<BlockPayload | null>(null);
  const [blockId, setBlockId] = useState<string>(initialBlockId || '');
  
  // File writing state machine
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(0);
  const [conflictingFilePath, setConflictingFilePath] = useState<string | null>(null);
  const [installStatus, setInstallStatus] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // 1. Initial config check
  useEffect(() => {
    const loadedConfig = readConfig();
    if (!loadedConfig) {
      setErrorMsg('No GwenUI configuration found. Please run "gwenui init" first.');
      setStep(7);
    } else {
      setConfig(loadedConfig);
      setStep(1); // proceed to load registry
    }
  }, []);

  // 2. Handle registry loaded
  const handleRegistryLoaded = (loadedRegistry: Registry) => {
    setRegistry(loadedRegistry);
    if (blockId) {
      const block = loadedRegistry.blocks.find(b => b.id === blockId);
      if (!block) {
        setErrorMsg(`Block "${blockId}" not found in registry. Run "gwenui list" or use the interactive menu to browse blocks.`);
        setStep(7);
      } else {
        setSelectedBlock(block);
        setStep(3); // show info and confirm
      }
    } else {
      setStep(2); // show selection or manual ID input
    }
  };

  // 3. Handle block selection
  const handleBlockSelect = (item: { value: string }) => {
    if (item.value === 'back') {
      onComplete();
      return;
    }
    const block = registry?.blocks.find(b => b.id === item.value);
    if (block) {
      setSelectedBlock(block);
      setBlockId(block.id);
      setStep(3);
    }
  };

  // 4. Handle Proceed Confirmation
  const handleConfirmSelect = (item: { value: string }) => {
    if (item.value === 'yes') {
      setStep(4); // proceed to write files
    } else {
      onComplete();
    }
  };

  // 5. File writing loop
  useEffect(() => {
    if (step !== 4 || !selectedBlock || !config) return;

    const files = selectedBlock.files;
    if (currentFileIndex >= files.length) {
      // Completed writing files! Go to dependency installation
      setStep(5);
      return;
    }

    const file = files[currentFileIndex];
    const targetPath = path.resolve(process.cwd(), config.blocksDir, file.path);

    async function processFile() {
      try {
        if (fs.existsSync(targetPath) && !conflictingFilePath) {
          // Found conflict! Pause loop and show prompt
          setConflictingFilePath(file.path);
        } else {
          // No conflict or conflict already resolved as overwrite.
          setInstallStatus(`Fetching ${file.path}...`);
          const content = await fetchFileContent(file.url);
          
          fs.mkdirSync(path.dirname(targetPath), { recursive: true });
          fs.writeFileSync(targetPath, content, 'utf-8');

          // Increment and clear conflict flag
          setConflictingFilePath(null);
          setCurrentFileIndex(prev => prev + 1);
        }
      } catch (err: any) {
        setErrorMsg(err.message || `Failed to write file: ${file.path}`);
        setStep(7);
      }
    }

    processFile();
  }, [step, currentFileIndex, selectedBlock, config, conflictingFilePath]);

  // 6. Handle Conflict Resolution
  const handleConflictResolve = (resolution: ConflictResolution) => {
    if (resolution === 'cancel') {
      onComplete();
      return;
    }

    if (resolution === 'skip') {
      setConflictingFilePath(null);
      setCurrentFileIndex(prev => prev + 1);
      return;
    }

    if (resolution === 'overwrite') {
      // Temporarily bypass conflict check by deleting file or just writing it directly
      const file = selectedBlock!.files[currentFileIndex];
      const targetPath = path.resolve(process.cwd(), config.blocksDir, file.path);
      
      setInstallStatus(`Overwriting ${file.path}...`);
      fetchFileContent(file.url)
        .then(content => {
          fs.mkdirSync(path.dirname(targetPath), { recursive: true });
          fs.writeFileSync(targetPath, content, 'utf-8');
          setConflictingFilePath(null);
          setCurrentFileIndex(prev => prev + 1);
        })
        .catch(err => {
          setErrorMsg(err.message || `Failed to overwrite file: ${file.path}`);
          setStep(7);
        });
    }
  };

  // 7. Install Dependencies
  useEffect(() => {
    if (step !== 5 || !selectedBlock) return;

    async function runDepsInstall() {
      try {
        setInstallStatus('Installing dependencies...');
        const pm = detectPackageManager(process.cwd());
        await installDependencies(
          selectedBlock!.dependencies,
          selectedBlock!.devDependencies,
          pm,
          process.cwd()
        );

        // Track installed block in config
        const loadedConfig = readConfig();
        if (loadedConfig) {
          if (!loadedConfig.installedBlocks) {
            loadedConfig.installedBlocks = [];
          }
          loadedConfig.installedBlocks = loadedConfig.installedBlocks.filter(
            (b: any) => b.id !== selectedBlock!.id
          );
          loadedConfig.installedBlocks.push({
            id: selectedBlock!.id,
            version: selectedBlock!.version,
            tier: selectedBlock!.tier,
            license: selectedBlock!.license,
            installedAt: new Date().toISOString(),
          });
          writeConfig(loadedConfig);
        }

        setStep(6);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to install NPM dependencies.');
        setStep(7);
      }
    }

    runDepsInstall();
  }, [step, selectedBlock]);

  // Form selection items for block selection menu
  const blockSelectionItems = registry
    ? [
        ...registry.blocks.map(b => ({
          label: `${b.name} (${b.tier === 'supreme' ? 'Supreme' : 'Basic'}) — ${b.description.slice(0, 50)}...`,
          value: b.id,
        })),
        { label: '← Go Back', value: 'back' },
      ]
    : [];

  return (
    <Box flexDirection="column" paddingY={1}>
      <Text color={theme.primary}>✦ GwenUI Block Installer ✦</Text>

      {step === 1 && (
        <RegistryStatus onComplete={handleRegistryLoaded} onError={(err) => {
          setErrorMsg(err.message);
          setStep(7);
        }} />
      )}

      {step === 2 && (
        <Box flexDirection="column" marginTop={1}>
          <Text>Choose a block to install in your project:</Text>
          <Box marginTop={1}>
            <SelectInput items={blockSelectionItems} onSelect={handleBlockSelect} />
          </Box>
        </Box>
      )}

      {step === 3 && selectedBlock && (
        <Box flexDirection="column" marginTop={1}>
          {/* Block info card */}
          <Box borderStyle="round" borderColor={theme.primary} flexDirection="column" paddingX={2} paddingY={1} width={60}>
            <Box flexDirection="row" justifyContent="space-between" width="100%">
              <Box flexDirection="row">
                <Text color={theme.primary}>📦 {selectedBlock.name} </Text>
                <Text color={theme.muted}> v{selectedBlock.version}</Text>
              </Box>
              <Box flexDirection="row">
                <Text color={selectedBlock.tier === 'supreme' ? theme.primary : theme.muted}>
                  [{selectedBlock.tier === 'supreme' ? 'Supreme' : 'Basic'}]
                </Text>
                <Text color={theme.muted}>  {selectedBlock.license}</Text>
              </Box>
            </Box>
            <Box marginTop={1}>
              <Text>{selectedBlock.description}</Text>
            </Box>
          </Box>

          <Box flexDirection="column" marginTop={1}>
            <Text>Files to be added:</Text>
            {selectedBlock.files.map((file, idx) => (
              <Text key={idx} color={theme.muted}>  → {config?.blocksDir}/{file.path}</Text>
            ))}
          </Box>

          <Box flexDirection="column" marginTop={1}>
            <Text>Dependencies to install:</Text>
            <Text color={theme.muted}>
              {selectedBlock.dependencies.length > 0 || selectedBlock.devDependencies.length > 0 ? (
                `  → ${[...selectedBlock.dependencies, ...selectedBlock.devDependencies].join(', ')}`
              ) : (
                '  → None'
              )}
            </Text>
          </Box>

          <Box marginTop={1} flexDirection="column">
            <Text>Proceed? </Text>
            <Box marginTop={1}>
              <SelectInput
                items={[
                  { label: 'Yes, proceed', value: 'yes' },
                  { label: 'No, cancel', value: 'no' },
                ]}
                onSelect={handleConfirmSelect}
              />
            </Box>
          </Box>
        </Box>
      )}

      {step === 4 && (
        <Box flexDirection="column" marginTop={1}>
          {conflictingFilePath ? (
            <ConflictResolutionPrompt filePath={conflictingFilePath} onResolve={handleConflictResolve} />
          ) : (
            <Box flexDirection="row">
              <Text color={theme.primary}>
                <Spinner type="dots" />
              </Text>
              <Text> {installStatus}</Text>
            </Box>
          )}
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
              {selectedBlock ? [...selectedBlock.dependencies, ...selectedBlock.devDependencies].join(', ') : ''}
            </Text>
          </Box>
        </Box>
      )}

      {step === 6 && (
        <Box flexDirection="column" marginTop={1}>
          <Text color={theme.success}>✓ {selectedBlock?.id} installed successfully!</Text>
          
          <Box marginTop={1} flexDirection="column">
            <Text>Import it in your project:</Text>
            <Text color={theme.primary}>
              import {toPascalCase(selectedBlock?.id || '')} from './components/blocks/{selectedBlock?.id}';
            </Text>
          </Box>

          <Box marginTop={1} flexDirection="column">
            <Text color={theme.muted}>License: {selectedBlock?.license}</Text>
            <Text color={theme.muted}>Docs: https://gwenui.com/docs/blocks/{selectedBlock?.id}</Text>
          </Box>

          <Box marginTop={1}>
            <SelectInput items={[{ label: 'Return to Main Menu', value: 'menu' }]} onSelect={onComplete} />
          </Box>
        </Box>
      )}

      {step === 7 && (
        <Box flexDirection="column" marginTop={1}>
          <Text color={theme.error}>✗ Installation Failed!</Text>
          <Box marginTop={1} marginBottom={1}>
            <Text color={theme.muted}>{errorMsg}</Text>
          </Box>
          <SelectInput items={[{ label: 'Return to Main Menu', value: 'menu' }]} onSelect={onComplete} />
        </Box>
      )}
    </Box>
  );
};

export default AddFlow;
