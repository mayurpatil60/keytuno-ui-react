import type { ThemeContract, ThemeMode, ThemeName } from '../contracts/theme-contract';

import { darkTheme } from './dark';
import { lightTheme } from './light';

const baseThemes: Record<ThemeName, ThemeContract> = {
  dark: darkTheme,
  light: lightTheme,
};

export function resolveTheme(themeName: ThemeName, mode: ThemeMode = 'default'): ThemeContract {
  return {
    ...baseThemes[themeName],
    mode,
  };
}

export const themeSubthemeModes: ThemeMode[] = ['default'];
