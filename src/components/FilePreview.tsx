import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type WheelEvent as ReactWheelEvent,
} from "react";

import {
  FiExternalLink,
  FiFile,
  FiFileText,
  FiFilm,
  FiImage,
  FiLink2,
  FiMusic,
  FiX,
} from "./icons/feather";

import {
  audioExtensions,
  getLowerFileExtension,
  getMimeTypeFromDataUrl,
  imageExtensions,
  resolveFileName,
  spreadsheetExtensions,
  videoExtensions,
} from "./_file-utils";
import { Button } from "./Button";
import { Dialog } from "./Dialog";

export type FilePreviewSize = "xs" | "sm" | "md" | "lg";
export type FilePreviewType =
  | "auto"
  | "image"
  | "pdf"
  | "video"
  | "audio"
  | "file";

type ResolvedFilePreviewType = Exclude<FilePreviewType, "auto">;

type FilePreviewSizeTokens = {
  width: string;
  thumbnailHeight: string;
  titleFontSize: string;
  descriptionFontSize: string;
  iconSize: number;
};

type PointerPoint = {
  x: number;
  y: number;
};

type DragState = {
  startX: number;
  startY: number;
  startOffsetX: number;
  startOffsetY: number;
};

type PinchState = {
  distance: number;
  midpoint: PointerPoint;
};

export interface FilePreviewProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  src: string;
  name?: string;
  description?: ReactNode;
  size?: FilePreviewSize;
  type?: FilePreviewType;
  mimeType?: string;
  thumbnailSrc?: string;
  disabled?: boolean;
  asLink?: boolean;
  linkLabel?: ReactNode;
  showLinkIcons?: boolean;
  linkButtonStyle?: CSSProperties;
  previewAriaLabelFormatter?: (fileName: string) => string;
  closeButtonLabel?: string;
  openInNewTabLabel?: ReactNode;
  typeDescriptionFormatter?: (typeLabel: string) => ReactNode;
  imageInteractionHint?: ReactNode;
  defaultInteractionHint?: ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

const sizeTokens: Record<FilePreviewSize, FilePreviewSizeTokens> = {
  xs: {
    width: "6.8rem",
    thumbnailHeight: "4.15rem",
    titleFontSize: "0.68rem",
    descriptionFontSize: "0.62rem",
    iconSize: 12,
  },
  sm: {
    width: "8rem",
    thumbnailHeight: "4.9rem",
    titleFontSize: "0.72rem",
    descriptionFontSize: "0.66rem",
    iconSize: 13,
  },
  md: {
    width: "9.4rem",
    thumbnailHeight: "5.8rem",
    titleFontSize: "0.76rem",
    descriptionFontSize: "0.69rem",
    iconSize: 14,
  },
  lg: {
    width: "11rem",
    thumbnailHeight: "6.8rem",
    titleFontSize: "0.8rem",
    descriptionFontSize: "0.72rem",
    iconSize: 16,
  },
};

const MIN_IMAGE_SCALE = 1;
const MAX_IMAGE_SCALE = 8;

