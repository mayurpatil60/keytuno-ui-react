import { HTMLAttributes, ReactNode, CSSProperties } from 'react';
import { ButtonProps } from './Button.js';
import './Tooltip.js';

type AlertVariant = "primary" | "secondary" | "destructive" | "outline" | "link" | "compact";
type AlertSide = "top-left" | "bottom-left" | "bottom-right" | "top-right" | "bottom-center" | "top-center";
type AlertSize = "xs" | "sm" | "md" | "lg";
type AlertActionSource = "open" | "open-change" | "close-button" | "auto-close" | "escape" | "action-click" | "focus" | "blur";
interface AlertCustomColors {
    backgroundColor?: CSSProperties["backgroundColor"];
    borderColor?: CSSProperties["borderColor"];
    titleColor?: CSSProperties["color"];
    descriptionColor?: CSSProperties["color"];
    actionColor?: CSSProperties["color"];
}
interface AlertViewportInset {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
}
interface AlertActionContext {
    source: AlertActionSource;
    open: boolean;
    variant: AlertVariant;
    side: AlertSide;
    size: AlertSize;
    actionRequired: boolean;
    duration: number;
    startedAt?: number;
    closesAt?: number;
    stackIndex: number;
    stackCount: number;
    event?: unknown;
}
interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    children?: ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    onAction?: (context: AlertActionContext) => void;
    variant?: AlertVariant;
    side?: AlertSide;
    size?: AlertSize;
    duration?: number;
    actionRequired?: boolean;
    closeOnEscape?: boolean;
    closeButtonLabel?: string;
    customColors?: AlertCustomColors;
    viewportInset?: number | AlertViewportInset;
}
interface AlertTitleProps extends HTMLAttributes<HTMLHeadingElement> {
}
interface AlertDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
}
interface AlertActionProps extends Omit<ButtonProps, "onAction"> {
    closeOnAction?: boolean;
}
declare function Alert({ children, open, defaultOpen, onOpenChange, onAction, variant, side, size, duration, actionRequired, closeOnEscape, closeButtonLabel, customColors, viewportInset, className, style, onFocus, onBlur, role, ["aria-live"]: ariaLive, ...props }: AlertProps): JSX.Element;
declare function AlertTitle({ children, className, style, ...props }: AlertTitleProps): JSX.Element;
declare function AlertDescription({ children, className, style, ...props }: AlertDescriptionProps): JSX.Element;
declare function AlertAction({ closeOnAction, variant, size, style, onClick, type, ...props }: AlertActionProps): JSX.Element;
declare namespace AlertAction {
    var displayName: string;
}

export { Alert, AlertAction, type AlertActionContext, type AlertActionProps, type AlertActionSource, type AlertCustomColors, AlertDescription, type AlertDescriptionProps, type AlertProps, type AlertSide, type AlertSize, AlertTitle, type AlertTitleProps, type AlertVariant, type AlertViewportInset };
