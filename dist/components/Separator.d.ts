import { HTMLAttributes } from 'react';

type SeparatorSize = "xs" | "sm" | "md" | "lg";
type SeparatorOrientation = "horizontal" | "vertical";
type SeparatorVariant = "default" | "light" | "dark" | "brand-light" | "brand-dark";
type SeparatorActionSource = "click" | "focus" | "blur";
interface SeparatorActionContext {
    source: SeparatorActionSource;
    orientation: SeparatorOrientation;
    size: SeparatorSize;
    variant: SeparatorVariant;
    decorative: boolean;
    event?: unknown;
}
interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
    size?: SeparatorSize;
    orientation?: SeparatorOrientation;
    variant?: SeparatorVariant;
    decorative?: boolean;
    onAction?: (context: SeparatorActionContext) => void;
}
declare function Separator({ size, orientation, variant, decorative, onAction, className, style, onClick, onFocus, onBlur, ...props }: SeparatorProps): JSX.Element;

export { Separator, type SeparatorActionContext, type SeparatorActionSource, type SeparatorOrientation, type SeparatorProps, type SeparatorSize, type SeparatorVariant };
