import {
  useEffect,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import {
  FiFile,
  FiFileText,
  FiFilm,
  FiImage,
  FiMusic,
  FiTrash2,
} from "./icons/feather";

import { Badge, type BadgeProps } from "./Badge";
import { Button } from "./Button";
import {
  audioExtensions,
  getLowerFileExtension,
  imageExtensions,
  spreadsheetExtensions,
  videoExtensions,
} from "./_file-utils";
import { FilePreview, type FilePreviewType } from "./FilePreview";
import { Tooltip } from "./Tooltip";

export type FileListSize = "xs" | "sm" | "md" | "lg";
export type FileListVariant = "compact" | "detailed" | "advanced";

export interface FileListItem {
  id: string;
  name: string;
  src: string;
  sizeBytes?: number;
  sizeLabel?: string;
  width?: number;
  height?: number;
  mimeType?: string;
  type?: FilePreviewType;
  thumbnailSrc?: string;
  description?: ReactNode;
  disabled?: boolean;
}

export interface FileListProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  files?: FileListItem[];
  variant?: FileListVariant;
  size?: FileListSize;
  disabled?: boolean;
  emptyText?: ReactNode;
  showRemoveAction?: boolean;
  showSize?: boolean;
  showDimensions?: boolean;
  showMimeType?: boolean;
  showBytes?: boolean;
  compactChipProps?: Omit<BadgeProps, "children">;
  virtualized?: boolean;
  virtualizedMaxHeight?: CSSProperties["maxHeight"];
  virtualizedEstimateSize?: number;
  virtualizedOverscan?: number;
  onRemove?: (file: FileListItem, index: number) => void;
}

type FileListSizeTokens = {
  itemPadding: string;
  itemGap: string;
  itemRadius: string;
  thumbnailBoxSize: string;
  thumbnailIconSize: number;
  titleFontSize: string;
  metaFontSize: string;
  descriptionFontSize: string;
  removeButtonSize: "xs" | "sm" | "md" | "lg";
  removeIconSize: number;
};

const baseClasses = "flex w-full min-w-0 flex-col";
const DEFAULT_VIRTUAL_ESTIMATE: Record<FileListSize, number> = {
  xs: 66,
  sm: 74,
  md: 84,
  lg: 96,
};

const sizeTokens: Record<FileListSize, FileListSizeTokens> = {
  xs: {
    itemPadding: "0.32rem 0.42rem",
    itemGap: "0.36rem",
    itemRadius: "0.5rem",
    thumbnailBoxSize: "1.9rem",
    thumbnailIconSize: 11,
    titleFontSize: "0.72rem",
    metaFontSize: "0.66rem",
    descriptionFontSize: "0.64rem",
    removeButtonSize: "xs",
    removeIconSize: 12,
  },
  sm: {
    itemPadding: "0.38rem 0.5rem",
    itemGap: "0.42rem",
    itemRadius: "0.54rem",
    thumbnailBoxSize: "2.15rem",
    thumbnailIconSize: 12,
    titleFontSize: "0.78rem",
    metaFontSize: "0.7rem",
    descriptionFontSize: "0.68rem",
    removeButtonSize: "sm",
    removeIconSize: 13,
  },
  md: {
    itemPadding: "0.44rem 0.58rem",
    itemGap: "0.48rem",
    itemRadius: "0.58rem",
    thumbnailBoxSize: "2.45rem",
    thumbnailIconSize: 13,
    titleFontSize: "0.84rem",
    metaFontSize: "0.74rem",
    descriptionFontSize: "0.72rem",
    removeButtonSize: "md",
    removeIconSize: 14,
  },
  lg: {
    itemPadding: "0.52rem 0.68rem",
    itemGap: "0.56rem",
    itemRadius: "0.64rem",
    thumbnailBoxSize: "2.8rem",
    thumbnailIconSize: 14,
    titleFontSize: "0.9rem",
    metaFontSize: "0.8rem",
    descriptionFontSize: "0.76rem",
    removeButtonSize: "lg",
    removeIconSize: 15,
  },
};

