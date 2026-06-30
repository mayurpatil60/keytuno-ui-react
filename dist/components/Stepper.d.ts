import { HTMLAttributes, ReactNode } from 'react';
import { ButtonProps } from './Button.js';
import './Tooltip.js';

type StepperVariant = "vertical" | "horizontal" | "compact-vertical" | "compact-horizontal";
type StepperSize = "xs" | "sm" | "md" | "lg";
type StepperActionSource = "step-select" | "step-toggle" | "substep-select" | "previous" | "next" | "submit";
interface StepperSubstep {
    id: string;
    title: ReactNode;
    shortDescription?: ReactNode;
    description?: ReactNode;
    icon?: ReactNode;
    disabled?: boolean;
    completed?: boolean;
    ariaLabel?: string;
}
interface StepperStep {
    id: string;
    title: ReactNode;
    shortDescription?: ReactNode;
    description?: ReactNode;
    content?: ReactNode;
    icon?: ReactNode;
    substeps?: StepperSubstep[];
    disabled?: boolean;
    completed?: boolean;
    collapsible?: boolean;
    keepOpen?: boolean;
    defaultOpen?: boolean;
    open?: boolean;
    ariaLabel?: string;
}
interface StepperControlButtonConfig {
    show?: boolean;
    label?: ReactNode;
    icon?: ReactNode;
    showIcon?: boolean;
    iconOnly?: boolean;
    iconPosition?: "left" | "right";
    ariaLabel?: string;
    variant?: ButtonProps["variant"];
    size?: ButtonProps["size"];
    compact?: boolean;
}
interface StepperControls {
    previous?: StepperControlButtonConfig;
    next?: StepperControlButtonConfig;
    submit?: StepperControlButtonConfig;
}
interface StepperActionContext {
    source: StepperActionSource;
    activeStepId: string | null;
    stepId?: string;
    substepId?: string;
    openStepIds: string[];
    variant: StepperVariant;
    size: StepperSize;
    event?: unknown;
}
interface StepperProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange" | "onSubmit"> {
    steps?: StepperStep[];
    variant?: StepperVariant;
    size?: StepperSize;
    activeStepId?: string;
    defaultActiveStepId?: string;
    onActiveStepChange?: (stepId: string) => void;
    activeSubstepId?: string;
    defaultActiveSubstepId?: string;
    onActiveSubstepChange?: (substepId: string, stepId: string) => void;
    openStepIds?: string[];
    defaultOpenStepIds?: string[];
    onOpenStepIdsChange?: (openStepIds: string[]) => void;
    collapsible?: boolean;
    allowMultipleOpen?: boolean;
    disabled?: boolean;
    showDescriptions?: boolean;
    showShortDescriptions?: boolean;
    showSubsteps?: boolean;
    showDisabledSteps?: boolean;
    showDisabledSubsteps?: boolean;
    showStepNumbers?: boolean;
    showIndicators?: boolean;
    showControls?: boolean;
    showControlsInside?: boolean;
    showControlsOutside?: boolean;
    showPrevious?: boolean;
    showNext?: boolean;
    showSubmit?: boolean;
    submitOnLastStep?: boolean;
    hideNextWhenLastStep?: boolean;
    controls?: StepperControls;
    onSubmit?: (activeStepId: string | null) => void;
    onAction?: (context: StepperActionContext) => void;
}
declare function Stepper({ steps, variant, size, activeStepId, defaultActiveStepId, onActiveStepChange, activeSubstepId, defaultActiveSubstepId, onActiveSubstepChange, openStepIds, defaultOpenStepIds, onOpenStepIdsChange, collapsible, allowMultipleOpen, disabled, showDescriptions, showShortDescriptions, showSubsteps, showDisabledSteps, showDisabledSubsteps, showStepNumbers, showIndicators, showControls, showControlsInside, showControlsOutside, showPrevious, showNext, showSubmit, submitOnLastStep, hideNextWhenLastStep, controls, onSubmit, onAction, className, style, role, ["aria-label"]: ariaLabel, ...props }: StepperProps): JSX.Element;

export { Stepper, type StepperActionContext, type StepperActionSource, type StepperControlButtonConfig, type StepperControls, type StepperProps, type StepperSize, type StepperStep, type StepperSubstep, type StepperVariant };
