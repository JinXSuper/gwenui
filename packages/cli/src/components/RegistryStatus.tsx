import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import SpinnerImport from 'ink-spinner';
import { theme } from '../theme.js';
import { fetchRegistry, getRegistrySource } from '../utils/fetchRegistry.js';
import { Registry } from '../types/registry.js';

const Spinner = (SpinnerImport as any).default || SpinnerImport;

interface RegistryStatusProps {
  onComplete: (registry: Registry) => void;
  onError?: (error: Error) => void;
}

export const RegistryStatus: React.FC<RegistryStatusProps> = ({ onComplete, onError }) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'fallback' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const registry = await fetchRegistry();
        const source = getRegistrySource();
        if (source === 'fallback') {
          setStatus('fallback');
          setTimeout(() => {
            onComplete(registry);
          }, 1500); // let them see the warning!
        } else {
          setStatus('success');
          setTimeout(() => {
            onComplete(registry);
          }, 800); // brief success message pause
        }
      } catch (err: any) {
        setStatus('error');
        setErrorMsg(err.message || 'Unknown registry load error');
        if (onError) {
          onError(err);
        }
      }
    }

    load();
  }, [onComplete, onError]);

  return (
    <Box flexDirection="column" paddingY={1}>
      {status === 'loading' && (
        <Box flexDirection="row">
          <Text color={theme.primary}>
            <Spinner type="dots" />
          </Text>
          <Text> Connecting to GwenUI registry...</Text>
        </Box>
      )}

      {status === 'success' && (
        <Box flexDirection="column">
          <Text color={theme.success}>✓ Registry loaded (gwenui.com)</Text>
        </Box>
      )}

      {status === 'fallback' && (
        <Box flexDirection="column">
          <Text color={theme.primary}>⚠ Primary registry unreachable, using fallback...</Text>
          <Text color={theme.success}>✓ Registry loaded (github fallback)</Text>
        </Box>
      )}

      {status === 'error' && (
        <Box flexDirection="column">
          <Text color={theme.error}>✗ Could not reach GwenUI registry.</Text>
          <Text color={theme.muted}>Check your internet connection and try again.</Text>
          {errorMsg && errorMsg !== 'Could not reach GwenUI registry.\nCheck your internet connection and try again.' && (
            <Box marginTop={1}>
              <Text color={theme.error}>{errorMsg}</Text>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default RegistryStatus;
