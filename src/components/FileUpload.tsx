import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type DragEvent as ReactDragEvent,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import { FiUploadCloud } from 'react-icons/fi';

import { Button, type ButtonProps } from './Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  type DialogProps,
} from './Dialog';
import { FileList, type FileListItem } from './FileList';
import type { FilePreviewType } from './FilePreview';
import { Tooltip } from './Tooltip';

export type FileUploadVariant = 'compact' | 'dropzone';
export type FileUploadSize = 'xs' | 'sm' | 'md' | 'lg';

export interface FileUploadFile {
  id: string;
  file: File;
  name: string;
  src: string;
  sizeBytes: number;
  mimeType?: string;
  extension: string;
  previewType: FilePreviewType;
  width?: number;
  height?: number;
}

export interface FileUploadProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'onChange'
> {
  variant?: FileUploadVariant;
  varient?: FileUploadVariant;
  size?: FileUploadSize;
  disabled?: boolean;
  multiple?: boolean;
  accept?: string;
  placeholder?: ReactNode;
  dropzoneHint?: ReactNode;
  browseLabel?: ReactNode;
  onFilesChange?: (files: FileUploadFile[]) => void;
  browseButtonProps?: Omit<ButtonProps, 'children' | 'onClick' | 'disabled' | 'size' | 'type'>;
  dialogProps?: Pick<
    DialogProps,
    'size' | 'variant' | 'varient' | 'closeOnEscape' | 'closeOnOverlayClick'
  >;
}

type FileUploadSizeTokens = {
  compactMinHeight: string;
  compactFontSize: string;
  compactPadding: string;
  compactGap: string;
  compactRadius: string;
  compactNameMaxWidth: string;
  browseButtonSize: 'xs' | 'sm' | 'md' | 'lg';
  dropzonePadding: string;
  dropzoneRadius: string;
  dropzoneTitleFontSize: string;
  dropzoneHintFontSize: string;
  dropzoneIconSize: number;
  cardGap: string;
};

const imageExtensions = new Set([
  'jpg',
  'jpeg',
  'png',
  'gif',
  'webp',
  'bmp',
  'svg',
  'avif',
  'heic',
  'heif',
]);

const videoExtensions = new Set(['mp4', 'webm', 'mov', 'm4v', 'ogv', 'avi', 'mkv']);

const audioExtensions = new Set(['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac']);

const sizeTokens: Record<FileUploadSize, FileUploadSizeTokens> = {
  xs: {
    compactMinHeight: '1.9rem',
    compactFontSize: '0.72rem',
    compactPadding: '0.12rem 0.28rem',
    compactGap: '0.26rem',
    compactRadius: '0.5rem',
    compactNameMaxWidth: '10.5rem',
    browseButtonSize: 'xs',
    dropzonePadding: '0.5rem',
    dropzoneRadius: '0.5rem',
    dropzoneTitleFontSize: '0.7rem',
    dropzoneHintFontSize: '0.62rem',
    dropzoneIconSize: 12,
    cardGap: '0.36rem',
  },
  sm: {
    compactMinHeight: '2.1rem',
    compactFontSize: '0.78rem',
    compactPadding: '0.14rem 0.32rem',
    compactGap: '0.3rem',
    compactRadius: '0.56rem',
    compactNameMaxWidth: '12.2rem',
    browseButtonSize: 'sm',
    dropzonePadding: '0.58rem',
    dropzoneRadius: '0.56rem',
    dropzoneTitleFontSize: '0.76rem',
    dropzoneHintFontSize: '0.66rem',
    dropzoneIconSize: 13,
    cardGap: '0.4rem',
  },
  md: {
    compactMinHeight: '2.35rem',
    compactFontSize: '0.84rem',
    compactPadding: '0.16rem 0.36rem',
    compactGap: '0.34rem',
    compactRadius: '0.62rem',
    compactNameMaxWidth: '14rem',
    browseButtonSize: 'md',
    dropzonePadding: '0.66rem',
    dropzoneRadius: '0.62rem',
    dropzoneTitleFontSize: '0.82rem',
    dropzoneHintFontSize: '0.7rem',
    dropzoneIconSize: 14,
    cardGap: '0.46rem',
  },
  lg: {
    compactMinHeight: '2.6rem',
    compactFontSize: '0.9rem',
    compactPadding: '0.18rem 0.4rem',
    compactGap: '0.38rem',
    compactRadius: '0.72rem',
    compactNameMaxWidth: '15.8rem',
    browseButtonSize: 'lg',
    dropzonePadding: '0.78rem',
    dropzoneRadius: '0.72rem',
    dropzoneTitleFontSize: '0.88rem',
    dropzoneHintFontSize: '0.76rem',
    dropzoneIconSize: 15,
    cardGap: '0.52rem',
  },
};

