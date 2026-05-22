import React from 'react';
import { Box, Text } from 'ink';
import Gradient from 'ink-gradient';
import Spinner from 'ink-spinner';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const GwenColors = {
  // Primary Gwen Orange
  orange:        "#FF8C42",
  orangeHover:   "#F9A03F",
  orangeDim:     "#FF8C4266",  // 40% opacity approximation (use for muted accents)

  // Violet / Purple (hair gradient end)
  violet:        "#7C3AED",
  violetDim:     "#7C3AED99",
  violetDeep:    "#4C1D95",

  // Background & Surface
  bg:            "#09090B",    // Midnight Zinc
  surface:       "#111113",
  surfaceHover:  "#1C1C1F",

  // Text
  text:          "#FAFAFA",
  textMuted:     "#A1A1AA",
  textDim:       "#71717A",

  // Semantic
  success:       "#22C55E",
  successDim:    "#16A34A",
  warning:       "#F59E0B",
  error:         "#EF4444",
  errorDim:      "#DC2626",
  info:          "#38BDF8",

  // Border
  border:        "#FF8C4233",  // orange @ 20%
  borderSubtle:  "#3F3F46",    // zinc-700

  // Gradient stops (for ink-gradient or manual ANSI)
  gradientStart: "#FF8C42",   // orange
  gradientMid:   "#C26EDD",   // pink-violet bridge
  gradientEnd:   "#7C3AED",   // violet
} as const;

export const GwenTitle = ({ children }: { children: string }) => (
  <Gradient name="cristal">
    <Text bold>{children}</Text>
  </Gradient>
)

export const GwenHeading = ({ children }: { children: React.ReactNode }) => (
  <Text color={GwenColors.orange} bold>{children}</Text>
)

export const GwenSubheading = ({ children }: { children: React.ReactNode }) => (
  <Text color={GwenColors.textMuted}>{children}</Text>
)

export const GwenBody = ({ children }: { children: React.ReactNode }) => (
  <Text color={GwenColors.text}>{children}</Text>
)

export const GwenDim = ({ children }: { children: React.ReactNode }) => (
  <Text color={GwenColors.textDim}>{children}</Text>
)

export const GwenCode = ({ children }: { children: React.ReactNode }) => (
  <Text color={GwenColors.orange} bold>{`\``}{children}{`\``}</Text>
)

export const GwenSuccess = ({ children }: { children: React.ReactNode }) => (
  <Text color={GwenColors.success}>{"✓ "}{children}</Text>
)

export const GwenError = ({ children }: { children: React.ReactNode }) => (
  <Text color={GwenColors.error}>{"✗ "}{children}</Text>
)

export const GwenWarning = ({ children }: { children: React.ReactNode }) => (
  <Text color={GwenColors.warning}>{"⚠ "}{children}</Text>
)

export const GwenInfo = ({ children }: { children: React.ReactNode }) => (
  <Text color={GwenColors.info}>{"ℹ "}{children}</Text>
)

export const GwenPanel = ({ children }: { children: React.ReactNode }) => (
  <Box
    borderStyle="round"
    borderColor={GwenColors.border}
    paddingX={2}
    paddingY={1}
  >
    {children}
  </Box>
)

export const GwenSection = ({ children }: { children: React.ReactNode }) => (
  <Box flexDirection="column" gap={1} marginY={1}>
    {children}
  </Box>
)

export const GwenRow = ({ children, gap = 2, alignItems = 'center' }: { children: React.ReactNode; gap?: number; alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' }) => (
  <Box flexDirection="row" gap={gap} alignItems={alignItems}>
    {children}
  </Box>
)

export const GwenDivider = ({ width = 40 }: { width?: number }) => (
  <Text color={GwenColors.borderSubtle}>{"─".repeat(width)}</Text>
)

export const GwenIndent = ({ children, size = 2 }: { children: React.ReactNode; size?: number }) => (
  <Box paddingLeft={size} flexDirection="column">
    {children}
  </Box>
)

type BadgeVariant = "default" | "success" | "error" | "warning" | "info" | "dim"

const badgeColorMap: Record<BadgeVariant, string> = {
  default:  GwenColors.orange,
  success:  GwenColors.success,
  error:    GwenColors.error,
  warning:  GwenColors.warning,
  info:     GwenColors.info,
  dim:      GwenColors.textDim,
}

export const GwenBadge = ({
  label,
  variant = "default",
}: { label: string; variant?: BadgeVariant }) => (
  <Text color={badgeColorMap[variant]} bold>
    {`[${label}]`}
  </Text>
)

export const GwenSpinner = ({ label = "Loading..." }: { label?: string }) => (
  <GwenRow gap={1}>
    <Text color={GwenColors.orange}>
      <Spinner type="dots" />
    </Text>
    <GwenDim>{label}</GwenDim>
  </GwenRow>
)

// Load ASCII art from adjacent file
const GWEN_ASCII = readFileSync(
  join(__dirname, "../assets/GwenASCII.txt"),
  "utf-8"
)

export const GwenLogo = () => (
  <Box flexDirection="column" marginBottom={1}>
    {GWEN_ASCII.split("\n").map((line: string, i: number) => (
      <Gradient key={i} colors={[GwenColors.gradientStart, GwenColors.gradientMid, GwenColors.gradientEnd]}>
        <Text bold>{line}</Text>
      </Gradient>
    ))}
  </Box>
)

export const GwenPrompt = ({ label, hint }: { label: string; hint?: string }) => (
  <GwenRow gap={1}>
    <Text color={GwenColors.violet} bold>{"›"}</Text>
    <GwenHeading>{label}</GwenHeading>
    {hint && <GwenDim>{`(${hint})`}</GwenDim>}
  </GwenRow>
)

export const GwenHeader = ({ version = "0.1.0" }: { version?: string }) => (
  <Box flexDirection="column" marginBottom={1}>
    <GwenLogo />
    <GwenRow gap={2}>
      <GwenSubheading>GwenUI CLI</GwenSubheading>
      <GwenBadge label={`v${version}`} variant="dim" />
    </GwenRow>
    <GwenDivider width={48} />
  </Box>
)

export const GwenListItem = ({ label, description, selected, focused }: {
  label: string
  description?: string
  selected?: boolean
  focused?: boolean
}) => (
  <Box paddingLeft={1}>
    <GwenRow gap={1}>
      <Text color={focused ? GwenColors.orange : GwenColors.textDim}>
        {focused ? "›" : " "}
      </Text>
      <Text
        color={selected ? GwenColors.success : focused ? GwenColors.text : GwenColors.textMuted}
        bold={focused}
      >
        {selected ? "◉" : "○"} {label}
      </Text>
      {description && <GwenDim>{description}</GwenDim>}
    </GwenRow>
  </Box>
)
