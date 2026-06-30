/**
 * Internal shared utilities for file type detection across FilePreview,
 * FileList, and FileUpload. Not part of the public API.
 */

export const imageExtensions = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "bmp",
  "svg",
  "avif",
  "heic",
  "heif",
]);

export const videoExtensions = new Set([
  "mp4",
  "webm",
  "mov",
  "m4v",
  "ogv",
  "avi",
  "mkv",
]);

export const audioExtensions = new Set([
  "mp3",
  "wav",
  "ogg",
  "aac",
  "m4a",
  "flac",
]);

export const spreadsheetExtensions = new Set(["xlsx", "xls", "csv", "tsv"]);

/**
 * Extracts the lowercased file extension from a filename or URL, stripping
 * query strings and hash fragments. Returns `""` when none can be found.
 */
export function getLowerFileExtension(fileNameOrUrl: string): string {
  const normalized = fileNameOrUrl.toLowerCase();
  const hashIndex = normalized.indexOf("#");
  const queryIndex = normalized.indexOf("?");

  let stripped = normalized;

  if (hashIndex >= 0) {
    stripped = stripped.slice(0, hashIndex);
  }

  if (queryIndex >= 0) {
    stripped = stripped.slice(0, queryIndex);
  }

  const dotIndex = stripped.lastIndexOf(".");

  if (dotIndex <= 0 || dotIndex === stripped.length - 1) {
    return "";
  }

  return stripped.slice(dotIndex + 1);
}

/**
 * Extracts the MIME type from a data URL (`data:<mime>;base64,...`).
 * Returns `undefined` when the source is not a data URL or is malformed.
 */
export function getMimeTypeFromDataUrl(src: string): string | undefined {
  if (!src.startsWith("data:")) {
    return undefined;
  }

  const delimiterIndex = src.indexOf(",");

  if (delimiterIndex <= 5) {
    return undefined;
  }

  const header = src.slice(5, delimiterIndex);
  const semicolonIndex = header.indexOf(";");

  if (semicolonIndex < 0) {
    return header.toLowerCase();
  }

  return header.slice(0, semicolonIndex).toLowerCase();
}

/**
 * Resolves a human-readable filename from a URL or raw path.
 * Falls back to `"Untitled file"` when no path segment is found.
 */
export function resolveFileName(source: string): string {
  try {
    const parsed = new URL(source, "https://preview.local");
    const segments = parsed.pathname
      .split("/")
      .filter((segment) => segment.trim() !== "");

    if (segments.length === 0) {
      return "Untitled file";
    }

    const rawName = segments[segments.length - 1] ?? "Untitled file";

    try {
      return decodeURIComponent(rawName);
    } catch {
      return rawName;
    }
  } catch {
    const segments = source
      .split("/")
      .filter((segment) => segment.trim() !== "");

    if (segments.length === 0) {
      return "Untitled file";
    }

    return segments[segments.length - 1] ?? "Untitled file";
  }
}