const baseClasses = 'flex w-full min-w-0 flex-col';

function getLowerFileExtension(fileNameOrUrl: string): string {
  const normalized = fileNameOrUrl.toLowerCase();
  const hashIndex = normalized.indexOf('#');
  const queryIndex = normalized.indexOf('?');

  let stripped = normalized;

  if (hashIndex >= 0) {
    stripped = stripped.slice(0, hashIndex);
  }

  if (queryIndex >= 0) {
    stripped = stripped.slice(0, queryIndex);
  }

  const dotIndex = stripped.lastIndexOf('.');

  if (dotIndex <= 0 || dotIndex === stripped.length - 1) {
    return '';
  }

  return stripped.slice(dotIndex + 1);
}

function toDropzoneBrowseButtonSize(size: FileUploadSize): 'xs' | 'sm' | 'md' {
  if (size === 'xs' || size === 'sm') {
    return 'xs';
  }

  if (size === 'lg') {
    return 'md';
  }

  return 'sm';
}

function resolvePreviewType(mimeType: string | undefined, extension: string): FilePreviewType {
  const normalizedMimeType = mimeType?.toLowerCase().trim() ?? '';

  if (normalizedMimeType.startsWith('image/')) {
    return 'image';
  }

  if (normalizedMimeType.includes('pdf')) {
    return 'pdf';
  }

  if (normalizedMimeType.startsWith('video/')) {
    return 'video';
  }

  if (normalizedMimeType.startsWith('audio/')) {
    return 'audio';
  }

  if (imageExtensions.has(extension)) {
    return 'image';
  }

  if (extension === 'pdf') {
    return 'pdf';
  }

  if (videoExtensions.has(extension)) {
    return 'video';
  }

  if (audioExtensions.has(extension)) {
    return 'audio';
  }

  return 'file';
}

function createFileUploadId(file: File): string {
  return `fup-${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`;
}

function revokeItemObjectUrl(item: FileUploadFile): void {
  if (!item.src.startsWith('blob:')) {
    return;
  }

  if (typeof URL === 'undefined' || typeof URL.revokeObjectURL !== 'function') {
    return;
  }

  try {
    URL.revokeObjectURL(item.src);
  } catch {
    // Ignore URL revocation failures from already released URLs.
  }
}