type FileListVisualType =
  | "image"
  | "video"
  | "audio"
  | "pdf"
  | "spreadsheet"
  | "file";

function isFinitePositiveNumber(value: number | undefined): value is number {
  return value != null && Number.isFinite(value) && value > 0;
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes)) {
    return "";
  }

  if (bytes < 1024) {
    return `${Math.round(bytes)} B`;
  }

  const units = ["KB", "MB", "GB", "TB", "PB"];
  let value = bytes;
  let unitIndex = -1;

  do {
    value /= 1024;
    unitIndex += 1;
  } while (value >= 1024 && unitIndex < units.length - 1);

  const rounded = value >= 10 ? value.toFixed(1) : value.toFixed(2);
  return `${rounded} ${units[unitIndex] ?? "B"}`;
}

function toTypeLabel(file: FileListItem): string {
  const extension = getLowerFileExtension(file.name || file.src);

  if (extension !== "") {
    return extension.toUpperCase();
  }

  if (typeof file.mimeType === "string" && file.mimeType.trim() !== "") {
    const normalizedMimeType = file.mimeType.trim().toLowerCase();
    const slashIndex = normalizedMimeType.indexOf("/");

    if (slashIndex >= 0 && slashIndex < normalizedMimeType.length - 1) {
      return normalizedMimeType.slice(slashIndex + 1).toUpperCase();
    }

    return normalizedMimeType.toUpperCase();
  }

  if (file.type != null && file.type !== "auto") {
    return file.type.toUpperCase();
  }

  return "FILE";
}

function resolveDimensionsLabel(file: FileListItem): string | null {
  if (
    !isFinitePositiveNumber(file.width) ||
    !isFinitePositiveNumber(file.height)
  ) {
    return null;
  }

  return `${Math.round(file.width)} x ${Math.round(file.height)} px`;
}

function toPreviewSize(size: FileListSize): "xs" | "sm" | "md" | "lg" {
  if (size === "xs") {
    return "xs";
  }

  if (size === "sm") {
    return "sm";
  }

  if (size === "lg") {
    return "lg";
  }

  return "md";
}

function toBadgeSize(size: FileListSize): "xs" | "sm" | "md" | "lg" {
  if (size === "xs") {
    return "xs";
  }

  if (size === "sm") {
    return "sm";
  }

  if (size === "lg") {
    return "lg";
  }

  return "md";
}

function resolveVisualType(file: FileListItem): FileListVisualType {
  if (file.type === "image") {
    return "image";
  }

  if (file.type === "video") {
    return "video";
  }

  if (file.type === "audio") {
    return "audio";
  }

  if (file.type === "pdf") {
    return "pdf";
  }

  const normalizedMimeType = file.mimeType?.toLowerCase().trim() ?? "";

  if (normalizedMimeType.startsWith("image/")) {
    return "image";
  }

  if (normalizedMimeType.startsWith("video/")) {
    return "video";
  }

  if (normalizedMimeType.startsWith("audio/")) {
    return "audio";
  }

  if (normalizedMimeType.includes("pdf")) {
    return "pdf";
  }

  if (
    normalizedMimeType.includes("csv") ||
    normalizedMimeType.includes("spreadsheet") ||
    normalizedMimeType.includes("excel")
  ) {
    return "spreadsheet";
  }

  const extension = getLowerFileExtension(file.name || file.src);

  if (imageExtensions.has(extension)) {
    return "image";
  }

  if (videoExtensions.has(extension)) {
    return "video";
  }

  if (audioExtensions.has(extension)) {
    return "audio";
  }

  if (extension === "pdf") {
    return "pdf";
  }

  if (spreadsheetExtensions.has(extension)) {
    return "spreadsheet";
  }

  return "file";
}

