import { HTMLAttributes, ReactNode, CSSProperties } from 'react';

type FilePreviewSize = "xs" | "sm" | "md" | "lg";
type FilePreviewType = "auto" | "image" | "pdf" | "video" | "audio" | "file";
interface FilePreviewProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
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
declare function FilePreview({ src, name, description, size, type, mimeType, thumbnailSrc, disabled, asLink, linkLabel, showLinkIcons, linkButtonStyle, previewAriaLabelFormatter, closeButtonLabel, openInNewTabLabel, typeDescriptionFormatter, imageInteractionHint, defaultInteractionHint, closeOnOverlayClick, closeOnEscape, className, style, ...props }: FilePreviewProps): JSX.Element;

export { FilePreview, type FilePreviewProps, type FilePreviewSize, type FilePreviewType };
