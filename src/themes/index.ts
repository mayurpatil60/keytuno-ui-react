import type { ThemeContract, ThemeName } from '../contracts/theme-contract';

import { lightTheme } from './light';
import { darkTheme } from './dark';
import { resolveTheme, themeSubthemeModes } from './subthemes';

export { darkTheme, lightTheme, resolveTheme, themeSubthemeModes };

export const themes: Record<ThemeName, ThemeContract> = {
  dark: darkTheme,
  light: lightTheme,
};

export const themeNames = Object.keys(themes) as ThemeName[];
