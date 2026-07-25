import { HTMLAttributes, ReactNode, CSSProperties } from 'react';
import { ButtonProps } from './Button.js';
import { CardProps, CardSize, CardSpacing } from './Card.js';
import './Tooltip.js';

type StepwiseFormSize = CardSize;
type StepwiseFormSpacing = CardSpacing;
type StepwiseFormActionSource = "step-select" | "step-toggle" | "previous" | "next" | "submit";
type StepwiseFormCardProps = Omit<CardProps, "children" | "collapse" | "defaultCollapsed" | "onCollapseChange" | "onAction">;
type StepwiseFormControlButtonProps = Omit<ButtonProps, "children" | "type">;
interface StepwiseFormControlConfig {
    show?: boolean;
    label?: ReactNode;
    icon?: ReactNode;
    showIcon?: boolean;
    iconOnly?: boolean;
    iconPosition?: "left" | "right";
    ariaLabel?: string;
    buttonProps?: StepwiseFormControlButtonProps;
}
interface StepwiseFormControls {
    previous?: StepwiseFormControlConfig;
    next?: StepwiseFormControlConfig;
    submit?: StepwiseFormControlConfig;
}
interface StepwiseFormStep {
    id: string;
    title: ReactNode;
    summary?: ReactNode;
    description?: ReactNode;
    content?: ReactNode;
    footer?: ReactNode;
    disabled?: boolean;
    completed?: boolean;
    collapsible?: boolean;
    defaultOpen?: boolean;
    open?: boolean;
    headerCollapseTrigger?: boolean;
    showScrollbar?: boolean;
    contentMaxHeight?: CSSProperties["maxHeight"];
    showContentDivider?: boolean;
    showFooterDivider?: boolean;
    cardProps?: StepwiseFormCardProps;
    prevBtnProps?: StepwiseFormControlButtonProps;
    nextBtnProps?: StepwiseFormControlButtonProps;
    submitBtnProps?: StepwiseFormControlButtonProps;
    controls?: StepwiseFormControls;
}
interface StepwiseFormActionContext {
    source: StepwiseFormActionSource;
    activeStepId: string | null;
    stepId?: string;
    openStepIds: string[];
    totalSteps: number;
    stepIndex: number;
    event?: unknown;
}
interface StepwiseFormProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "onChange" | "onSubmit"> {
    steps?: StepwiseFormStep[];
    size?: StepwiseFormSize;
    spacing?: StepwiseFormSpacing;
    activeStepId?: string;
    defaultActiveStepId?: string;
    onActiveStepChange?: (stepId: string) => void;
    openStepIds?: string[];
    defaultOpenStepIds?: string[];
    onOpenStepIdsChange?: (stepIds: string[]) => void;
    collapsible?: boolean;
    allowMultipleOpen?: boolean;
    disabled?: boolean;
    joined?: boolean;
    showSummary?: boolean;
    showFooterStepCounter?: boolean;
    headerCollapseTrigger?: boolean;
    contentScrollable?: boolean;
    contentMaxHeight?: CSSProperties["maxHeight"];
    showContentDivider?: boolean;
    showFooterDivider?: boolean;
    showPrevious?: boolean;
    showNext?: boolean;
    showSubmit?: boolean;
    submitOnLastStep?: boolean;
    hideNextWhenLastStep?: boolean;
    prevBtnProps?: StepwiseFormControlButtonProps;
    nextBtnProps?: StepwiseFormControlButtonProps;
    submitBtnProps?: StepwiseFormControlButtonProps;
    controls?: StepwiseFormControls;
    cardProps?: StepwiseFormCardProps;
    onSubmit?: (activeStepId: string | null) => void;
    onAction?: (context: StepwiseFormActionContext) => void;
}
declare function StepwiseForm({ steps, size, spacing, activeStepId, defaultActiveStepId, onActiveStepChange, openStepIds, defaultOpenStepIds, onOpenStepIdsChange, collapsible, allowMultipleOpen, disabled, joined, showSummary, showFooterStepCounter, headerCollapseTrigger, contentScrollable, contentMaxHeight, showContentDivider, showFooterDivider, showPrevious, showNext, showSubmit, submitOnLastStep, hideNextWhenLastStep, prevBtnProps, nextBtnProps, submitBtnProps, controls, cardProps, onSubmit, onAction, className, style, role, ["aria-label"]: ariaLabel, ...props }: StepwiseFormProps): JSX.Element;

export { StepwiseForm, type StepwiseFormActionContext, type StepwiseFormActionSource, type StepwiseFormCardProps, type StepwiseFormControlButtonProps, type StepwiseFormControlConfig, type StepwiseFormControls, type StepwiseFormProps, type StepwiseFormSize, type StepwiseFormSpacing, type StepwiseFormStep };
