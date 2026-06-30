import { HTMLAttributes, ReactNode } from 'react';

type SliderOrientation = "horizontal" | "vertical";
type SliderSize = "xs" | "sm" | "md" | "lg";
type SliderActionSource = "value-change" | "thumb-focus" | "thumb-blur" | "drag-start" | "drag-end";
interface SliderActionContext {
    source: SliderActionSource;
    values: number[];
    previousValues?: number[];
    activeThumbIndex: number;
    orientation: SliderOrientation;
    min: number;
    max: number;
    step: number;
    disabled: boolean;
    required: boolean;
    event?: unknown;
}
interface SliderProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "onChange"> {
    orientation?: SliderOrientation;
    size?: SliderSize;
    value?: number[];
    defaultValue?: number[];
    onValueChange?: (value: number[]) => void;
    onAction?: (context: SliderActionContext) => void;
    min?: number;
    max?: number;
    step?: number;
    minStepsBetweenThumbs?: number;
    disabled?: boolean;
    required?: boolean;
    showLabels?: boolean;
    minLabel?: ReactNode;
    maxLabel?: ReactNode;
    showValueLabel?: boolean;
    formatValueLabel?: (value: number[]) => ReactNode;
}
declare function Slider({ orientation, size, value, defaultValue, onValueChange, onAction, min, max, step, minStepsBetweenThumbs, disabled, required, showLabels, minLabel, maxLabel, showValueLabel, formatValueLabel, className, style, ...props }: SliderProps): JSX.Element;

export { Slider, type SliderActionContext, type SliderActionSource, type SliderOrientation, type SliderProps, type SliderSize };
