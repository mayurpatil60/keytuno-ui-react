import { ThemeName, ThemeMode, ThemeContract } from '../contracts/theme-contract.js';

declare function resolveTheme(themeName: ThemeName, mode?: ThemeMode): ThemeContract;
declare const themeSubthemeModes: ThemeMode[];

export { resolveTheme, themeSubthemeModes };
