import React from 'react';
import { useInput, Box, Text, Key } from 'ink';
import { theme } from '../theme.js';

interface ConflictPromptProps {
  version?: string;
  onConfirm: () => void;
}

export const ConflictPrompt: React.FC<ConflictPromptProps> = ({ version = 'v1.2.0', onConfirm }) => {
  useInput((input: string, key: Key) => {
    if (input.toLowerCase() === 'y') {
      onConfirm();
    } else if (input.toLowerCase() === 'n' || key.return) {
      console.log('\nInstallation cancelled.');
      process.exit(0);
    }
  });

  return (
    <Box flexDirection="column" borderStyle="round" borderColor={theme.muted} paddingX={2} paddingY={1} width={47}>
      <Box flexDirection="row" marginBottom={1}>
        <Text color={theme.error}>⚠</Text>
        <Text>  GwenUI CLI </Text>
        <Text color={theme.primary}>{version}</Text>
        <Text> already installed</Text>
      </Box>
      <Box>
        <Text>Proceed to install a new one? </Text>
        <Text color={theme.muted}>(y/N)</Text>
      </Box>
    </Box>
  );
};
export default ConflictPrompt;
