import React, { useState } from 'react';
import { Box, Text } from 'ink';
import SelectInputImport from 'ink-select-input';
import TextInputImport from 'ink-text-input';
import { theme } from '../theme.js';
import { InitFlow } from '../commands/init.js';
import { AddFlow } from '../commands/add.js';
import { ViewFlow } from '../commands/view.js';
import { DiffFlow } from '../commands/diff.js';
import { InfoFlow } from '../commands/info.js';
import { DocsFlow } from '../commands/docs.js';
import { readConfig } from '../utils/config.js';
import { GwenASCII } from './GwenASCII.js';
import { getCliVersion } from '../utils/version.js';

const SelectInput = (SelectInputImport as any).default || SelectInputImport;
const TextInput = (TextInputImport as any).default || TextInputImport;

export const RootMenu: React.FC = () => {
  const [activeView, setActiveView] = useState<'menu' | 'init' | 'add' | 'config' | 'view' | 'diff' | 'info' | 'docs'>('menu');
  
  // Interactive Block Add input state
  const [blockInput, setBlockInput] = useState<string>('');
  const [submittedBlockId, setSubmittedBlockId] = useState<string | null>(null);
  const [isEnteringId, setIsEnteringId] = useState<boolean>(false);

  // Interactive Block View input state
  const [viewInput, setViewInput] = useState<string>('');
  const [submittedViewId, setSubmittedViewId] = useState<string | null>(null);
  const [isEnteringViewId, setIsEnteringViewId] = useState<boolean>(false);

  // Interactive Block Diff input state
  const [diffInput, setDiffInput] = useState<string>('');
  const [submittedDiffId, setSubmittedDiffId] = useState<string | null>(null);
  const [isEnteringDiffId, setIsEnteringDiffId] = useState<boolean>(false);

  const menuItems = [
    { label: 'Initialize project (init)', value: 'init' },
    { label: 'Add a block (add)', value: 'add' },
    { label: 'View block info (view)', value: 'view' },
    { label: 'Check for updates (diff)', value: 'diff' },
    { label: 'Project info (info)', value: 'info' },
    { label: 'Open docs (docs)', value: 'docs' },
    { label: 'Exit', value: 'exit' },
  ];

  const handleSelect = (item: { value: string }) => {
    if (item.value === 'exit') {
      process.exit(0);
    } else if (item.value === 'add') {
      setIsEnteringId(true);
      setActiveView('add');
    } else if (item.value === 'view') {
      setIsEnteringViewId(true);
      setActiveView('view');
    } else if (item.value === 'diff') {
      setIsEnteringDiffId(true);
      setActiveView('diff');
    } else {
      setActiveView(item.value as any);
    }
  };

  if (activeView === 'init') {
    return <InitFlow onComplete={() => setActiveView('menu')} />;
  }

  if (activeView === 'add') {
    if (isEnteringId) {
      return (
        <Box flexDirection="column" paddingY={1}>
          <Text color={theme.primary}>✦ GwenUI Add Block ✦</Text>
          <Box flexDirection="row" marginTop={1}>
            <Text>Enter block ID (e.g. auth-login): </Text>
            <TextInput
              value={blockInput}
              onChange={setBlockInput}
              onSubmit={(val: string) => {
                const trimmed = val.trim();
                if (trimmed) {
                  setSubmittedBlockId(trimmed);
                } else {
                  setSubmittedBlockId(null);
                }
                setIsEnteringId(false);
              }}
            />
          </Box>
          <Box marginTop={1}>
            <Text color={theme.muted}>Press Enter to submit. Leave empty to browse available blocks.</Text>
          </Box>
        </Box>
      );
    }

    return (
      <AddFlow
        blockId={submittedBlockId || undefined}
        onComplete={() => {
          setSubmittedBlockId(null);
          setBlockInput('');
          setIsEnteringId(false);
          setActiveView('menu');
        }}
      />
    );
  }

  if (activeView === 'view') {
    if (isEnteringViewId) {
      return (
        <Box flexDirection="column" paddingY={1}>
          <Text color={theme.primary}>✦ GwenUI View Block ✦</Text>
          <Box flexDirection="row" marginTop={1}>
            <Text>Enter block ID (e.g. auth-login): </Text>
            <TextInput
              value={viewInput}
              onChange={setViewInput}
              onSubmit={(val: string) => {
                const trimmed = val.trim();
                if (trimmed) {
                  setSubmittedViewId(trimmed);
                } else {
                  setSubmittedViewId(null);
                }
                setIsEnteringViewId(false);
              }}
            />
          </Box>
          <Box marginTop={1}>
            <Text color={theme.muted}>Press Enter to submit. Leave empty to browse available blocks.</Text>
          </Box>
        </Box>
      );
    }

    return (
      <ViewFlow
        blockId={submittedViewId || undefined}
        onComplete={() => {
          setSubmittedViewId(null);
          setViewInput('');
          setIsEnteringViewId(false);
          setActiveView('menu');
        }}
      />
    );
  }

  if (activeView === 'diff') {
    if (isEnteringDiffId) {
      return (
        <Box flexDirection="column" paddingY={1}>
          <Text color={theme.primary}>✦ GwenUI Diff Block ✦</Text>
          <Box flexDirection="row" marginTop={1}>
            <Text>Enter block ID (e.g. auth-login): </Text>
            <TextInput
              value={diffInput}
              onChange={setDiffInput}
              onSubmit={(val: string) => {
                const trimmed = val.trim();
                if (trimmed) {
                  setSubmittedDiffId(trimmed);
                } else {
                  setSubmittedDiffId(null);
                }
                setIsEnteringDiffId(false);
              }}
            />
          </Box>
          <Box marginTop={1}>
            <Text color={theme.muted}>Press Enter to submit. Leave empty to browse installed blocks.</Text>
          </Box>
        </Box>
      );
    }

    return (
      <DiffFlow
        blockId={submittedDiffId || undefined}
        onComplete={() => {
          setSubmittedDiffId(null);
          setDiffInput('');
          setIsEnteringDiffId(false);
          setActiveView('menu');
        }}
      />
    );
  }

  if (activeView === 'info') {
    return <InfoFlow onComplete={() => setActiveView('menu')} />;
  }

  if (activeView === 'docs') {
    return <DocsFlow onComplete={() => setActiveView('menu')} />;
  }

  return (
    <Box flexDirection="column" paddingY={1}>
      {/* Header */}
      <GwenASCII />

      <Box flexDirection="row" marginBottom={1}>
        <Text color={theme.muted}>GwenUI CLI — </Text>
        <Text color={theme.primary}>v{getCliVersion()}</Text>
      </Box>

      <Box marginBottom={1}>
        <Text>What do you want to do?</Text>
      </Box>

      <SelectInput
        items={menuItems}
        onSelect={handleSelect}
      />
    </Box>
  );
};

export default RootMenu;
