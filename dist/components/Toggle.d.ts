import { ButtonProps } from './Button.js';
import 'react';
import './Tooltip.js';

type ToggleActionSource = "click" | "pressed-change" | "focus" | "blur";
interface ToggleActionContext {
    source: ToggleActionSource;
    pressed: boolean;
    previousPressed?: boolean;
    variant: ToggleVariant;
    disabled: boolean;
    event?: unknown;
}
interface ToggleProps extends Omit<ButtonProps, "aria-pressed" | "onAction"> {
    pressed?: boolean;
    defaultPressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
    fillIconOnPressed?: boolean;
    onAction?: (context: ToggleActionContext) => void;
}
type ToggleVariant = NonNullable<ButtonProps["variant"]>;
declare function Toggle({ pressed, defaultPressed, onPressedChange, fillIconOnPressed, onAction, variant, disabled, onClick, onFocus, onBlur, children, style, ...props }: ToggleProps): JSX.Element;

export { Toggle, type ToggleActionContext, type ToggleActionSource, type ToggleProps };
