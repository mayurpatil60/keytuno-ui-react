import { ThemeContract } from '../contracts/theme-contract.js';

type CssVariableMap = Record<string, string>;
declare function themeToCssVariables(theme: ThemeContract): CssVariableMap;
declare function selectorToCssBlock(selector: string, variables: CssVariableMap): string;

export { type CssVariableMap, selectorToCssBlock, themeToCssVariables };