const baseClasses = "inline-flex min-w-0";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getDistance(first: PointerPoint, second: PointerPoint): number {
  const dx = second.x - first.x;
  const dy = second.y - first.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function getMidpoint(first: PointerPoint, second: PointerPoint): PointerPoint {
  return {
    x: (first.x + second.x) / 2,
    y: (first.y + second.y) / 2,
  };
}

function resolvePreviewType(
  requestedType: FilePreviewType,
  source: string,
  explicitMimeType: string | undefined,
  resolvedName: string,
): ResolvedFilePreviewType {
  if (requestedType !== "auto") {
    return requestedType;
  }

  const normalizedMime =
    explicitMimeType?.toLowerCase().trim() ??
    getMimeTypeFromDataUrl(source) ??
    "";

  if (normalizedMime.startsWith("image/")) {
    return "image";
  }

  if (normalizedMime.includes("pdf")) {
    return "pdf";
  }

  if (normalizedMime.startsWith("video/")) {
    return "video";
  }

  if (normalizedMime.startsWith("audio/")) {
    return "audio";
  }

  const extension = getLowerFileExtension(resolvedName || source);

  if (imageExtensions.has(extension)) {
    return "image";
  }

  if (extension === "pdf") {
    return "pdf";
  }

  if (videoExtensions.has(extension)) {
    return "video";
  }

  if (audioExtensions.has(extension)) {
    return "audio";
  }

  if (spreadsheetExtensions.has(extension)) {
    return "file";
  }

  return "file";
}

function formatTypeLabel(
  type: ResolvedFilePreviewType,
  extension: string,
): string {
  if (type === "pdf") {
    return "PDF";
  }

  if (type === "file") {
    if (extension === "xlsx") {
      return "XLSX";
    }

    if (extension === "xls") {
      return "XLS";
    }

    if (extension === "csv") {
      return "CSV";
    }

    if (extension === "tsv") {
      return "TSV";
    }
  }

  return type.toUpperCase();
}

function toButtonSize(size: FilePreviewSize): "xs" | "sm" | "md" | "lg" {
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

function renderTypeIcon(
  type: ResolvedFilePreviewType,
  iconSize: number,
  extension: string,
): ReactNode {
  if (type === "image") {
    return <FiImage size={iconSize} />;
  }

  if (type === "pdf") {
    return <FiFileText size={iconSize} />;
  }

  if (type === "video") {
    return <FiFilm size={iconSize} />;
  }

  if (type === "audio") {
    return <FiMusic size={iconSize} />;
  }

  if (type === "file" && spreadsheetExtensions.has(extension)) {
    return <FiFileText size={iconSize} />;
  }

  return <FiFile size={iconSize} />;
}

function canRenderFullscreenPreview(type: ResolvedFilePreviewType): boolean {
  return type === "image" || type === "video" || type === "audio";
}

export function FilePreview({
  src,
  name,
  description,
  size = "md",
  type = "auto",
  mimeType,
  thumbnailSrc,
  disabled = false,
  asLink = false,
  linkLabel,
  showLinkIcons = true,
  linkButtonStyle,
  previewAriaLabelFormatter = (resolvedFileName) =>
    `Preview ${resolvedFileName}`,
  closeButtonLabel = "Close preview",
  openInNewTabLabel = "Open in New Tab",
  typeDescriptionFormatter = (resolvedTypeLabel) =>
    `Type: ${resolvedTypeLabel}`,
  imageInteractionHint = "Use mouse wheel, touchpad pinch, or touch pinch to zoom. Drag to pan. Double-click to toggle quick zoom.",
  defaultInteractionHint = "Press Escape or click outside to close this preview.",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = "",
  style,
  ...props
}: FilePreviewProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [imageScale, setImageScale] = useState(MIN_IMAGE_SCALE);
  const [imageOffsetX, setImageOffsetX] = useState(0);
  const [imageOffsetY, setImageOffsetY] = useState(0);

  const imageScaleRef = useRef(MIN_IMAGE_SCALE);
  const imageOffsetRef = useRef<PointerPoint>({ x: 0, y: 0 });
  const imageViewportRef = useRef<HTMLDivElement | null>(null);
  const activePointersRef = useRef<Map<number, PointerPoint>>(new Map());
  const dragStateRef = useRef<DragState | null>(null);
  const pinchStateRef = useRef<PinchState | null>(null);

  const sizeToken = sizeTokens[size];
  const fileName = useMemo(
    () => (name != null && name.trim() !== "" ? name : resolveFileName(src)),
    [name, src],
  );
  const resolvedType = useMemo(
    () => resolvePreviewType(type, src, mimeType, fileName),
    [fileName, mimeType, src, type],
  );
  const fileExtension = useMemo(
    () => getLowerFileExtension(fileName || src),
    [fileName, src],
  );
  const supportsFullscreenPreview = canRenderFullscreenPreview(resolvedType);
  const typeLabel = formatTypeLabel(resolvedType, fileExtension);
  const triggerThumbnailSource =
    thumbnailSrc ?? (resolvedType === "image" ? src : undefined);
  const previewAriaLabel = previewAriaLabelFormatter(fileName);
  const typeDescription = typeDescriptionFormatter(typeLabel);

  function setImageTransform(
    nextScale: number,
    nextOffsetX: number,
    nextOffsetY: number,
  ): void {
    imageScaleRef.current = nextScale;
    imageOffsetRef.current = {
      x: nextOffsetX,
      y: nextOffsetY,
    };

    setImageScale(nextScale);
    setImageOffsetX(nextOffsetX);
    setImageOffsetY(nextOffsetY);
  }

  function clearPointerState(): void {
    activePointersRef.current.clear();
    dragStateRef.current = null;
    pinchStateRef.current = null;
  }

  function resetImageTransform(): void {
    setImageTransform(MIN_IMAGE_SCALE, 0, 0);
    clearPointerState();
  }

  useEffect(() => {
    if (isOpen && resolvedType === "image") {
      resetImageTransform();
    }

    if (!isOpen) {
      clearPointerState();
    }
  }, [isOpen, resolvedType, src]);

  function zoomToClientPoint(
    nextScale: number,
    clientX: number,
    clientY: number,
  ): void {
    const viewportElement = imageViewportRef.current;

    if (viewportElement == null) {
      return;
    }

    const viewportRect = viewportElement.getBoundingClientRect();
    const pointX = clientX - viewportRect.left - viewportRect.width / 2;
    const pointY = clientY - viewportRect.top - viewportRect.height / 2;
    const currentScale = imageScaleRef.current;

    if (currentScale <= 0) {
      return;
    }

    const scaleRatio = nextScale / currentScale;

    // Keep the zoom anchor under the pointer while scaling.
    const nextOffsetX =
      pointX - (pointX - imageOffsetRef.current.x) * scaleRatio;
    const nextOffsetY =
      pointY - (pointY - imageOffsetRef.current.y) * scaleRatio;

    setImageTransform(nextScale, nextOffsetX, nextOffsetY);
  }

  function handleImageWheel(event: ReactWheelEvent<HTMLDivElement>): void {
    event.preventDefault();

    const intensity = event.ctrlKey ? 0.007 : 0.0025;
    const scaleFactor = Math.exp(-event.deltaY * intensity);
    const nextScale = clamp(
      imageScaleRef.current * scaleFactor,
      MIN_IMAGE_SCALE,
      MAX_IMAGE_SCALE,
    );

    if (nextScale === imageScaleRef.current) {
      return;
    }

    zoomToClientPoint(nextScale, event.clientX, event.clientY);
  }

  function handleImagePointerDown(
    event: ReactPointerEvent<HTMLDivElement>,
  ): void {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);

    activePointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (activePointersRef.current.size >= 2) {
      const points = Array.from(activePointersRef.current.values());
      const first = points[0];
      const second = points[1];

      if (first != null && second != null) {
        pinchStateRef.current = {
          distance: getDistance(first, second),
          midpoint: getMidpoint(first, second),
        };
      }

      dragStateRef.current = null;
      return;
    }

    const canDragImage = imageScaleRef.current > MIN_IMAGE_SCALE + 0.001;

    if (canDragImage) {
      dragStateRef.current = {
        startX: event.clientX,
        startY: event.clientY,
        startOffsetX: imageOffsetRef.current.x,
        startOffsetY: imageOffsetRef.current.y,
      };
    }
  }

  function handleImagePointerMove(
    event: ReactPointerEvent<HTMLDivElement>,
  ): void {
    const activePointers = activePointersRef.current;

    if (!activePointers.has(event.pointerId)) {
      return;
    }

    activePointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (activePointers.size >= 2) {
      const points = Array.from(activePointers.values());
      const first = points[0];
      const second = points[1];

      if (first == null || second == null) {
        return;
      }

      const distance = getDistance(first, second);
      const midpoint = getMidpoint(first, second);
      const previousPinchState = pinchStateRef.current;

      if (
        previousPinchState != null &&
        previousPinchState.distance > 0 &&
        distance > 0
      ) {
        const nextScale = clamp(
          imageScaleRef.current * (distance / previousPinchState.distance),
          MIN_IMAGE_SCALE,
          MAX_IMAGE_SCALE,
        );

        if (nextScale !== imageScaleRef.current) {
          zoomToClientPoint(nextScale, midpoint.x, midpoint.y);
        }

        const nextOffsetX =
          imageOffsetRef.current.x +
          (midpoint.x - previousPinchState.midpoint.x);
        const nextOffsetY =
          imageOffsetRef.current.y +
          (midpoint.y - previousPinchState.midpoint.y);

        setImageTransform(imageScaleRef.current, nextOffsetX, nextOffsetY);
      }

      pinchStateRef.current = {
        distance,
        midpoint,
      };

      dragStateRef.current = null;
      return;
    }

    if (dragStateRef.current == null) {
      return;
    }

    const nextOffsetX =
      dragStateRef.current.startOffsetX +
      (event.clientX - dragStateRef.current.startX);
    const nextOffsetY =
      dragStateRef.current.startOffsetY +
      (event.clientY - dragStateRef.current.startY);

    setImageTransform(imageScaleRef.current, nextOffsetX, nextOffsetY);
  }

  function handleImagePointerRelease(
    event: ReactPointerEvent<HTMLDivElement>,
  ): void {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const activePointers = activePointersRef.current;
    activePointers.delete(event.pointerId);

    if (activePointers.size < 2) {
      pinchStateRef.current = null;
    }

    if (
      activePointers.size === 1 &&
      imageScaleRef.current > MIN_IMAGE_SCALE + 0.001
    ) {
      const remainingPointer = Array.from(activePointers.values())[0];

      if (remainingPointer != null) {
        dragStateRef.current = {
          startX: remainingPointer.x,
          startY: remainingPointer.y,
          startOffsetX: imageOffsetRef.current.x,
          startOffsetY: imageOffsetRef.current.y,
        };

        return;
      }
    }

    dragStateRef.current = null;
  }

  function handleImageDoubleClick(
    event: ReactMouseEvent<HTMLDivElement>,
  ): void {
    if (imageScaleRef.current > 1.4) {
      resetImageTransform();
      return;
    }

    zoomToClientPoint(2, event.clientX, event.clientY);
  }

  function openInNewTab(): void {
    if (typeof window !== "undefined") {
      window.open(src, "_blank", "noopener,noreferrer");
    }
  }

  function renderPreviewViewport(): ReactNode {
    if (resolvedType === "image") {
      return (
        <div
          ref={imageViewportRef}
          style={previewInteractionSurfaceStyle}
          onWheel={handleImageWheel}
          onPointerDown={handleImagePointerDown}
          onPointerMove={handleImagePointerMove}
          onPointerUp={handleImagePointerRelease}
          onPointerCancel={handleImagePointerRelease}
          onDoubleClick={handleImageDoubleClick}
        >
          <img
            src={src}
            alt={fileName}
            draggable={false}
            style={{
              maxWidth: "none",
              maxHeight: "none",
              transformOrigin: "center center",
              transform: `translate3d(${imageOffsetX}px, ${imageOffsetY}px, 0) scale(${imageScale})`,
              transition:
                activePointersRef.current.size > 0
                  ? "none"
                  : "transform 120ms cubic-bezier(0.22, 1, 0.36, 1)",
              width: "min(92vw, 1200px)",
              height: "auto",
              objectFit: "contain",
              userSelect: "none",
              pointerEvents: "none",
            }}
          />
        </div>
      );
    }

    if (resolvedType === "pdf") {
      return (
        <iframe
          title={`Preview ${fileName}`}
          src={src}
          style={{
            width: "100%",
            height: "100%",
            border: 0,
            backgroundColor: "var(--ktn-bg-surface, #ffffff)",
            borderRadius: "0.5rem",
          }}
        />
      );
    }

    if (resolvedType === "video") {
      return (
        <video
          controls
          preload="metadata"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            backgroundColor: "#000000",
            borderRadius: "0.5rem",
          }}
          src={src}
        />
      );
    }

    if (resolvedType === "audio") {
      return (
        <div style={audioWrapStyle}>
          <div style={fileFallbackIconWrapStyle}>
            {renderTypeIcon(resolvedType, 34, fileExtension)}
          </div>

          <audio
            controls
            preload="metadata"
            src={src}
            style={{ width: "min(640px, 100%)" }}
          />
        </div>
      );
    }

    return (
      <div style={fileFallbackWrapStyle}>
        <div style={fileFallbackIconWrapStyle}>
          {renderTypeIcon(resolvedType, 38, fileExtension)}
        </div>

        <p style={fileFallbackTextStyle}>
          In-app rendering is not available for this file type yet. Open it in a
          new tab.
        </p>

        <Button size="sm" variant="primary" onClick={openInNewTab}>
          Open File
          <FiExternalLink size={14} />
        </Button>
      </div>
    );
  }

  const rootStyle: CSSProperties = {
    display: "inline-flex",
    minWidth: 0,
    ...style,
  };

  const triggerCardStyle: CSSProperties = {
    width: sizeToken.width,
    maxWidth: "100%",
    minWidth: 0,
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: "0.32rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "var(--ktn-border-muted)",
    borderRadius: "var(--ktn-radius-lg, 0.7rem)",
    backgroundColor: "var(--ktn-bg-surface, #ffffff)",
    color: "var(--ktn-text-primary)",
    padding: "0.32rem",
    textAlign: "left",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.58 : 1,
    transition:
      "border-color 120ms ease, box-shadow 120ms ease, transform 120ms ease",
  };

  const triggerLinkStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    border: 0,
    backgroundColor: "transparent",
    color: disabled
      ? "var(--ktn-text-secondary, var(--ktn-text-primary))"
      : "var(--ktn-action-primary-bg, #2563eb)",
    textDecoration: "underline",
    textUnderlineOffset: "0.17rem",
    textDecorationThickness: "1px",
    padding: 0,
    margin: 0,
    fontSize: sizeToken.titleFontSize,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.58 : 1,
    maxWidth: "min(100%, 20rem)",
  };

  const thumbnailStyle: CSSProperties = {
    width: "100%",
    height: sizeToken.thumbnailHeight,
    minHeight: sizeToken.thumbnailHeight,
    borderRadius: "calc(var(--ktn-radius-lg, 0.7rem) - 0.2rem)",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "color-mix(in srgb, var(--ktn-border-muted) 85%, transparent)",
    overflow: "hidden",
    position: "relative",
    backgroundColor:
      "color-mix(in srgb, var(--ktn-bg-muted, #f3f4f6) 82%, var(--ktn-bg-surface, #ffffff))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const typeBadgeStyle: CSSProperties = {
    position: "absolute",
    insetInlineEnd: "0.28rem",
    insetBlockStart: "0.28rem",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    paddingInline: "0.35rem",
    height: "1.05rem",
    borderRadius: "999px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "color-mix(in srgb, var(--ktn-border-muted) 92%, transparent)",
    backgroundColor:
      "color-mix(in srgb, var(--ktn-bg-surface, #ffffff) 88%, transparent)",
    color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    fontSize: "0.56rem",
    fontWeight: 600,
    letterSpacing: "0.03em",
  };

  const triggerInfoWrapStyle: CSSProperties = {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0.2rem",
  };

  const triggerTitleStyle: CSSProperties = {
    margin: 0,
    fontSize: sizeToken.titleFontSize,
    lineHeight: 1.35,
    color: "var(--ktn-text-primary)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const triggerDescriptionStyle: CSSProperties = {
    margin: 0,
    fontSize: sizeToken.descriptionFontSize,
    lineHeight: 1.35,
    color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  };

  const previewShellStyle: CSSProperties = {
    pointerEvents: "auto",
    width: "calc(100vw - 1.5rem)",
    height: "calc(100vh - 1.5rem)",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "var(--ktn-border-muted)",
    borderRadius: "var(--ktn-radius-lg, 0.75rem)",
    backgroundColor: "var(--ktn-bg-surface, #ffffff)",
    color: "var(--ktn-text-primary)",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 28px 60px rgba(15, 23, 42, 0.32)",
    overflow: "hidden",
  };

  const previewHeaderStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.65rem",
    padding: "0.65rem 0.8rem",
    borderBottom:
      "1px solid color-mix(in srgb, var(--ktn-border-muted) 92%, transparent)",
    backgroundColor: "var(--ktn-bg-surface, #ffffff)",
  };

  const previewHeaderInfoStyle: CSSProperties = {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0.12rem",
  };

  const previewTitleStyle: CSSProperties = {
    margin: 0,
    fontSize: "0.95rem",
    lineHeight: 1.3,
    color: "var(--ktn-text-primary)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "min(58vw, 56rem)",
  };

  const previewSubtitleStyle: CSSProperties = {
    margin: 0,
    fontSize: "0.74rem",
    lineHeight: 1.35,
    color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
  };

  const previewHeaderActionsStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    flexShrink: 0,
  };

  const previewViewportStyle: CSSProperties = {
    position: "relative",
    flex: 1,
    minHeight: 0,
    width: "100%",
    padding: "0.6rem",
    boxSizing: "border-box",
    backgroundColor:
      resolvedType === "image" || resolvedType === "video"
        ? "color-mix(in srgb, #0b1220 88%, #1f2937)"
        : "color-mix(in srgb, var(--ktn-bg-muted, #f3f4f6) 78%, var(--ktn-bg-surface, #ffffff))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  };

  const previewFooterStyle: CSSProperties = {
    margin: 0,
    padding: "0.52rem 0.8rem 0.62rem",
    fontSize: "0.74rem",
    lineHeight: 1.35,
    color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    borderTop:
      "1px solid color-mix(in srgb, var(--ktn-border-muted) 92%, transparent)",
    backgroundColor: "var(--ktn-bg-surface, #ffffff)",
  };

  function handleTriggerClick(): void {
    if (!supportsFullscreenPreview) {
      openInNewTab();
    }
  }

  const triggerNode = asLink ? (
    <button
      type="button"
      style={{
        ...triggerLinkStyle,
        ...linkButtonStyle,
      }}
      disabled={disabled}
      aria-label={previewAriaLabel}
      onClick={handleTriggerClick}
    >
      {showLinkIcons ? (
        <span aria-hidden style={{ display: "inline-flex", lineHeight: 0 }}>
          {renderTypeIcon(
            resolvedType,
            Math.max(13, sizeToken.iconSize - 1),
            fileExtension,
          )}
        </span>
      ) : null}

      <span
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          minWidth: 0,
        }}
      >
        {linkLabel ?? fileName}
      </span>

      {showLinkIcons ? (
        <span aria-hidden style={{ display: "inline-flex", lineHeight: 0 }}>
          <FiLink2 size={Math.max(13, sizeToken.iconSize - 1)} />
        </span>
      ) : null}
    </button>
  ) : (
    <button
      type="button"
      style={triggerCardStyle}
      disabled={disabled}
      aria-label={previewAriaLabel}
      onClick={handleTriggerClick}
    >
      <span style={thumbnailStyle}>
        {triggerThumbnailSource != null ? (
          <img
            src={triggerThumbnailSource}
            alt={fileName}
            style={{
              width: "100%",
              height: "100%",
              objectFit: resolvedType === "image" ? "cover" : "contain",
              display: "block",
            }}
          />
        ) : (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
              width: "100%",
              height: "100%",
            }}
          >
            {renderTypeIcon(
              resolvedType,
              sizeToken.iconSize + 6,
              fileExtension,
            )}
          </span>
        )}

        <span style={typeBadgeStyle}>{typeLabel}</span>
      </span>

      <span style={triggerInfoWrapStyle}>
        <span style={triggerTitleStyle}>{fileName}</span>

        {description != null ? (
          <span style={triggerDescriptionStyle}>{description}</span>
        ) : null}
      </span>
    </button>
  );

  const interactionHint =
    resolvedType === "image" ? imageInteractionHint : defaultInteractionHint;

  const composedClassName = `${baseClasses} ${className}`.trim();

  if (!supportsFullscreenPreview) {
    return (
      <div className={composedClassName} style={rootStyle} {...props}>
        {triggerNode}
      </div>
    );
  }

  return (
    <div className={composedClassName} style={rootStyle} {...props}>
      <Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
        trigger={triggerNode}
        disabled={disabled}
        closeOnOverlayClick={closeOnOverlayClick}
        closeOnEscape={closeOnEscape}
        size="lg"
        variant="ghost"
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label={previewAriaLabel}
          style={previewShellStyle}
        >
          <div style={previewHeaderStyle}>
            <div style={previewHeaderInfoStyle}>
              <p style={previewTitleStyle}>{fileName}</p>
              <p style={previewSubtitleStyle}>{typeDescription}</p>
            </div>

            <div style={previewHeaderActionsStyle}>
              <Button
                size={toButtonSize(size)}
                variant="outline"
                onClick={openInNewTab}
              >
                {openInNewTabLabel}
                <FiExternalLink size={14} />
              </Button>

              <Button
                size={toButtonSize(size)}
                variant="ghost"
                iconOnly
                aria-label={closeButtonLabel}
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                <FiX size={15} />
              </Button>
            </div>
          </div>

          <div style={previewViewportStyle}>{renderPreviewViewport()}</div>

          <p style={previewFooterStyle}>{interactionHint}</p>
        </div>
      </Dialog>
    </div>
  );
}

const previewInteractionSurfaceStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  borderRadius: "0.5rem",
  touchAction: "none",
  userSelect: "none",
  cursor: "grab",
};

const audioWrapStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
};

const fileFallbackWrapStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.9rem",
  padding: "1rem",
  boxSizing: "border-box",
};

const fileFallbackIconWrapStyle: CSSProperties = {
  width: "4.25rem",
  height: "4.25rem",
  borderRadius: "999px",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "color-mix(in srgb, var(--ktn-border-muted) 88%, transparent)",
  backgroundColor:
    "color-mix(in srgb, var(--ktn-bg-surface, #ffffff) 90%, transparent)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
};

const fileFallbackTextStyle: CSSProperties = {
  margin: 0,
  maxWidth: "38rem",
  textAlign: "center",
  fontSize: "0.84rem",
  color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
};
