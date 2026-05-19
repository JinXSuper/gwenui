import React, { useState } from 'react';
import { Box, Text } from 'ink';
import { theme } from '../theme.js';
import { RegistryStatus } from '../components/RegistryStatus.js';
import { Registry, BlockPayload } from '../types/registry.js';

interface ListFlowProps {
  onComplete: () => void;
}

export const ListFlow: React.FC<ListFlowProps> = ({ onComplete }) => {
  const [registry, setRegistry] = useState<Registry | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  const handleRegistryLoaded = (loadedRegistry: Registry) => {
    setRegistry(loadedRegistry);
    setStatus('success');
    // We let the user read it and exit in the main run, but since it's a CLI command we can print it
    // and wait for a keypress or exit on timeout. But since ink is rendering, we should show it
    // and exit using a setTimeout or a key listener. The spec says `gwenui list` prints the blocks.
    // Let's print it and exit.
    setTimeout(() => {
      onComplete();
    }, 100);
  };

  const handleRegistryError = (err: Error) => {
    setErrorMsg(err.message);
    setStatus('error');
    setTimeout(() => {
      onComplete();
    }, 100);
  };

  if (status === 'loading') {
    return (
      <Box flexDirection="column" paddingY={1}>
        <RegistryStatus onComplete={handleRegistryLoaded} onError={handleRegistryError} />
      </Box>
    );
  }

  if (status === 'error') {
    return (
      <Box flexDirection="column" paddingY={1}>
        <Text color={theme.error}>✗ Failed to fetch registry:</Text>
        <Text color={theme.muted}>{errorMsg}</Text>
      </Box>
    );
  }

  if (!registry) return null;

  const basicBlocks = registry.blocks.filter(b => b.tier === 'basic');
  const supremeBlocks = registry.blocks.filter(b => b.tier === 'supreme');

  const renderBlockLine = (block: BlockPayload) => {
    const idStr = block.id.padEnd(16);
    const nameStr = block.name.padEnd(20);
    const versionStr = `v${block.version}`.padEnd(8);
    const licenseStr = block.license;

    return (
      <Box key={block.id} flexDirection="row">
        <Text color={theme.primary}>{idStr}</Text>
        <Text>{nameStr}</Text>
        <Text color={theme.muted}>{versionStr}</Text>
        <Text color={theme.muted}>{licenseStr}</Text>
      </Box>
    );
  };

  return (
    <Box flexDirection="column" paddingY={1}>
      <Text color={theme.primary} bold>
        Available Blocks ({registry.blocks.length})
      </Text>

      {basicBlocks.length > 0 && (
        <Box flexDirection="column" marginTop={1}>
          <Text color={theme.muted}>Basic</Text>
          <Text color={theme.muted}>─────</Text>
          {basicBlocks.map(renderBlockLine)}
        </Box>
      )}

      {supremeBlocks.length > 0 && (
        <Box flexDirection="column" marginTop={1}>
          <Text color={theme.primary}>Supreme</Text>
          <Text color={theme.primary}>───────</Text>
          {supremeBlocks.map(renderBlockLine)}
        </Box>
      )}
    </Box>
  );
};

export default ListFlow;
