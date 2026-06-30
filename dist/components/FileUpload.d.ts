import { HTMLAttributes, ReactNode } from 'react';
import { ButtonProps } from './Button.js';
import { DialogProps } from './Dialog.js';
import { FilePreviewType } from './FilePreview.js';
import './Tooltip.js';

type FileUploadVariant = "compact" | "dropzone";
type FileUploadSize = "xs" | "sm" | "md" | "lg";
interface FileUploadFile {
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
interface FileUploadProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange"> {
    variant?: FileUploadVariant;
    varient?: FileUploadVariant;
    size?: FileUploadSize;
    disabled?: boolean;
    required?: boolean;
    multiple?: boolean;
    accept?: string;
    placeholder?: ReactNode;
    dropzoneHint?: ReactNode;
    dropzoneTitle?: ReactNode;
    browseLabel?: ReactNode;
    dialogTitle?: ReactNode;
    dialogDescription?: ReactNode;
    fileListEmptyText?: ReactNode;
    onFilesChange?: (files: FileUploadFile[]) => void;
    browseButtonProps?: Omit<ButtonProps, "children" | "onClick" | "disabled" | "size" | "type">;
    dialogProps?: Pick<DialogProps, "size" | "variant" | "varient" | "closeOnEscape" | "closeOnOverlayClick">;
}
declare function FileUpload({ variant, varient, size, disabled, required, multiple, accept, placeholder, dropzoneHint, dropzoneTitle, browseLabel, dialogTitle, dialogDescription, fileListEmptyText, onFilesChange, browseButtonProps, dialogProps, className, style, ...props }: FileUploadProps): JSX.Element;

export { FileUpload, type FileUploadFile, type FileUploadProps, type FileUploadSize, type FileUploadVariant };
