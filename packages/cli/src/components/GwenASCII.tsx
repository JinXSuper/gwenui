import React from 'react';
import { Box, Text } from 'ink';
import chalk from 'chalk';

const ascii = [
  " ██████╗ ██╗    ██╗███████╗███╗   ██╗██╗   ██╗██╗",
  "██╔════╝ ██║    ██║██╔════╝████╗  ██║██║   ██║██║",
  "██║  ███╗██║ █╗ ██║█████╗  ██╔██╗ ██║██║   ██║██║",
  "██║   ██║██║███╗██║██╔══╝  ██║╚██╗██║██║   ██║██║",
  "╚██████╔╝╚███╔███╔╝███████╗██║ ╚████║╚██████╔╝██║",
  " ╚═════╝  ╚══╝╚══╝ ╚══════╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝"
];

const gradientColors = ['#FF512F', '#b03cf3', '#a54804'];

function hexToRgb(hex: string) {
  const num = parseInt(hex.replace('#', ''), 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1);
}

function interpolateColor(colorA: string, colorB: string, factor: number) {
  const rgbA = hexToRgb(colorA);
  const rgbB = hexToRgb(colorB);
  const r = rgbA.r + factor * (rgbB.r - rgbA.r);
  const g = rgbA.g + factor * (rgbB.g - rgbA.g);
  const b = rgbA.b + factor * (rgbB.b - rgbA.b);
  return rgbToHex(r, g, b);
}

function getGradientColor(index: number, total: number, colors: string[]) {
  if (total <= 1) return colors[0];
  const segment = 1 / (colors.length - 1);
  const factor = index / (total - 1);
  const colorIndex = Math.min(Math.floor(factor / segment), colors.length - 2);
  const segmentFactor = (factor - colorIndex * segment) / segment;
  return interpolateColor(colors[colorIndex], colors[colorIndex + 1], segmentFactor);
}

export const GwenASCII: React.FC = () => {
  const coloredLines = ascii.map((line) => {
    let coloredLine = '';
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const color = getGradientColor(i, line.length, gradientColors);
      coloredLine += chalk.hex(color)(char);
    }
    return coloredLine;
  });

  return (
    <Box flexDirection="column" marginBottom={1}>
      {coloredLines.map((line, i) => (
        <Text key={i}>{line}</Text>
      ))}
    </Box>
  );
};

export default GwenASCII;
