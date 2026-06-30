import { ThemeName, ThemeContract } from '../contracts/theme-contract.js';
export { lightTheme } from './light.js';
export { darkTheme } from './dark.js';
export { resolveTheme, themeSubthemeModes } from './subthemes.js';

declare const themes: Record<ThemeName, ThemeContract>;
declare const themeNames: ThemeName[];

export { themeNames, themes };
