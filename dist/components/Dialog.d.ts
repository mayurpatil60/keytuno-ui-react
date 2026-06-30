import { HTMLAttributes, ReactNode } from 'react';

type DialogVariant = "primary" | "secondary" | "destructive" | "outline" | "ghost" | "link";
type DialogSize = "xs" | "sm" | "md" | "lg";
type DialogActionSource = "trigger" | "overlay" | "escape" | "close-button" | "open-change";
interface DialogActionContext {
    source: DialogActionSource;
    open: boolean;
    event?: unknown;
}
interface DialogProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    children?: ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    onAction?: (context: DialogActionContext) => void;
    trigger?: ReactNode;
    variant?: DialogVariant;
    varient?: DialogVariant;
    size?: DialogSize;
    disabled?: boolean;
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
}
interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {
    showCloseButton?: boolean;
    scrollable?: boolean;
    maxContentHeight?: string;
    closeButtonLabel?: string;
}
interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {
}
interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {
}
interface DialogDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
}
interface DialogFooterProps extends HTMLAttributes<HTMLDivElement> {
    sticky?: boolean;
}
declare function Dialog({ children, open, defaultOpen, onOpenChange, onAction, trigger, variant, varient, size, disabled, closeOnOverlayClick, closeOnEscape, className, style, ...props }: DialogProps): JSX.Element;
declare function DialogContent({ children, showCloseButton, scrollable, maxContentHeight, closeButtonLabel, className, style, ...props }: DialogContentProps): JSX.Element;
declare function DialogHeader({ children, className, style, ...props }: DialogHeaderProps): JSX.Element;
declare function DialogTitle({ children, className, style, ...props }: DialogTitleProps): JSX.Element;
declare function DialogDescription({ children, className, style, ...props }: DialogDescriptionProps): JSX.Element;
declare function DialogFooter({ children, sticky, className, style, ...props }: DialogFooterProps): JSX.Element;

export { Dialog, type DialogActionContext, type DialogActionSource, DialogContent, type DialogContentProps, DialogDescription, type DialogDescriptionProps, DialogFooter, type DialogFooterProps, DialogHeader, type DialogHeaderProps, type DialogProps, type DialogSize, DialogTitle, type DialogTitleProps, type DialogVariant };
