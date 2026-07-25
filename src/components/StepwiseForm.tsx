import {
  useEffect,
  useId,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

import { Button, type ButtonProps } from "./Button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  type CardProps,
  type CardSize,
  type CardSpacing,
} from "./Card";
import { CardGroup } from "./CardGroup";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
} from "./icons/feather";

export type StepwiseFormSize = CardSize;
export type StepwiseFormSpacing = CardSpacing;

export type StepwiseFormActionSource =
  | "step-select"
  | "step-toggle"
  | "previous"
  | "next"
  | "submit";

export type StepwiseFormCardProps = Omit<
  CardProps,
  "children" | "collapse" | "defaultCollapsed" | "onCollapseChange" | "onAction"
>;

export type StepwiseFormControlButtonProps = Omit<
  ButtonProps,
  "children" | "onAction" | "type"
>;

export interface StepwiseFormControlConfig {
  show?: boolean;
  label?: ReactNode;
  icon?: ReactNode;
  showIcon?: boolean;
  iconOnly?: boolean;
  iconPosition?: "left" | "right";
  ariaLabel?: string;
  buttonProps?: StepwiseFormControlButtonProps;
}

export interface StepwiseFormControls {
  previous?: StepwiseFormControlConfig;
  next?: StepwiseFormControlConfig;
  submit?: StepwiseFormControlConfig;
}

export interface StepwiseFormStep {
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
  controls?: StepwiseFormControls;
}

export interface StepwiseFormActionContext {
  source: StepwiseFormActionSource;
  activeStepId: string | null;
  stepId?: string;
  openStepIds: string[];
  totalSteps: number;
  stepIndex: number;
  event?: unknown;
}

export interface StepwiseFormProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "defaultValue" | "onChange" | "onSubmit"
> {
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
  controls?: StepwiseFormControls;
  cardProps?: StepwiseFormCardProps;
  onSubmit?: (activeStepId: string | null) => void;
  onAction?: (context: StepwiseFormActionContext) => void;
}

type StepwiseFormTokens = {
  rootGap: string;
  sectionGap: string;
  footerGap: string;
  summarySize: string;
  descriptionSize: string;
  counterSize: string;
  iconSize: number;
};

type ResolvedControl = {
  show: boolean;
  label: ReactNode;
  icon: ReactNode | null;
  iconOnly: boolean;
  iconPosition: "left" | "right";
  ariaLabel: string;
  buttonProps: StepwiseFormControlButtonProps;
};

const baseClasses = "flex w-full min-w-0 flex-col";

const tokensBySize: Record<StepwiseFormSize, StepwiseFormTokens> = {
  xs: {
    rootGap: "0.6rem",
    sectionGap: "0.45rem",
    footerGap: "0.4rem",
    summarySize: "0.74rem",
    descriptionSize: "0.72rem",
    counterSize: "0.72rem",
    iconSize: 12,
  },
  sm: {
    rootGap: "0.7rem",
    sectionGap: "0.5rem",
    footerGap: "0.45rem",
    summarySize: "0.78rem",
    descriptionSize: "0.76rem",
    counterSize: "0.76rem",
    iconSize: 13,
  },
  md: {
    rootGap: "0.8rem",
    sectionGap: "0.58rem",
    footerGap: "0.52rem",
    summarySize: "0.82rem",
    descriptionSize: "0.82rem",
    counterSize: "0.8rem",
    iconSize: 14,
  },
  lg: {
    rootGap: "0.9rem",
    sectionGap: "0.65rem",
    footerGap: "0.58rem",
    summarySize: "0.9rem",
    descriptionSize: "0.88rem",
    counterSize: "0.86rem",
    iconSize: 15,
  },
};

const buttonSizeByStepwiseSize: Record<
  StepwiseFormSize,
  NonNullable<ButtonProps["size"]>
> = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
};

function toText(value: ReactNode): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value
      .map((part) => toText(part))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
  }

  return "";
}

