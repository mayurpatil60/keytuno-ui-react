import { HTMLAttributes, ReactNode } from 'react';
import { ButtonProps } from './Button.js';
import { DialogProps } from './Dialog.js';
import { FilePreviewType } from './FilePreview.js';
import './Tooltip.js';

type FileUploadVariant = "compact" | "dropzone" | "profile";
type FileUploadSize = "xs" | "sm" | "md" | "lg";
type FileUploadSide = "left" | "center" | "right";
interface FileUploadProfileConfig {
    hint?: ReactNode;
    imageAlt?: string;
    accept?: string;
    uploadActionLabel?: string;
    removeActionLabel?: string;
    placeholderIcon?: ReactNode;
    uploadHoverIcon?: ReactNode;
    removeHoverIcon?: ReactNode;
}
interface FileUploadFile {
    id: string;
    file?: File;
    name: string;
    src: string;
    sizeBytes?: number;
    mimeType?: string;
    extension: string;
    previewType: FilePreviewType;
    width?: number;
    height?: number;
}
interface FileUploadInitialFile {
    id?: string;
    name?: string;
    src: string;
    sizeBytes?: number;
    mimeType?: string;
    extension?: string;
    previewType?: FilePreviewType;
    width?: number;
    height?: number;
}
interface FileUploadProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange"> {
    variant?: FileUploadVariant;
    size?: FileUploadSize;
    side?: FileUploadSide;
    disabled?: boolean;
    required?: boolean;
    invalid?: boolean;
    errorMessage?: ReactNode;
    multiple?: boolean;
    accept?: string;
    placeholder?: ReactNode;
    dropzoneHint?: ReactNode;
    dropzoneTitle?: ReactNode;
    browseLabel?: ReactNode;
    dialogTitle?: ReactNode;
    dialogDescription?: ReactNode;
    fileListEmptyText?: ReactNode;
    initialFiles?: FileUploadInitialFile[];
    onFilesChange?: (files: FileUploadFile[]) => void;
    profileConfig?: FileUploadProfileConfig;
    browseButtonProps?: Omit<ButtonProps, "children" | "onClick" | "disabled" | "size" | "type">;
    dialogProps?: Pick<DialogProps, "size" | "variant" | "closeOnEscape" | "closeOnOverlayClick">;
}
declare function FileUpload({ variant, size, side, disabled, required, invalid, errorMessage, multiple, accept, placeholder, dropzoneHint, dropzoneTitle, browseLabel, dialogTitle, dialogDescription, fileListEmptyText, initialFiles, onFilesChange, profileConfig, browseButtonProps, dialogProps, className, style, ...props }: FileUploadProps): JSX.Element;

export { FileUpload, type FileUploadFile, type FileUploadInitialFile, type FileUploadProfileConfig, type FileUploadProps, type FileUploadSide, type FileUploadSize, type FileUploadVariant };
