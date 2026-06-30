import { PrimitiveColorTokens, SemanticColorTokens } from '../contracts/theme-contract.js';

declare function createSemanticColors(palette: PrimitiveColorTokens, overrides?: Partial<SemanticColorTokens>): SemanticColorTokens;

export { createSemanticColors };
