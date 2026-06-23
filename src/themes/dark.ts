import type { PrimitiveTokens, ThemeContract } from '../contracts/theme-contract';
import { basePrimitiveTokens } from '../tokens/primitives';
import { createSemanticColors } from '../tokens/semantic';

const darkPrimitives: PrimitiveTokens = {
  ...basePrimitiveTokens,
  colors: {
    ...basePrimitiveTokens.colors,
    slate50: '#252526',
    slate100: '#2d2d30',
    slate300: '#3c3c3c',
    slate500: '#6a6a6a',
    slate600: '#9da0a4',
    slate700: '#b8b8b8',
    slate800: '#c6c6c6',
    slate900: '#cccccc',
    blue600: '#0e639c',
  },
};

export const darkTheme: ThemeContract = {
  name: 'dark',
  mode: 'default',
  primitives: darkPrimitives,
  semantic: {
    colors: createSemanticColors(darkPrimitives.colors, {
      backgroundDefault: '#202123',
      backgroundSurface: '#2a2c30',
      backgroundMuted: '#32343a',
      textPrimary: '#d4d4d4',
      textSecondary: '#a8abb0',
      borderMuted: '#3c3c3c',
      actionPrimaryBackground: '#0e639c',
      actionPrimaryForeground: '#ffffff',
    }),
  },
};