function renderThumbnailIcon(
  type: FileListVisualType,
  iconSize: number,
): ReactNode {
  if (type === "image") {
    return <FiImage size={iconSize} />;
  }

  if (type === "video") {
    return <FiFilm size={iconSize} />;
  }

  if (type === "audio") {
    return <FiMusic size={iconSize} />;
  }

  if (type === "pdf" || type === "spreadsheet") {
    return <FiFileText size={iconSize} />;
  }

  return <FiFile size={iconSize} />;
}

export function FileList({
  files = [],
  variant = "detailed",
  size = "md",
  disabled = false,
  emptyText = "No files available.",
  showRemoveAction = true,
  showSize = true,
  showDimensions = true,
  showMimeType = true,
  showBytes = true,
  compactChipProps,
  virtualized = false,
  virtualizedMaxHeight = "24rem",
  virtualizedEstimateSize,
  virtualizedOverscan = 8,
  onRemove,
  className = "",
  style,
  ...props
}: FileListProps): JSX.Element {
  const sizeToken = sizeTokens[size];
  const badgeSize = toBadgeSize(size);
  const isCompact = variant === "compact";
  const shouldVirtualize = virtualized && !isCompact;
  const listViewportRef = useRef<HTMLDivElement | null>(null);
  const resolvedEstimateSize =
    virtualizedEstimateSize ?? DEFAULT_VIRTUAL_ESTIMATE[size];

  const virtualizer = useVirtualizer({
    count: files.length,
    getScrollElement: () => (shouldVirtualize ? listViewportRef.current : null),
    estimateSize: () => resolvedEstimateSize,
    overscan: virtualizedOverscan,
    getItemKey: (index) => {
      const file = files[index];

      if (file == null) {
        return index;
      }

      return `${file.id}-${index}`;
    },
    measureElement: (element) => {
      if (element == null) {
        return resolvedEstimateSize;
      }

      return element.getBoundingClientRect().height;
    },
  });

  useEffect(() => {
    if (!shouldVirtualize) {
      return;
    }

    virtualizer.measure();
  }, [
    shouldVirtualize,
    files.length,
    size,
    variant,
    showRemoveAction,
    showSize,
    showDimensions,
    showMimeType,
    showBytes,
    virtualizer,
  ]);

  const {
    variant: compactChipVariant,
    varient: compactChipLegacyVariant,
    size: compactChipSize,
    className: compactChipClassName,
    style: compactChipCustomStyle,
    ...compactChipRestProps
  } = compactChipProps ?? {};

  const itemGap = isCompact
    ? size === "xs"
      ? "0.34rem"
      : size === "sm"
        ? "0.4rem"
        : size === "lg"
          ? "0.58rem"
          : "0.46rem"
    : size === "xs"
      ? "0.36rem"
      : size === "sm"
        ? "0.42rem"
        : size === "lg"
          ? "0.6rem"
          : "0.5rem";

  const rootStyle: CSSProperties = {
    width: "100%",
    minWidth: 0,
    display: "flex",
    flexDirection: isCompact ? "row" : "column",
    flexWrap: isCompact ? "wrap" : undefined,
    alignItems: isCompact ? "center" : undefined,
    gap: shouldVirtualize ? undefined : itemGap,
    boxSizing: "border-box",
    ...style,
  };

  const emptyStyle: CSSProperties = {
    margin: 0,
    padding: sizeToken.itemPadding,
    fontSize: sizeToken.metaFontSize,
    color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    borderWidth: "1px",
    borderStyle: "dashed",
    borderColor: "var(--ktn-border-muted)",
    borderRadius: sizeToken.itemRadius,
    backgroundColor:
      "color-mix(in srgb, var(--ktn-bg-muted, #f3f4f6) 42%, transparent)",
  };

  const composedClassName = `${baseClasses} ${className}`.trim();

  if (files.length === 0) {
    return (
      <div className={composedClassName} style={rootStyle} {...props}>
        <p style={emptyStyle}>{emptyText}</p>
      </div>
    );
  }

  function renderCompactItem(file: FileListItem, index: number): JSX.Element {
    const itemDisabled = disabled || file.disabled === true;
    const hasRemoveHandler = typeof onRemove === "function";

    const compactChipWrapStyle: CSSProperties = {
      minWidth: 0,
      display: "inline-flex",
      alignItems: "center",
      gap:
        size === "xs"
          ? "0.22rem"
          : size === "sm"
            ? "0.24rem"
            : size === "lg"
              ? "0.3rem"
              : "0.26rem",
      opacity: itemDisabled ? 0.64 : 1,
    };

    const compactChipContainerStyle: CSSProperties = {
      maxWidth: "min(100%, 18.5rem)",
      opacity: itemDisabled ? 0.86 : 1,
      ...compactChipCustomStyle,
    };

    const compactChipLinkStyle: CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      margin: 0,
      gap: 0,
      lineHeight: 1,
      textDecoration: "none",
      maxWidth: "100%",
      color: "inherit",
      minWidth: 0,
      width: "100%",
    };

    const compactChipTextStyle: CSSProperties = {
      display: "inline-block",
      maxWidth: "100%",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      fontWeight: 500,
    };

    const compactRemoveDisabled = itemDisabled || !hasRemoveHandler;
    const compactRemoveIconSize = Math.max(9, sizeToken.removeIconSize - 4);

    const compactRemoveButtonStyle: CSSProperties = {
      border: 0,
      background: "transparent",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      margin: 0,
      width:
        size === "xs"
          ? "0.74rem"
          : size === "sm"
            ? "0.8rem"
            : size === "lg"
              ? "0.9rem"
              : "0.84rem",
      height:
        size === "xs"
          ? "0.74rem"
          : size === "sm"
            ? "0.8rem"
            : size === "lg"
              ? "0.9rem"
              : "0.84rem",
      borderRadius: "999px",
      color: "var(--ktn-action-danger-bg, #dc2626)",
      cursor: compactRemoveDisabled ? "not-allowed" : "pointer",
      opacity: compactRemoveDisabled ? 0.48 : 0.86,
      lineHeight: 0,
      flexShrink: 0,
    };

    return (
      <div key={file.id} style={compactChipWrapStyle}>
        <Badge
          {...compactChipRestProps}
          size={compactChipSize ?? badgeSize}
          variant={
            compactChipVariant ??
            compactChipLegacyVariant ??
            (itemDisabled ? "ghost" : "secondary")
          }
          className={compactChipClassName}
          style={compactChipContainerStyle}
        >
          <Tooltip
            label={file.name}
            size="xs"
            side="top"
            disabled={file.name.trim() === ""}
            style={{ minWidth: 0, maxWidth: "14.5rem", width: "100%" }}
          >
            <FilePreview
              asLink
              src={file.src}
              name={file.name}
              size={toPreviewSize(size)}
              type={file.type ?? "auto"}
              mimeType={file.mimeType}
              thumbnailSrc={file.thumbnailSrc}
              disabled={itemDisabled}
              showLinkIcons={false}
              linkButtonStyle={compactChipLinkStyle}
              linkLabel={<span style={compactChipTextStyle}>{file.name}</span>}
              style={{ width: "100%", minWidth: 0, maxWidth: "100%" }}
            />
          </Tooltip>

          {showRemoveAction ? (
            <button
              type="button"
              disabled={compactRemoveDisabled}
              aria-label={`Remove ${file.name}`}
              title={`Remove ${file.name}`}
              style={compactRemoveButtonStyle}
              onClick={() => {
                if (compactRemoveDisabled) {
                  return;
                }

                onRemove?.(file, index);
              }}
            >
              <FiTrash2 size={compactRemoveIconSize} />
            </button>
          ) : null}
        </Badge>
      </div>
    );
  }

  function renderDetailedItem(file: FileListItem, index: number): JSX.Element {
    const itemDisabled = disabled || file.disabled === true;
    const hasRemoveHandler = typeof onRemove === "function";
    const visualType = resolveVisualType(file);
    const thumbnailImageSource =
      visualType === "image" ? (file.thumbnailSrc ?? file.src) : undefined;

    const rowStyle: CSSProperties = {
      width: "100%",
      minWidth: 0,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: sizeToken.itemGap,
      padding: sizeToken.itemPadding,
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "var(--ktn-border-muted)",
      borderRadius: sizeToken.itemRadius,
      backgroundColor:
        "color-mix(in srgb, var(--ktn-bg-surface, #ffffff) 92%, var(--ktn-bg-muted, #f3f4f6))",
      boxSizing: "border-box",
      opacity: itemDisabled ? 0.64 : 1,
    };

    const leftColumnStyle: CSSProperties = {
      minWidth: 0,
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "0.24rem",
    };

    const contentWrapStyle: CSSProperties = {
      minWidth: 0,
      flex: 1,
      display: "flex",
      alignItems: "flex-start",
      gap: sizeToken.itemGap,
    };

    const thumbnailBoxStyle: CSSProperties = {
      width: sizeToken.thumbnailBoxSize,
      height: sizeToken.thumbnailBoxSize,
      minWidth: sizeToken.thumbnailBoxSize,
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor:
        "color-mix(in srgb, var(--ktn-border-muted) 88%, transparent)",
      borderRadius: `calc(${sizeToken.itemRadius} - 0.08rem)`,
      backgroundColor:
        visualType === "image"
          ? "color-mix(in srgb, var(--ktn-bg-muted, #f3f4f6) 74%, transparent)"
          : "color-mix(in srgb, var(--ktn-bg-muted, #f3f4f6) 84%, transparent)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
      flexShrink: 0,
    };

    const thumbnailTriggerStyle: CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      margin: 0,
      gap: 0,
      lineHeight: 0,
      textDecoration: "none",
      maxWidth: "none",
      color: "inherit",
    };

    const metaParts: string[] = [];

    if (showSize) {
      const resolvedSize =
        typeof file.sizeLabel === "string" && file.sizeLabel.trim() !== ""
          ? file.sizeLabel.trim()
          : isFinitePositiveNumber(file.sizeBytes)
            ? formatBytes(file.sizeBytes)
            : null;

      if (resolvedSize != null) {
        metaParts.push(resolvedSize);
      }
    }

    if (showDimensions) {
      const dimensionLabel = resolveDimensionsLabel(file);

      if (dimensionLabel != null) {
        metaParts.push(dimensionLabel);
      }
    }

    if (
      variant === "advanced" &&
      showBytes &&
      isFinitePositiveNumber(file.sizeBytes)
    ) {
      metaParts.push(
        `${Math.round(file.sizeBytes).toLocaleString("en-US")} bytes`,
      );
    }

    if (variant === "advanced" && showMimeType) {
      if (typeof file.mimeType === "string" && file.mimeType.trim() !== "") {
        metaParts.push(file.mimeType.trim());
      } else {
        metaParts.push(toTypeLabel(file));
      }
    }

    const metaLine = metaParts.join(" • ");

    const metaStyle: CSSProperties = {
      margin: 0,
      fontSize: sizeToken.metaFontSize,
      lineHeight: 1.35,
      color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
      whiteSpace: "normal",
      overflowWrap: "anywhere",
    };

    const descriptionStyle: CSSProperties = {
      margin: 0,
      fontSize: sizeToken.descriptionFontSize,
      lineHeight: 1.35,
      color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
      whiteSpace: "normal",
      overflowWrap: "anywhere",
    };

    return (
      <div key={file.id} style={rowStyle}>
        <div style={contentWrapStyle}>
          <FilePreview
            asLink
            src={file.src}
            name={file.name}
            size={toPreviewSize(size)}
            type={file.type ?? "auto"}
            mimeType={file.mimeType}
            thumbnailSrc={file.thumbnailSrc}
            disabled={itemDisabled}
            showLinkIcons={false}
            linkButtonStyle={thumbnailTriggerStyle}
            linkLabel={
              <span style={thumbnailBoxStyle}>
                {thumbnailImageSource != null ? (
                  <img
                    src={thumbnailImageSource}
                    alt=""
                    aria-hidden
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <span
                    aria-hidden
                    style={{ display: "inline-flex", lineHeight: 0 }}
                  >
                    {renderThumbnailIcon(
                      visualType,
                      sizeToken.thumbnailIconSize,
                    )}
                  </span>
                )}
              </span>
            }
          />

          <div style={leftColumnStyle}>
            <Tooltip
              label={file.name}
              size="xs"
              side="top"
              disabled={file.name.trim() === ""}
              style={{ width: "100%", minWidth: 0 }}
            >
              <FilePreview
                asLink
                src={file.src}
                name={file.name}
                linkLabel={file.name}
                size={toPreviewSize(size)}
                type={file.type ?? "auto"}
                mimeType={file.mimeType}
                thumbnailSrc={file.thumbnailSrc}
                disabled={itemDisabled}
                showLinkIcons={false}
                linkButtonStyle={{
                  width: "100%",
                  minWidth: 0,
                  maxWidth: "100%",
                  justifyContent: "flex-start",
                  textAlign: "left",
                }}
                style={{
                  width: "100%",
                  minWidth: 0,
                  fontSize: sizeToken.titleFontSize,
                }}
              />
            </Tooltip>

            {metaLine !== "" ? <p style={metaStyle}>{metaLine}</p> : null}

            {file.description != null ? (
              <p style={descriptionStyle}>{file.description}</p>
            ) : null}
          </div>
        </div>

        {showRemoveAction ? (
          <Button
            type="button"
            size={sizeToken.removeButtonSize}
            variant="outline"
            compact
            iconOnly
            iconOnlyTone
            disabled={itemDisabled || !hasRemoveHandler}
            aria-label={`Remove ${file.name}`}
            tooltip={`Remove ${file.name}`}
            tooltipSide="left"
            tooltipSize="xs"
            iconColor="var(--ktn-action-danger-bg, #dc2626)"
            style={{ borderRadius: "999px", flexShrink: 0 }}
            onClick={() => {
              onRemove?.(file, index);
            }}
          >
            <FiTrash2 size={sizeToken.removeIconSize} />
          </Button>
        ) : null}
      </div>
    );
  }

  if (isCompact) {
    return (
      <div className={composedClassName} style={rootStyle} {...props}>
        {files.map((file, index) => renderCompactItem(file, index))}
      </div>
    );
  }

  if (shouldVirtualize) {
    return (
      <div className={composedClassName} style={rootStyle} {...props}>
        <div
          ref={listViewportRef}
          role="presentation"
          style={{
            position: "relative",
            width: "100%",
            minWidth: 0,
            maxHeight: virtualizedMaxHeight,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <div
            role="presentation"
            style={{
              position: "relative",
              width: "100%",
              minWidth: 0,
              height: `${virtualizer.getTotalSize()}px`,
            }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const file = files[virtualRow.index];

              if (file == null) {
                return null;
              }

              return (
                <div
                  key={virtualRow.key}
                  role="presentation"
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    boxSizing: "border-box",
                    paddingBottom:
                      virtualRow.index < files.length - 1 ? itemGap : undefined,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {renderDetailedItem(file, virtualRow.index)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={composedClassName} style={rootStyle} {...props}>
      {files.map((file, index) => renderDetailedItem(file, index))}
    </div>
  );
}
