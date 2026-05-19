import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import SpinnerImport from 'ink-spinner';
import SelectInputImport from 'ink-select-input';
import { theme } from '../theme.js';
import { RegistryStatus } from '../components/RegistryStatus.js';
import { Registry, BlockPayload } from '../types/registry.js';
import { fetchFileContent } from '../utils/fetchFile.js';

const Spinner = (SpinnerImport as any).default || SpinnerImport;
const SelectInput = (SelectInputImport as any).default || SelectInputImport;

interface ViewFlowProps {
  blockId?: string;
  onComplete: () => void;
}

export const ViewFlow: React.FC<ViewFlowProps> = ({ blockId: initialBlockId, onComplete }) => {
  const [step, setStep] = useState<number>(1);
  // 1 = fetch registry (RegistryStatus)
  // 2 = select block (if no initial block ID or if invalid)
  // 3 = fetching source code preview
  // 4 = display details
  // 5 = error screen

  const [registry, setRegistry] = useState<Registry | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<BlockPayload | null>(null);
  const [blockId, setBlockId] = useState<string>(initialBlockId || '');
  const [sourcePreview, setSourcePreview] = useState<string>('');
  const [isTruncated, setIsTruncated] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleRegistryLoaded = (loadedRegistry: Registry) => {
    setRegistry(loadedRegistry);
    if (blockId) {
      const block = loadedRegistry.blocks.find(b => b.id === blockId);
      if (!block) {
        setErrorMsg(`Block "${blockId}" not found in registry.`);
        setStep(5);
      } else {
        setSelectedBlock(block);
        setStep(3); // fetch source preview
      }
    } else {
      setStep(2); // block list selector
    }
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
      setStep(3);
    }
  };

  // Fetch first file content as source preview
  useEffect(() => {
    if (step !== 3 || !selectedBlock) return;

    async function loadPreview() {
      try {
        if (selectedBlock!.files.length > 0) {
          const content = await fetchFileContent(selectedBlock!.files[0].url);
          const lines = content.split('\n');
          setSourcePreview(lines.slice(0, 30).join('\n'));
          setIsTruncated(lines.length > 30);
        } else {
          setSourcePreview('(No files available for this block)');
          setIsTruncated(false);
        }
        setStep(4);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to fetch source file preview.');
        setStep(5);
      }
    }

    loadPreview();
  }, [step, selectedBlock]);

  const blockSelectionItems = registry
    ? [
        ...registry.blocks.map(b => ({
          label: `${b.name} (${b.tier === 'supreme' ? 'Supreme' : 'Basic'})`,
          value: b.id,
        })),
        { label: '← Go Back', value: 'back' },
      ]
    : [];

  return (
    <Box flexDirection="column" paddingY={1}>
      <Text color={theme.primary}>✦ GwenUI Block Viewer ✦</Text>

      {step === 1 && (
        <RegistryStatus
          onComplete={handleRegistryLoaded}
          onError={(err) => {
            setErrorMsg(err.message);
            setStep(5);
          }}
        />
      )}

      {step === 2 && (
        <Box flexDirection="column" marginTop={1}>
          <Text>Choose a block to view details:</Text>
          <Box marginTop={1}>
            <SelectInput items={blockSelectionItems} onSelect={handleBlockSelect} />
          </Box>
        </Box>
      )}

      {step === 3 && (
        <Box flexDirection="row" marginTop={1}>
          <Text color={theme.primary}>
            <Spinner type="dots" />
          </Text>
          <Text> Fetching block preview...</Text>
        </Box>
      )}

      {step === 4 && selectedBlock && (
        <Box flexDirection="column" marginTop={1}>
          {/* Header Card */}
          <Box borderStyle="round" borderColor={theme.primary} paddingX={2} paddingY={0} width={50}>
            <Text color={theme.primary}>👁  Previewing: {selectedBlock.id}</Text>
          </Box>

          <Box flexDirection="column" marginTop={1}>
            <Box flexDirection="row">
              <Box width={18}>
                <Text>Name</Text>
              </Box>
              <Text color={theme.primary} bold>{selectedBlock.name}</Text>
            </Box>
            <Box flexDirection="row">
              <Box width={18}>
                <Text>Tier</Text>
              </Box>
              <Text color={selectedBlock.tier === 'supreme' ? theme.primary : theme.muted}>
                {selectedBlock.tier === 'supreme' ? 'Supreme' : 'Basic'}
              </Text>
            </Box>
            <Box flexDirection="row">
              <Box width={18}>
                <Text>Version</Text>
              </Box>
              <Text>v{selectedBlock.version}</Text>
            </Box>
            <Box flexDirection="row">
              <Box width={18}>
                <Text>License</Text>
              </Box>
              <Text>{selectedBlock.license}</Text>
            </Box>
            <Box flexDirection="column" marginTop={0.5}>
              <Text>Description</Text>
              <Text color={theme.muted}>{selectedBlock.description}</Text>
            </Box>
          </Box>

          <Box flexDirection="column" marginTop={1}>
            <Text>Files</Text>
            {selectedBlock.files.map((file, idx) => (
              <Text key={idx} color={theme.muted}>  → {file.path}</Text>
            ))}
          </Box>

          <Box flexDirection="column" marginTop={1}>
            <Text>Dependencies</Text>
            {selectedBlock.dependencies.length > 0 ? (
              selectedBlock.dependencies.map((dep, idx) => (
                <Text key={idx} color={theme.muted}>  → {dep}</Text>
              ))
            ) : (
              <Text color={theme.muted}>  → (none)</Text>
            )}
          </Box>

          <Box flexDirection="column" marginTop={1}>
            <Text>Dev Dependencies</Text>
            {selectedBlock.devDependencies.length > 0 ? (
              selectedBlock.devDependencies.map((dep, idx) => (
                <Text key={idx} color={theme.muted}>  → {dep}</Text>
              ))
            ) : (
              <Text color={theme.muted}>  → (none)</Text>
            )}
          </Box>

          <Box flexDirection="column" marginTop={1}>
            <Box flexDirection="row">
              <Box width={22}>
                <Text>Requires Tailwind</Text>
              </Box>
              {selectedBlock.requiresTailwind ? (
                <Text color={theme.success}>✓</Text>
              ) : (
                <Text color={theme.muted}>✗</Text>
              )}
            </Box>
            <Box flexDirection="row">
              <Box width={22}>
                <Text>Requires GwenTheme</Text>
              </Box>
              {selectedBlock.requiresGwenTheme ? (
                <Text color={theme.success}>✓</Text>
              ) : (
                <Text color={theme.muted}>✗</Text>
              )}
            </Box>
          </Box>

          {selectedBlock.files.length > 0 && (
            <Box flexDirection="column" marginTop={1}>
              <Text color={theme.muted}>─────────────────────────────────────────────</Text>
              <Text bold color={theme.primary}>Source Preview ({selectedBlock.files[0].path})</Text>
              <Box marginY={0.5} paddingX={1} borderStyle="single" borderColor={theme.muted} flexDirection="column">
                <Text>{sourcePreview}</Text>
              </Box>
              {isTruncated && (
                <Text color={theme.muted}>
                  ... (truncated, full source at gwenui.com/blocks/{selectedBlock.id})
                </Text>
              )}
              <Text color={theme.muted}>─────────────────────────────────────────────</Text>
            </Box>
          )}

          <Box marginTop={1}>
            <Text color={theme.muted}>Run gwenui add {selectedBlock.id} to install this block.</Text>
          </Box>

          <Box marginTop={1}>
            <SelectInput
              items={[{ label: 'Return to Menu', value: 'menu' }]}
              onSelect={onComplete}
            />
          </Box>
        </Box>
      )}

      {step === 5 && (
        <Box flexDirection="column" marginTop={1}>
          <Text color={theme.error}>✗ Operation Failed</Text>
          <Box marginTop={1} marginBottom={1}>
            <Text color={theme.muted}>{errorMsg}</Text>
          </Box>
          <SelectInput
            items={[{ label: 'Return to Menu', value: 'menu' }]}
            onSelect={onComplete}
          />
        </Box>
      )}
    </Box>
  );
};

export default ViewFlow;