function areStringArraysEqual(first: string[], second: string[]): boolean {
  if (first.length !== second.length) {
    return false;
  }

  for (let index = 0; index < first.length; index += 1) {
    if (first[index] !== second[index]) {
      return false;
    }
  }

  return true;
}

function getFirstEnabledStepId(steps: StepwiseFormStep[]): string | null {
  for (const step of steps) {
    if (step.disabled !== true) {
      return step.id;
    }
  }

  return null;
}

function resolveActiveStepId(
  steps: StepwiseFormStep[],
  candidateId: string | null | undefined,
): string | null {
  if (candidateId != null) {
    const candidate = steps.find((step) => step.id === candidateId);

    if (candidate != null && candidate.disabled !== true) {
      return candidate.id;
    }
  }

  return getFirstEnabledStepId(steps);
}

function isStepCollapsible(
  step: StepwiseFormStep,
  collapsible: boolean,
): boolean {
  return (step.collapsible ?? collapsible) === true;
}

function sanitizeOpenStepIds(
  openStepIds: string[],
  steps: StepwiseFormStep[],
  options: {
    activeStepId: string | null;
    collapsible: boolean;
    allowMultipleOpen: boolean;
  },
): string[] {
  const validIds = new Set(steps.map((step) => step.id));
  const normalized: string[] = [];

  for (const id of openStepIds) {
    if (!validIds.has(id)) {
      continue;
    }

    const step = steps.find((item) => item.id === id);

    if (step == null) {
      continue;
    }

    if (
      isStepCollapsible(step, options.collapsible) ||
      step.id === options.activeStepId
    ) {
      if (!normalized.includes(step.id)) {
        normalized.push(step.id);
      }
    }
  }

  if (options.activeStepId != null) {
    const activeStep = steps.find((step) => step.id === options.activeStepId);

    if (
      activeStep != null &&
      !isStepCollapsible(activeStep, options.collapsible) &&
      !normalized.includes(activeStep.id)
    ) {
      normalized.push(activeStep.id);
    }
  }

  if (!options.allowMultipleOpen) {
    if (
      options.activeStepId != null &&
      normalized.includes(options.activeStepId)
    ) {
      return [options.activeStepId];
    }

    const latest = normalized[normalized.length - 1];
    return latest == null ? [] : [latest];
  }

  return normalized;
}

function seedOpenStepIds(
  steps: StepwiseFormStep[],
  options: {
    defaultOpenStepIds?: string[];
    activeStepId: string | null;
    collapsible: boolean;
    allowMultipleOpen: boolean;
  },
): string[] {
  const seeded = [...(options.defaultOpenStepIds ?? [])];

  for (const step of steps) {
    if (step.defaultOpen === true || step.open === true) {
      seeded.push(step.id);
    }
  }

  if (options.activeStepId != null) {
    seeded.push(options.activeStepId);
  }

  return sanitizeOpenStepIds(seeded, steps, options);
}

function mergeControlConfig(
  sharedControl: StepwiseFormControlConfig | undefined,
  stepControl: StepwiseFormControlConfig | undefined,
): StepwiseFormControlConfig | undefined {
  if (sharedControl == null && stepControl == null) {
    return undefined;
  }

  return {
    ...sharedControl,
    ...stepControl,
    buttonProps: {
      ...(sharedControl?.buttonProps ?? {}),
      ...(stepControl?.buttonProps ?? {}),
    },
  };
}

function resolveControl(
  control: StepwiseFormControlConfig | undefined,
  defaults: {
    label: string;
    icon: ReactNode;
    ariaLabel: string;
    variant: NonNullable<ButtonProps["variant"]>;
    size: NonNullable<ButtonProps["size"]>;
  },
): ResolvedControl {
  const buttonProps = control?.buttonProps ?? {};
  const label = control?.label ?? defaults.label;
  const labelText = toText(label);
  const icon =
    control?.showIcon === false
      ? null
      : control?.icon !== undefined
        ? control.icon
        : defaults.icon;

  return {
    show: control?.show ?? true,
    label,
    icon,
    iconOnly: control?.iconOnly ?? buttonProps.iconOnly ?? false,
    iconPosition: control?.iconPosition ?? "left",
    ariaLabel:
      control?.ariaLabel ?? (labelText === "" ? defaults.ariaLabel : labelText),
    buttonProps: {
      ...buttonProps,
      variant: buttonProps.variant ?? defaults.variant,
      size: buttonProps.size ?? defaults.size,
    },
  };
}

