/**
 * Internal shared utilities for file type detection across FilePreview,
 * FileList, and FileUpload. Not part of the public API.
 */
declare const imageExtensions: Set<string>;
declare const videoExtensions: Set<string>;
declare const audioExtensions: Set<string>;
declare const spreadsheetExtensions: Set<string>;
/**
 * Extracts the lowercased file extension from a filename or URL, stripping
 * query strings and hash fragments. Returns `""` when none can be found.
 */
declare function getLowerFileExtension(fileNameOrUrl: string): string;
/**
 * Extracts the MIME type from a data URL (`data:<mime>;base64,...`).
 * Returns `undefined` when the source is not a data URL or is malformed.
 */
declare function getMimeTypeFromDataUrl(src: string): string | undefined;
/**
 * Returns `true` for relative URLs and absolute URLs using an allow-listed
 * scheme. Rejects `javascript:`, `vbscript:` and other executable schemes.
 */
declare function isSafeUrl(url: string): boolean;
/**
 * Checks a file against an HTML `accept` list (extensions, exact MIME types
 * and `type/*` wildcards). An empty list accepts every file.
 */
declare function matchesAccept(file: {
    name: string;
    type: string;
}, accept: string): boolean;
/**
 * Resolves a human-readable filename from a URL or raw path.
 * Falls back to `"Untitled file"` when no path segment is found.
 */
declare function resolveFileName(source: string): string;

export { audioExtensions, getLowerFileExtension, getMimeTypeFromDataUrl, imageExtensions, isSafeUrl, matchesAccept, resolveFileName, spreadsheetExtensions, videoExtensions };
