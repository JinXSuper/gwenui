#!/usr/bin/env node
import React, { useState } from 'react';
import { render, Box, Text } from 'ink';
import gwenMeow from 'meow';
import TextInputImport from 'ink-text-input';
import { detectGwenuiConflict } from './utils/detectConflict.js';
import ConflictPrompt from './components/ConflictPrompt.js';
import RootMenu from './components/RootMenu.js';
import InitFlow from './commands/init.js';
import AddFlow from './commands/add.js';
import ListFlow from './commands/list.js';
import ViewFlow from './commands/view.js';
import DiffFlow from './commands/diff.js';
import InfoFlow from './commands/info.js';
import DocsFlow from './commands/docs.js';
import { theme } from './theme.js';

const TextInput = (TextInputImport as any).default || TextInputImport;

const cli = gwenMeow(`
  gwenui — GwenUI CLI

  Usage
    $ gwenui <command>

  Commands
    init              Initialize GwenUI in your project
    add <block>       Install a block
    view <block>      Preview block code and dependencies
    diff <block>      Compare local vs registry version
    list              List all available blocks
    info              Show project info and installed blocks
    docs [block]      Open docs in browser

  Options
    --version, -v     Show version
    --help, -h        Show help

  Examples
    $ gwenui init
    $ gwenui add auth-login
    $ gwenui view parallax-hero
    $ gwenui diff auth-login
    $ gwenui docs auth-login
`, {
  importMeta: import.meta,
  flags: {
    help: {
      type: 'boolean',
      shortFlag: 'h'
    },
    version: {
      type: 'boolean',
      shortFlag: 'v'
    }
  }
});

interface MainAppProps {
  command?: string;
  blockId?: string;
}

const MainApp: React.FC<MainAppProps> = ({ command, blockId }) => {
  const [conflictResolved, setConflictResolved] = useState<boolean>(false);
  const conflict = detectGwenuiConflict();
  
  // Interactive prompt states for direct CLI commands without an ID
  const [addInput, setAddInput] = useState<string>('');
  const [enteredAddId, setEnteredAddId] = useState<string | null>(null);

  const [viewInput, setViewInput] = useState<string>('');
  const [enteredViewId, setEnteredViewId] = useState<string | null>(null);

  const [diffInput, setDiffInput] = useState<string>('');
  const [enteredDiffId, setEnteredDiffId] = useState<string | null>(null);

  if (conflict.exists && !conflictResolved) {
    return (
      <ConflictPrompt
        version={conflict.version}
        onConfirm={() => setConflictResolved(true)}
      />
    );
  }

  if (command === 'init') {
    return <InitFlow onComplete={() => process.exit(0)} />;
  }

  if (command === 'list') {
    return <ListFlow onComplete={() => process.exit(0)} />;
  }

  if (command === 'info') {
    return <InfoFlow onComplete={() => process.exit(0)} />;
  }

  if (command === 'docs') {
    return <DocsFlow blockId={blockId} onComplete={() => process.exit(0)} />;
  }

  if (command === 'view') {
    if (!blockId && !enteredViewId) {
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
                  setEnteredViewId(trimmed);
                } else {
                  setEnteredViewId('__browse__');
                }
              }}
            />
          </Box>
          <Box marginTop={1}>
            <Text color={theme.muted}>Press Enter to submit. Leave empty to browse available blocks.</Text>
          </Box>
        </Box>
      );
    }

    const finalBlockId = enteredViewId === '__browse__' ? undefined : (blockId || enteredViewId || undefined);
    return <ViewFlow blockId={finalBlockId} onComplete={() => process.exit(0)} />;
  }

  if (command === 'diff') {
    if (!blockId && !enteredDiffId) {
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
                  setEnteredDiffId(trimmed);
                } else {
                  setEnteredDiffId('__browse__');
                }
              }}
            />
          </Box>
          <Box marginTop={1}>
            <Text color={theme.muted}>Press Enter to submit. Leave empty to browse installed blocks.</Text>
          </Box>
        </Box>
      );
    }

    const finalBlockId = enteredDiffId === '__browse__' ? undefined : (blockId || enteredDiffId || undefined);
    return <DiffFlow blockId={finalBlockId} onComplete={() => process.exit(0)} />;
  }

  if (command === 'add') {
    if (!blockId && !enteredAddId) {
      return (
        <Box flexDirection="column" paddingY={1}>
          <Text color={theme.primary}>✦ GwenUI Add Block ✦</Text>
          <Box flexDirection="row" marginTop={1}>
            <Text>Enter block ID (e.g. auth-login): </Text>
            <TextInput
              value={addInput}
              onChange={setAddInput}
              onSubmit={(val: string) => {
                const trimmed = val.trim();
                if (trimmed) {
                  setEnteredAddId(trimmed);
                } else {
                  setEnteredAddId('__browse__');
                }
              }}
            />
          </Box>
          <Box marginTop={1}>
            <Text color={theme.muted}>Press Enter to submit. Leave empty to browse available blocks.</Text>
          </Box>
        </Box>
      );
    }

    const finalBlockId = enteredAddId === '__browse__' ? undefined : (blockId || enteredAddId || undefined);
    return <AddFlow blockId={finalBlockId} onComplete={() => process.exit(0)} />;
  }

  return <RootMenu />;
};

function main() {
  const command = cli.input[0];
  const blockId = cli.input[1];
  render(<MainApp command={command} blockId={blockId} />);
}

main();