export function FileUpload({
  variant,
  varient,
  size = 'md',
  disabled = false,
  multiple = false,
  accept,
  placeholder,
  dropzoneHint,
  browseLabel = 'Upload',
  onFilesChange,
  browseButtonProps,
  dialogProps,
  className = '',
  style,
  ...props
}: FileUploadProps): JSX.Element {
  const resolvedVariant = variant ?? varient ?? 'compact';
  const isCompact = resolvedVariant === 'compact';
  const sizeToken = sizeTokens[size];
  const inputId = useId();

  const [files, setFiles] = useState<FileUploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const filesRef = useRef<FileUploadFile[]>([]);

  const {
    className: browseButtonClassName,
    style: browseButtonStyle,
    ...browseButtonRestProps
  } = browseButtonProps ?? {};

  const {
    size: dialogSize = 'lg',
    variant: dialogVariant,
    varient: dialogLegacyVariant,
    closeOnEscape = true,
    closeOnOverlayClick = true,
  } = dialogProps ?? {};

  const resolvedDialogVariant = dialogVariant ?? dialogLegacyVariant ?? 'outline';

  const compactPlaceholder =
    placeholder ?? (multiple ? 'Upload files to continue.' : 'Upload a file to continue.');

  const resolvedDropzoneHint =
    dropzoneHint ?? 'Drag and drop files here, or use Browse to pick files.';

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    return () => {
      filesRef.current.forEach((file) => {
        revokeItemObjectUrl(file);
      });
    };
  }, []);

  useEffect(() => {
    if (files.length === 0 && isDialogOpen) {
      setIsDialogOpen(false);
    }
  }, [files.length, isDialogOpen]);

  function updateFiles(
    updater: (currentFiles: FileUploadFile[]) => FileUploadFile[],
    revokeRemoved = false,
  ): void {
    setFiles((currentFiles) => {
      const nextFiles = updater(currentFiles);

      if (revokeRemoved) {
        const nextFileIds = new Set(nextFiles.map((file) => file.id));

        currentFiles.forEach((file) => {
          if (!nextFileIds.has(file.id)) {
            revokeItemObjectUrl(file);
          }
        });
      }

      filesRef.current = nextFiles;
      onFilesChange?.(nextFiles);
      return nextFiles;
    });
  }

  function updateFileDimensions(fileId: string, width: number, height: number): void {
    setFiles((currentFiles) => {
      const targetIndex = currentFiles.findIndex((file) => file.id === fileId);

      if (targetIndex < 0) {
        return currentFiles;
      }

      const targetFile = currentFiles[targetIndex];

      if (targetFile == null || (targetFile.width === width && targetFile.height === height)) {
        return currentFiles;
      }

      const nextFiles = [...currentFiles];
      nextFiles[targetIndex] = {
        ...targetFile,
        width,
        height,
      };

      filesRef.current = nextFiles;
      onFilesChange?.(nextFiles);

      return nextFiles;
    });
  }

  function createUploadFiles(selectedFiles: File[]): FileUploadFile[] {
    return selectedFiles.map((file) => {
      const extension = getLowerFileExtension(file.name);
      const src = URL.createObjectURL(file);

      return {
        id: createFileUploadId(file),
        file,
        name: file.name,
        src,
        sizeBytes: file.size,
        mimeType: file.type.trim() !== '' ? file.type : undefined,
        extension,
        previewType: resolvePreviewType(file.type, extension),
      };
    });
  }

  function hydrateImageDimensions(nextFiles: FileUploadFile[]): void {
    if (typeof Image === 'undefined') {
      return;
    }

    nextFiles.forEach((file) => {
      if (file.previewType !== 'image') {
        return;
      }

      const image = new Image();

      image.onload = () => {
        updateFileDimensions(file.id, image.naturalWidth, image.naturalHeight);
      };

      image.onerror = () => {
        // Ignore image metadata extraction errors for unsupported blobs.
      };

      image.src = file.src;
    });
  }

  function addFiles(fileList: FileList | null): void {
    if (disabled || fileList == null) {
      return;
    }

    const selectedFiles = Array.from(fileList);

    if (selectedFiles.length === 0) {
      return;
    }

    const acceptedFiles = multiple ? selectedFiles : [selectedFiles[0] as File];
    const nextUploadFiles = createUploadFiles(acceptedFiles);

    if (multiple) {
      updateFiles((currentFiles) => [...currentFiles, ...nextUploadFiles]);
    } else {
      updateFiles(() => nextUploadFiles, true);
    }

    hydrateImageDimensions(nextUploadFiles);
  }

  function openFilePicker(): void {
    if (disabled) {
      return;
    }

    inputRef.current?.click();
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    addFiles(event.target.files);
    event.target.value = '';
  }

  function handleDropzoneDragOver(event: ReactDragEvent<HTMLDivElement>): void {
    event.preventDefault();

    if (!disabled) {
      setIsDragging(true);
    }
  }

  function handleDropzoneDragLeave(event: ReactDragEvent<HTMLDivElement>): void {
    event.preventDefault();

    if (disabled) {
      return;
    }

    const relatedTarget = event.relatedTarget as Node | null;

    if (relatedTarget == null || !event.currentTarget.contains(relatedTarget)) {
      setIsDragging(false);
    }
  }

  function handleDropzoneDrop(event: ReactDragEvent<HTMLDivElement>): void {
    event.preventDefault();
    setIsDragging(false);

    if (disabled) {
      return;
    }

    addFiles(event.dataTransfer?.files ?? null);
  }

  function removeFile(fileId: string): void {
    updateFiles((currentFiles) => currentFiles.filter((file) => file.id !== fileId), true);
  }

  const fileListItems: FileListItem[] = files.map((file) => ({
    id: file.id,
    name: file.name,
    src: file.src,
    sizeBytes: file.sizeBytes,
    width: file.width,
    height: file.height,
    mimeType: file.mimeType,
    type: file.previewType,
    thumbnailSrc: file.previewType === 'image' ? file.src : undefined,
    disabled,
  }));

  const rootStyle: CSSProperties = {
    width: '100%',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: isCompact ? '0.45rem' : sizeToken.cardGap,
    boxSizing: 'border-box',
    ...style,
  };

  const compactShellStyle: CSSProperties = {
    width: '100%',
    minWidth: 0,
    minHeight: sizeToken.compactMinHeight,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--ktn-border-muted)',
    borderRadius: sizeToken.compactRadius,
    backgroundColor: 'var(--ktn-bg-surface, #ffffff)',
    padding: sizeToken.compactPadding,
    display: 'flex',
    alignItems: 'center',
    gap: sizeToken.compactGap,
    boxSizing: 'border-box',
    opacity: disabled ? 0.62 : 1,
  };

  const compactSummaryWrapStyle: CSSProperties = {
    minWidth: 0,
    flex: 1,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.38rem',
    fontSize: sizeToken.compactFontSize,
    lineHeight: 1.25,
    color: 'var(--ktn-text-primary)',
    overflow: 'hidden',
  };

  const compactPlaceholderStyle: CSSProperties = {
    color: 'var(--ktn-text-secondary, var(--ktn-text-primary))',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const compactNameButtonStyle: CSSProperties = {
    border: 0,
    backgroundColor: 'transparent',
    color: disabled
      ? 'var(--ktn-text-secondary, var(--ktn-text-primary))'
      : 'var(--ktn-action-primary-bg, #2563eb)',
    textDecoration: 'underline',
    textUnderlineOffset: '0.14em',
    padding: 0,
    margin: 0,
    cursor: disabled ? 'not-allowed' : 'pointer',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: `min(100%, ${sizeToken.compactNameMaxWidth})`,
    minWidth: 0,
    flexShrink: 1,
    fontSize: sizeToken.compactFontSize,
    lineHeight: 1.2,
  };

  const compactCountButtonStyle: CSSProperties = {
    border: 0,
    backgroundColor: 'transparent',
    color: disabled
      ? 'var(--ktn-text-secondary, var(--ktn-text-primary))'
      : 'var(--ktn-action-primary-bg, #2563eb)',
    padding: 0,
    margin: 0,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: sizeToken.compactFontSize,
    lineHeight: 1.2,
    fontWeight: 600,
    flexShrink: 0,
  };

  const dropzoneSurfaceStyle: CSSProperties = {
    width: '100%',
    minWidth: 0,
    borderWidth: '1px',
    borderStyle: 'dashed',
    borderColor: isDragging ? 'var(--ktn-action-primary-bg, #2563eb)' : 'var(--ktn-border-muted)',
    borderRadius: sizeToken.dropzoneRadius,
    padding: sizeToken.dropzonePadding,
    display: 'flex',
    flexDirection: 'column',
    gap: sizeToken.cardGap,
    boxSizing: 'border-box',
    backgroundColor: isDragging
      ? 'color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 10%, transparent)'
      : 'color-mix(in srgb, var(--ktn-bg-muted, #f3f4f6) 44%, transparent)',
    opacity: disabled ? 0.62 : 1,
  };

  const dropzoneHeaderStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.6rem',
    minWidth: 0,
  };

  const dropzoneHeaderMainStyle: CSSProperties = {
    minWidth: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '0.52rem',
  };

  const dropzoneTitleStyle: CSSProperties = {
    margin: 0,
    fontSize: sizeToken.dropzoneTitleFontSize,
    lineHeight: 1.25,
    color: 'var(--ktn-text-primary)',
    fontWeight: 600,
  };

  const dropzoneHintStyle: CSSProperties = {
    margin: 0,
    fontSize: sizeToken.dropzoneHintFontSize,
    lineHeight: 1.35,
    color: 'var(--ktn-text-secondary, var(--ktn-text-primary))',
  };

  const dropzoneFileListWrapStyle: CSSProperties = {
    width: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
  };

  const composedClassName = `${baseClasses} ${className}`.trim();

  const firstFile = files[0];
  const hiddenFilesCount = files.length > 1 ? files.length - 1 : 0;

  const compactSummaryNode =
    files.length === 0 ? (
      <span style={compactPlaceholderStyle}>{compactPlaceholder}</span>
    ) : (
      <>
        <Tooltip
          label={firstFile?.name ?? ''}
          size="xs"
          side="top"
          disabled={firstFile == null || firstFile.name.trim() === ''}
          style={{ minWidth: 0, maxWidth: '100%' }}
        >
          <button
            type="button"
            style={compactNameButtonStyle}
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                setIsDialogOpen(true);
              }
            }}
          >
            {firstFile?.name}
          </button>
        </Tooltip>

        {hiddenFilesCount > 0 ? (
          <button
            type="button"
            style={compactCountButtonStyle}
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                setIsDialogOpen(true);
              }
            }}
          >
            {`+${hiddenFilesCount}`}
          </button>
        ) : null}
      </>
    );

  const compactDialogNode = (
    <Dialog
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      size={dialogSize}
      variant={resolvedDialogVariant}
      disabled={disabled}
      closeOnEscape={closeOnEscape}
      closeOnOverlayClick={closeOnOverlayClick}
    >
      <DialogContent showCloseButton scrollable maxContentHeight="70vh">
        <DialogHeader>
          <DialogTitle>Uploaded Files</DialogTitle>
          <DialogDescription>
            Click filename or thumbnail to open preview. Use the trash action to remove files.
          </DialogDescription>
        </DialogHeader>

        <div style={{ marginTop: '0.15rem' }}>
          <FileList
            files={fileListItems}
            variant="detailed"
            size={size}
            disabled={disabled}
            showRemoveAction
            showSize
            showDimensions
            showMimeType={false}
            showBytes={false}
            onRemove={(fileToRemove) => {
              removeFile(fileToRemove.id);
            }}
            emptyText="No files uploaded yet."
          />
        </div>
      </DialogContent>
    </Dialog>
  );

  const hiddenInputNode = (
    <input
      id={`${inputId}-input`}
      ref={inputRef}
      type="file"
      multiple={multiple}
      accept={accept}
      disabled={disabled}
      style={{ display: 'none' }}
      onChange={handleInputChange}
    />
  );

  if (isCompact) {
    return (
      <div className={composedClassName} style={rootStyle} {...props}>
        <div style={compactShellStyle}>
          <div style={compactSummaryWrapStyle}>{compactSummaryNode}</div>

          <Button
            type="button"
            size={sizeToken.browseButtonSize}
            variant="outline"
            compact
            disabled={disabled}
            className={browseButtonClassName}
            style={browseButtonStyle}
            onClick={openFilePicker}
            {...browseButtonRestProps}
          >
            {browseLabel}
          </Button>
        </div>

        {compactDialogNode}
        {hiddenInputNode}
      </div>
    );
  }

  return (
    <div className={composedClassName} style={rootStyle} {...props}>
      <div
        style={dropzoneSurfaceStyle}
        onDragOver={handleDropzoneDragOver}
        onDragLeave={handleDropzoneDragLeave}
        onDrop={handleDropzoneDrop}
      >
        <div style={dropzoneHeaderStyle}>
          <div style={dropzoneHeaderMainStyle}>
            <span aria-hidden style={{ display: 'inline-flex', lineHeight: 0 }}>
              <FiUploadCloud size={sizeToken.dropzoneIconSize} />
            </span>

            <div style={{ minWidth: 0 }}>
              <p style={dropzoneTitleStyle}>Drop files here</p>
              <p style={dropzoneHintStyle}>{resolvedDropzoneHint}</p>
            </div>
          </div>

          <Button
            type="button"
            size={toDropzoneBrowseButtonSize(size)}
            variant="outline"
            compact
            disabled={disabled}
            className={browseButtonClassName}
            style={browseButtonStyle}
            onClick={openFilePicker}
            {...browseButtonRestProps}
          >
            Browse
          </Button>
        </div>

        {files.length > 0 ? (
          <div style={dropzoneFileListWrapStyle}>
            <FileList
              files={fileListItems}
              variant="detailed"
              size={size}
              disabled={disabled}
              showRemoveAction
              showSize
              showDimensions
              showMimeType={false}
              showBytes={false}
              onRemove={(fileToRemove) => {
                removeFile(fileToRemove.id);
              }}
              emptyText="No files uploaded yet."
            />
          </div>
        ) : null}
      </div>

      {hiddenInputNode}
    </div>
  );
}
