import { HTMLAttributes, ReactNode, CSSProperties } from 'react';

declare const toastVariants: readonly ["default", "success", "warning", "accent", "danger"];
type ToastVariant = (typeof toastVariants)[number];
declare const toastSizes: readonly ["xs", "sm", "md"];
type ToastSize = (typeof toastSizes)[number];
type ToastActionSource = "open" | "open-change" | "auto-close";
interface ToastActionContext {
    source: ToastActionSource;
    open: boolean;
    variant: ToastVariant;
    size: ToastSize;
    duration: number;
    event?: unknown;
}
interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    children?: ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    onAction?: (context: ToastActionContext) => void;
    variant?: ToastVariant;
    size?: ToastSize;
    duration?: number;
    bottomOffset?: number;
    bordered?: boolean;
    contentStyle?: CSSProperties;
}
declare function Toast({ children, open, defaultOpen, onOpenChange, onAction, variant, size, duration, bottomOffset, bordered, className, style, contentStyle, role, ["aria-label"]: ariaLabel, ["aria-live"]: ariaLive, ["aria-atomic"]: ariaAtomic, ...props }: ToastProps): JSX.Element | null;

export { Toast, type ToastActionContext, type ToastActionSource, type ToastProps, type ToastSize, type ToastVariant, toastSizes, toastVariants };
