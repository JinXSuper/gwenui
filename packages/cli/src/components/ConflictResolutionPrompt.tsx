import React from 'react';
import { Box, Text } from 'ink';
import SelectInputImport from 'ink-select-input';
import { theme } from '../theme.js';
import { ConflictResolution } from '../utils/writeBlockFiles.js';

const SelectInput = (SelectInputImport as any).default || SelectInputImport;

interface ConflictResolutionPromptProps {
  filePath: string;
  onResolve: (resolution: ConflictResolution) => void;
}

export const ConflictResolutionPrompt: React.FC<ConflictResolutionPromptProps> = ({
  filePath,
  onResolve,
}) => {
  const handleSelect = (item: { value: string }) => {
    onResolve(item.value as ConflictResolution);
  };

  const items = [
    { label: 'Overwrite', value: 'overwrite' },
    { label: 'Skip this file', value: 'skip' },
    { label: 'Cancel installation', value: 'cancel' },
  ];

  return (
    <Box flexDirection="column" marginY={1}>
      <Box flexDirection="row">
        <Text color={theme.primary}>⚠ File already exists: </Text>
        <Text color={theme.muted}>{filePath}</Text>
      </Box>
      <Text>How do you want to proceed?</Text>
      <Box marginTop={1}>
        <SelectInput items={items} onSelect={handleSelect} />
      </Box>
    </Box>
  );
};

export default ConflictResolutionPrompt;