function renderControlContent(control: ResolvedControl): ReactNode {
  if (control.iconOnly) {
    return control.icon ?? control.label;
  }

  if (control.icon == null) {
    return control.label;
  }

  if (control.iconPosition === "right") {
    return (
      <>
        <span>{control.label}</span>
        <span aria-hidden>{control.icon}</span>
      </>
    );
  }

  return (
    <>
      <span aria-hidden>{control.icon}</span>
      <span>{control.label}</span>
    </>
  );
}

function getStepCounterLabel(stepIndex: number, totalSteps: number): string {
  return `Step ${stepIndex + 1} of ${totalSteps}`;
}

function findStepIndex(
  steps: StepwiseFormStep[],
  stepId: string | null,
): number {
  if (stepId == null) {
    return -1;
  }

  return steps.findIndex((step) => step.id === stepId);
}

export function StepwiseForm({
  steps = [],
  size = "md",
  spacing = "md",
  activeStepId,
  defaultActiveStepId,
  onActiveStepChange,
  openStepIds,
  defaultOpenStepIds,
  onOpenStepIdsChange,
  collapsible = true,
  allowMultipleOpen = false,
  disabled = false,
  joined = true,
  showSummary = true,
  showFooterStepCounter = true,
  headerCollapseTrigger = true,
  contentScrollable = false,
  contentMaxHeight = "18rem",
  showContentDivider = false,
  showFooterDivider = false,
  showPrevious = true,
  showNext = true,
  showSubmit = true,
  submitOnLastStep = true,
  hideNextWhenLastStep = true,
  controls,
  cardProps,
  onSubmit,
  onAction,
  className = "",
  style,
  role,
  ["aria-label"]: ariaLabel,
  ...props
}: StepwiseFormProps): JSX.Element {
  const generatedId = useId();
  const isActiveControlled = activeStepId !== undefined;
  const isOpenControlled = openStepIds !== undefined;

  const initialActiveStepId = resolveActiveStepId(steps, defaultActiveStepId);

  const [internalActiveStepId, setInternalActiveStepId] = useState<
    string | null
  >(initialActiveStepId);

  const resolvedActiveStepId = resolveActiveStepId(
    steps,
    isActiveControlled ? (activeStepId ?? null) : internalActiveStepId,
  );

  const [internalOpenStepIds, setInternalOpenStepIds] = useState<string[]>(() =>
    seedOpenStepIds(steps, {
      defaultOpenStepIds,
      activeStepId: initialActiveStepId,
      collapsible,
      allowMultipleOpen,
    }),
  );

  const resolvedOpenStepIds = sanitizeOpenStepIds(
    isOpenControlled ? (openStepIds ?? []) : internalOpenStepIds,
    steps,
    {
      activeStepId: resolvedActiveStepId,
      collapsible,
      allowMultipleOpen,
    },
  );

  useEffect(() => {
    if (!isActiveControlled && resolvedActiveStepId !== internalActiveStepId) {
      setInternalActiveStepId(resolvedActiveStepId);
    }
  }, [internalActiveStepId, isActiveControlled, resolvedActiveStepId]);

  useEffect(() => {
    if (
      !isOpenControlled &&
      !areStringArraysEqual(resolvedOpenStepIds, internalOpenStepIds)
    ) {
      setInternalOpenStepIds(resolvedOpenStepIds);
    }
  }, [internalOpenStepIds, isOpenControlled, resolvedOpenStepIds]);

  const enabledStepIds = steps
    .filter((step) => disabled !== true && step.disabled !== true)
    .map((step) => step.id);

  function emitAction(
    source: StepwiseFormActionSource,
    options?: {
      activeStepId?: string | null;
      stepId?: string;
      openStepIds?: string[];
      event?: unknown;
    },
  ): void {
    const nextActiveStepId = options?.activeStepId ?? resolvedActiveStepId;
    const stepId = options?.stepId ?? nextActiveStepId ?? undefined;

    onAction?.({
      source,
      activeStepId: nextActiveStepId,
      stepId,
      openStepIds: options?.openStepIds ?? resolvedOpenStepIds,
      totalSteps: steps.length,
      stepIndex: findStepIndex(steps, stepId ?? null),
      event: options?.event,
    });
  }

  function updateOpenStepIds(
    candidateOpenStepIds: string[],
    options?: {
      source?: StepwiseFormActionSource;
      stepId?: string;
      activeStepId?: string | null;
      event?: unknown;
    },
  ): string[] {
    const normalized = sanitizeOpenStepIds(candidateOpenStepIds, steps, {
      activeStepId: options?.activeStepId ?? resolvedActiveStepId,
      collapsible,
      allowMultipleOpen,
    });

    if (!areStringArraysEqual(normalized, resolvedOpenStepIds)) {
      if (!isOpenControlled) {
        setInternalOpenStepIds(normalized);
      }

      onOpenStepIdsChange?.(normalized);
    }

    if (options?.source != null) {
      emitAction(options.source, {
        activeStepId: options.activeStepId,
        stepId: options.stepId,
        openStepIds: normalized,
        event: options.event,
      });
    }

    return normalized;
  }

  function setActiveStep(
    step: StepwiseFormStep,
    source: StepwiseFormActionSource,
    event?: unknown,
  ): void {
    if (disabled || step.disabled === true) {
      return;
    }

    if (!isActiveControlled) {
      setInternalActiveStepId(step.id);
    }

    if (isActiveControlled || step.id !== resolvedActiveStepId) {
      onActiveStepChange?.(step.id);
    }

    const nextOpenStepIds = updateOpenStepIds(
      [...resolvedOpenStepIds, step.id],
      {
        activeStepId: step.id,
      },
    );

    emitAction(source, {
      activeStepId: step.id,
      stepId: step.id,
      openStepIds: nextOpenStepIds,
      event,
    });
  }

  function toggleStep(step: StepwiseFormStep, event?: unknown): void {
    if (
      disabled ||
      step.disabled === true ||
      !isStepCollapsible(step, collapsible)
    ) {
      return;
    }

    const isOpen = resolvedOpenStepIds.includes(step.id);
    const nextOpenStepIds = isOpen
      ? resolvedOpenStepIds.filter((id) => id !== step.id)
      : [...resolvedOpenStepIds, step.id];

    let nextActiveStepId = resolvedActiveStepId;

    if (!isOpen) {
      nextActiveStepId = step.id;

      if (!isActiveControlled) {
        setInternalActiveStepId(step.id);
      }

      if (isActiveControlled || step.id !== resolvedActiveStepId) {
        onActiveStepChange?.(step.id);
      }
    }

    updateOpenStepIds(nextOpenStepIds, {
      source: "step-toggle",
      stepId: step.id,
      activeStepId: nextActiveStepId,
      event,
    });
  }

  function handleHeaderAction(step: StepwiseFormStep, event?: unknown): void {
    if (disabled || step.disabled === true) {
      return;
    }

    const stepCollapsible = isStepCollapsible(step, collapsible);
    const canToggleFromHeader =
      stepCollapsible && (step.headerCollapseTrigger ?? headerCollapseTrigger);

    if (canToggleFromHeader) {
      toggleStep(step, event);
      return;
    }

    setActiveStep(step, "step-select", event);
  }

  function handleHeaderKeyDown(
    step: StepwiseFormStep,
    event: ReactKeyboardEvent<HTMLDivElement>,
  ): void {
    if (event.defaultPrevented) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleHeaderAction(step, event);
    }
  }

  function resolveAdjacentStepIds(stepId: string): {
    previousStepId: string | null;
    nextStepId: string | null;
    isLastEnabledStep: boolean;
  } {
    const enabledIndex = enabledStepIds.indexOf(stepId);

    const previousStepId =
      enabledIndex > 0 ? (enabledStepIds[enabledIndex - 1] ?? null) : null;

    const nextStepId =
      enabledIndex >= 0 && enabledIndex < enabledStepIds.length - 1
        ? (enabledStepIds[enabledIndex + 1] ?? null)
        : null;

    return {
      previousStepId,
      nextStepId,
      isLastEnabledStep:
        enabledIndex >= 0 && enabledIndex === enabledStepIds.length - 1,
    };
  }

  const tokens = tokensBySize[size];

  const {
    size: sharedCardSize,
    spacing: sharedCardSpacing,
    className: sharedCardClassName,
    style: sharedCardStyle,
    ...sharedCardRest
  } = cardProps ?? {};

  const composedClassName = `${baseClasses} ${className}`.trim();

  const rootStyle: CSSProperties = {
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    color: "var(--ktn-text-primary)",
    ...style,
  };

  return (
    <div
      className={composedClassName}
      style={rootStyle}
      role={role ?? "group"}
      aria-label={ariaLabel ?? "Stepwise form"}
      {...props}
    >
      <CardGroup joined={joined} gap={tokens.rootGap}>
        {steps.map((step, index) => {
          const {
            size: stepCardSize,
            spacing: stepCardSpacing,
            className: stepCardClassName,
            style: stepCardStyle,
            ...stepCardRest
          } = step.cardProps ?? {};

          const resolvedCardSize = stepCardSize ?? sharedCardSize ?? size;
          const resolvedCardSpacing =
            stepCardSpacing ?? sharedCardSpacing ?? spacing;
          const buttonSize = buttonSizeByStepwiseSize[resolvedCardSize];

          const stepCollapsible = isStepCollapsible(step, collapsible);
          const stepOpen = stepCollapsible
            ? resolvedOpenStepIds.includes(step.id)
            : step.id === resolvedActiveStepId;
          const stepActive = step.id === resolvedActiveStepId;
          const stepDisabled = disabled || step.disabled === true;

          const stepCounterLabel = getStepCounterLabel(index, steps.length);
          const titleText = toText(step.title);
          const triggerAriaLabel =
            titleText === ""
              ? stepCounterLabel
              : `${stepCounterLabel}: ${titleText}`;

          const panelId = `${generatedId}-step-panel-${index}`;
          const triggerId = `${generatedId}-step-trigger-${index}`;

          const mergedPreviousControl = mergeControlConfig(
            controls?.previous,
            step.controls?.previous,
          );
          const mergedNextControl = mergeControlConfig(
            controls?.next,
            step.controls?.next,
          );
          const mergedSubmitControl = mergeControlConfig(
            controls?.submit,
            step.controls?.submit,
          );

          const previousControl = resolveControl(mergedPreviousControl, {
            label: "Previous",
            icon: <FiChevronLeft size={tokens.iconSize} />,
            ariaLabel: "Go to previous step",
            variant: "outline",
            size: buttonSize,
          });

          const nextControl = resolveControl(mergedNextControl, {
            label: "Next",
            icon: <FiChevronRight size={tokens.iconSize} />,
            ariaLabel: "Go to next step",
            variant: "primary",
            size: buttonSize,
          });

          const submitControl = resolveControl(mergedSubmitControl, {
            label: "Submit",
            icon: <FiChevronRight size={tokens.iconSize} />,
            ariaLabel: "Submit stepwise form",
            variant: "primary",
            size: buttonSize,
          });

          const { previousStepId, nextStepId, isLastEnabledStep } =
            resolveAdjacentStepIds(step.id);

          const showPreviousControl = showPrevious && previousControl.show;
          const showNextControl = showNext && nextControl.show;
          const showSubmitControl = showSubmit && submitControl.show;

          const showNextButton =
            showNextControl && !(hideNextWhenLastStep && isLastEnabledStep);

          const showSubmitButton =
            showSubmitControl && submitOnLastStep && isLastEnabledStep;

          const shouldScroll =
            (step.showScrollbar ?? contentScrollable) === true;
          const resolvedContentMaxHeight =
            step.contentMaxHeight ?? contentMaxHeight;
          const resolvedContentDivider =
            step.showContentDivider ?? showContentDivider;
          const resolvedFooterDivider =
            step.showFooterDivider ?? showFooterDivider;

          const mergedCardClassName = [sharedCardClassName, stepCardClassName]
            .filter((value) => value != null && value.trim() !== "")
            .join(" ");

          const cardStyle: CSSProperties = {
            borderColor: stepActive
              ? "var(--ktn-action-primary-bg)"
              : "var(--ktn-border-muted)",
            boxShadow: stepActive
              ? "0 0 0 1px var(--ktn-action-primary-bg)"
              : "none",
            ...sharedCardStyle,
            ...stepCardStyle,
            // In joined CardGroup mode, cards overlap by 1px to merge borders.
            // Keep the active card above neighbors so its full blue border is visible.
            position: "relative",
            zIndex: stepActive ? 2 : 1,
          };

          const headerInteractive = !stepDisabled;

          const triggerStyle: CSSProperties = {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "0.25rem",
            minWidth: 0,
            cursor: headerInteractive ? "pointer" : "default",
            outline: "none",
          };

          const summaryStyle: CSSProperties = {
            margin: 0,
            fontSize: tokens.summarySize,
            lineHeight: 1.4,
            color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
          };

          const bodyStyle: CSSProperties = {
            display: stepOpen ? "block" : "none",
          };

          const bodyInnerStyle: CSSProperties = {
            display: "flex",
            flexDirection: "column",
            gap: tokens.sectionGap,
          };

          const descriptionStyle: CSSProperties = {
            margin: 0,
            fontSize: tokens.descriptionSize,
            lineHeight: 1.45,
            color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
          };

          const contentWrapStyle: CSSProperties = shouldScroll
            ? {
                maxHeight: resolvedContentMaxHeight,
                overflowY: "auto",
              }
            : {};

          const footerStyle: CSSProperties = {
            display: stepOpen ? "flex" : "none",
            flexDirection: "column",
            gap: tokens.footerGap,
          };

          const navRowStyle: CSSProperties = {
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            gap: tokens.footerGap,
            width: "100%",
          };

          const navStartStyle: CSSProperties = {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: tokens.footerGap,
            minWidth: 0,
          };

          const navCenterStyle: CSSProperties = {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            paddingInline: "0.4rem",
          };

          const navEndStyle: CSSProperties = {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: tokens.footerGap,
            minWidth: 0,
          };

          const footerCounterStyle: CSSProperties = {
            margin: 0,
            fontSize: tokens.counterSize,
            lineHeight: 1.35,
            fontWeight: 600,
            color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
            whiteSpace: "nowrap",
          };

          const stepCardProps = {
            ...sharedCardRest,
            ...stepCardRest,
          };

          const previousButtonProps = previousControl.buttonProps;
          const nextButtonProps = nextControl.buttonProps;
          const submitButtonProps = submitControl.buttonProps;

          return (
            <Card
              key={step.id}
              size={resolvedCardSize}
              spacing={resolvedCardSpacing}
              className={mergedCardClassName}
              style={cardStyle}
              {...stepCardProps}
            >
              <CardHeader>
                <div
                  id={triggerId}
                  role="button"
                  tabIndex={headerInteractive ? 0 : -1}
                  aria-label={triggerAriaLabel}
                  aria-expanded={stepOpen}
                  aria-controls={panelId}
                  aria-disabled={headerInteractive ? undefined : true}
                  style={triggerStyle}
                  onClick={(event) => {
                    handleHeaderAction(step, event);
                  }}
                  onKeyDown={(event) => {
                    handleHeaderKeyDown(step, event);
                  }}
                >
                  <CardTitle style={{ margin: 0 }}>
                    {stepCounterLabel}: {step.title}
                  </CardTitle>

                  {showSummary && step.summary != null ? (
                    <CardDescription style={summaryStyle}>
                      {step.summary}
                    </CardDescription>
                  ) : null}
                </div>

                {stepCollapsible ? (
                  <CardAction>
                    <Button
                      type="button"
                      variant="ghost"
                      size={buttonSize}
                      iconOnly
                      aria-label={stepOpen ? "Collapse step" : "Expand step"}
                      disabled={stepDisabled}
                      onAction={(event) => {
                        event.stopPropagation();
                        toggleStep(step, event);
                      }}
                    >
                      {stepOpen ? (
                        <FiChevronUp size={tokens.iconSize} />
                      ) : (
                        <FiChevronDown size={tokens.iconSize} />
                      )}
                    </Button>
                  </CardAction>
                ) : null}
              </CardHeader>

              <CardContent
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                divider={resolvedContentDivider}
                style={bodyStyle}
              >
                <div style={bodyInnerStyle}>
                  {step.description != null ? (
                    <p style={descriptionStyle}>{step.description}</p>
                  ) : null}

                  <div style={contentWrapStyle}>{step.content}</div>
                </div>
              </CardContent>

              <CardFooter divider={resolvedFooterDivider} style={footerStyle}>
                {step.footer != null ? <div>{step.footer}</div> : null}

                <div style={navRowStyle}>
                  <div style={navStartStyle}>
                    {showPreviousControl ? (
                      <Button
                        {...previousButtonProps}
                        type="button"
                        variant={previousButtonProps.variant}
                        size={previousButtonProps.size}
                        compact={previousButtonProps.compact}
                        iconOnly={previousControl.iconOnly}
                        aria-label={previousControl.ariaLabel}
                        disabled={
                          previousButtonProps.disabled === true ||
                          stepDisabled ||
                          previousStepId == null
                        }
                        onAction={(event) => {
                          if (previousStepId == null) {
                            return;
                          }

                          const previousStep = steps.find(
                            (item) => item.id === previousStepId,
                          );

                          if (previousStep != null) {
                            setActiveStep(previousStep, "previous", event);
                          }
                        }}
                      >
                        {renderControlContent(previousControl)}
                      </Button>
                    ) : null}
                  </div>

                  <div style={navCenterStyle}>
                    {showFooterStepCounter ? (
                      <p style={footerCounterStyle}>{stepCounterLabel}</p>
                    ) : null}
                  </div>

                  <div style={navEndStyle}>
                    {showNextButton ? (
                      <Button
                        {...nextButtonProps}
                        type="button"
                        variant={nextButtonProps.variant}
                        size={nextButtonProps.size}
                        compact={nextButtonProps.compact}
                        iconOnly={nextControl.iconOnly}
                        aria-label={nextControl.ariaLabel}
                        disabled={
                          nextButtonProps.disabled === true ||
                          stepDisabled ||
                          nextStepId == null
                        }
                        onAction={(event) => {
                          if (nextStepId == null) {
                            return;
                          }

                          const nextStep = steps.find(
                            (item) => item.id === nextStepId,
                          );

                          if (nextStep != null) {
                            setActiveStep(nextStep, "next", event);
                          }
                        }}
                      >
                        {renderControlContent(nextControl)}
                      </Button>
                    ) : null}

                    {showSubmitButton ? (
                      <Button
                        {...submitButtonProps}
                        type="button"
                        variant={submitButtonProps.variant}
                        size={submitButtonProps.size}
                        compact={submitButtonProps.compact}
                        iconOnly={submitControl.iconOnly}
                        aria-label={submitControl.ariaLabel}
                        disabled={
                          submitButtonProps.disabled === true || stepDisabled
                        }
                        onAction={(event) => {
                          onSubmit?.(step.id);

                          emitAction("submit", {
                            activeStepId: step.id,
                            stepId: step.id,
                            event,
                          });
                        }}
                      >
                        {renderControlContent(submitControl)}
                      </Button>
                    ) : null}
                  </div>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </CardGroup>
    </div>
  );
}
