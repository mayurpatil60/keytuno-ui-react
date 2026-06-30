import { HTMLAttributes, ReactNode, CSSProperties } from 'react';
import { BadgeProps } from './Badge.js';
import { FilePreviewType } from './FilePreview.js';

type FileListSize = "xs" | "sm" | "md" | "lg";
type FileListVariant = "compact" | "detailed" | "advanced";
interface FileListItem {
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
interface FileListProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
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
declare function FileList({ files, variant, size, disabled, emptyText, showRemoveAction, showSize, showDimensions, showMimeType, showBytes, compactChipProps, virtualized, virtualizedMaxHeight, virtualizedEstimateSize, virtualizedOverscan, onRemove, className, style, ...props }: FileListProps): JSX.Element;

export { FileList, type FileListItem, type FileListProps, type FileListSize, type FileListVariant };
