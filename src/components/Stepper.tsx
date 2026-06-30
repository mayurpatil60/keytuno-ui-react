import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";

import { Badge } from "./Badge";
import { Button, type ButtonProps } from "./Button";
import { Separator } from "./Separator";
import {
  FiCheck,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
} from "./icons/feather";

export type StepperVariant =
  | "vertical"
  | "horizontal"
  | "compact-vertical"
  | "compact-horizontal";

export type StepperSize = "xs" | "sm" | "md" | "lg";

export type StepperActionSource =
  | "step-select"
  | "step-toggle"
  | "substep-select"
  | "previous"
  | "next"
  | "submit";

export interface StepperSubstep {
  id: string;
  title: ReactNode;
  shortDescription?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  completed?: boolean;
  ariaLabel?: string;
}

export interface StepperStep {
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

export interface StepperControlButtonConfig {
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

export interface StepperControls {
  previous?: StepperControlButtonConfig;
  next?: StepperControlButtonConfig;
  submit?: StepperControlButtonConfig;
}

export interface StepperActionContext {
  source: StepperActionSource;
  activeStepId: string | null;
  stepId?: string;
  substepId?: string;
  openStepIds: string[];
  variant: StepperVariant;
  size: StepperSize;
  event?: unknown;
}

export interface StepperProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "onChange" | "onSubmit"
> {
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

type StepperTokens = {
  rootGap: string;
  stepGap: string;
  panelGap: string;
  indicatorSize: string;
  indicatorFontSize: string;
  titleFontSize: string;
  shortDescriptionFontSize: string;
  descriptionFontSize: string;
  panelPadding: string;
  substepPaddingY: string;
  substepPaddingX: string;
  controlGap: string;
  iconSize: number;
};

type NormalizationOptions = {
  activeStepId: string | null;
  allowMultipleOpen: boolean;
  showDescriptions: boolean;
  showSubsteps: boolean;
  showDisabledSubsteps: boolean;
  preferredStepId?: string | null;
  enforceActiveOpen?: boolean;
};

type ResolvedControlButton = {
  show: boolean;
  label: ReactNode;
  icon: ReactNode;
  iconOnly: boolean;
  iconPosition: "left" | "right";
  ariaLabel: string;
  variant: NonNullable<ButtonProps["variant"]>;
  size: ButtonProps["size"];
  compact: boolean;
};

const baseClasses = "flex w-full min-w-0 flex-col";

const regularTokens: Record<StepperSize, StepperTokens> = {
  xs: {
    rootGap: "0.65rem",
    stepGap: "0.48rem",
    panelGap: "0.45rem",
    indicatorSize: "1.28rem",
    indicatorFontSize: "0.66rem",
    titleFontSize: "0.76rem",
    shortDescriptionFontSize: "0.68rem",
    descriptionFontSize: "0.7rem",
    panelPadding: "0.5rem",
    substepPaddingY: "0.26rem",
    substepPaddingX: "0.34rem",
    controlGap: "0.4rem",
    iconSize: 12,
  },
  sm: {
    rootGap: "0.72rem",
    stepGap: "0.55rem",
    panelGap: "0.5rem",
    indicatorSize: "1.42rem",
    indicatorFontSize: "0.72rem",
    titleFontSize: "0.82rem",
    shortDescriptionFontSize: "0.72rem",
    descriptionFontSize: "0.76rem",
    panelPadding: "0.58rem",
    substepPaddingY: "0.3rem",
    substepPaddingX: "0.4rem",
    controlGap: "0.46rem",
    iconSize: 13,
  },
  md: {
    rootGap: "0.8rem",
    stepGap: "0.64rem",
    panelGap: "0.58rem",
    indicatorSize: "1.6rem",
    indicatorFontSize: "0.79rem",
    titleFontSize: "0.9rem",
    shortDescriptionFontSize: "0.77rem",
    descriptionFontSize: "0.82rem",
    panelPadding: "0.68rem",
    substepPaddingY: "0.34rem",
    substepPaddingX: "0.46rem",
    controlGap: "0.52rem",
    iconSize: 14,
  },
  lg: {
    rootGap: "0.9rem",
    stepGap: "0.72rem",
    panelGap: "0.65rem",
    indicatorSize: "1.8rem",
    indicatorFontSize: "0.85rem",
    titleFontSize: "0.96rem",
    shortDescriptionFontSize: "0.84rem",
    descriptionFontSize: "0.88rem",
    panelPadding: "0.78rem",
    substepPaddingY: "0.38rem",
    substepPaddingX: "0.52rem",
    controlGap: "0.6rem",
    iconSize: 15,
  },
};

const compactTokens: Record<StepperSize, StepperTokens> = {
  xs: {
    rootGap: "0.55rem",
    stepGap: "0.4rem",
    panelGap: "0.4rem",
    indicatorSize: "1.1rem",
    indicatorFontSize: "0.6rem",
    titleFontSize: "0.72rem",
    shortDescriptionFontSize: "0.64rem",
    descriptionFontSize: "0.68rem",
    panelPadding: "0.44rem",
    substepPaddingY: "0.22rem",
    substepPaddingX: "0.28rem",
    controlGap: "0.34rem",
    iconSize: 11,
  },
  sm: {
    rootGap: "0.6rem",
    stepGap: "0.45rem",
    panelGap: "0.44rem",
    indicatorSize: "1.2rem",
    indicatorFontSize: "0.65rem",
    titleFontSize: "0.76rem",
    shortDescriptionFontSize: "0.67rem",
    descriptionFontSize: "0.72rem",
    panelPadding: "0.5rem",
    substepPaddingY: "0.24rem",
    substepPaddingX: "0.32rem",
    controlGap: "0.38rem",
    iconSize: 12,
  },
  md: {
    rootGap: "0.66rem",
    stepGap: "0.5rem",
    panelGap: "0.48rem",
    indicatorSize: "1.3rem",
    indicatorFontSize: "0.7rem",
    titleFontSize: "0.82rem",
    shortDescriptionFontSize: "0.72rem",
    descriptionFontSize: "0.76rem",
    panelPadding: "0.56rem",
    substepPaddingY: "0.27rem",
    substepPaddingX: "0.36rem",
    controlGap: "0.42rem",
    iconSize: 13,
  },
  lg: {
    rootGap: "0.74rem",
    stepGap: "0.56rem",
    panelGap: "0.54rem",
    indicatorSize: "1.42rem",
    indicatorFontSize: "0.76rem",
    titleFontSize: "0.88rem",
    shortDescriptionFontSize: "0.78rem",
    descriptionFontSize: "0.82rem",
    panelPadding: "0.63rem",
    substepPaddingY: "0.3rem",
    substepPaddingX: "0.42rem",
    controlGap: "0.48rem",
    iconSize: 14,
  },
};

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

function resolveVariant(variant: StepperVariant | undefined): StepperVariant {
  if (variant != null) {
    return variant;
  }

  return "vertical";
}

function isCompact(variant: StepperVariant): boolean {
  return variant === "compact-horizontal" || variant === "compact-vertical";
}

function isHorizontal(variant: StepperVariant): boolean {
  return variant === "horizontal" || variant === "compact-horizontal";
}

function getVisibleSubsteps(
  step: StepperStep,
  showDisabledSubsteps: boolean,
): StepperSubstep[] {
  if (showDisabledSubsteps) {
    return step.substeps ?? [];
  }

  return (step.substeps ?? []).filter((substep) => substep.disabled !== true);
}

function hasStepPanel(
  step: StepperStep,
  showDescriptions: boolean,
  showSubsteps: boolean,
  showDisabledSubsteps: boolean,
): boolean {
  const hasDescription = showDescriptions && step.description != null;
  const hasSubstepItems =
    showSubsteps && getVisibleSubsteps(step, showDisabledSubsteps).length > 0;
  const hasCustomContent = step.content != null;

  return hasDescription || hasSubstepItems || hasCustomContent;
}

function findFirstEnabledStepId(steps: StepperStep[]): string | null {
  for (const step of steps) {
    if (step.disabled !== true) {
      return step.id;
    }
  }

  return null;
}

function resolveInitialActiveStepId(
  steps: StepperStep[],
  defaultActiveStepId: string | undefined,
): string | null {
  if (defaultActiveStepId != null) {
    const step = steps.find((item) => item.id === defaultActiveStepId);

    if (step != null && step.disabled !== true) {
      return step.id;
    }
  }

  return findFirstEnabledStepId(steps);
}

function resolveActiveStepId(
  steps: StepperStep[],
  candidateStepId: string | null,
): string | null {
  if (candidateStepId != null) {
    const step = steps.find((item) => item.id === candidateStepId);

    if (step != null && step.disabled !== true) {
      return step.id;
    }
  }

  return findFirstEnabledStepId(steps);
}

function resolveActiveSubstepId(
  steps: StepperStep[],
  candidateSubstepId: string | null,
  showDisabledSubsteps: boolean,
): string | null {
  if (candidateSubstepId == null) {
    return null;
  }

  for (const step of steps) {
    if (step.disabled === true) {
      continue;
    }

    for (const substep of getVisibleSubsteps(step, showDisabledSubsteps)) {
      if (substep.id === candidateSubstepId && substep.disabled !== true) {
        return substep.id;
      }
    }
  }

  return null;
}

function normalizeOpenStepIds(
  openStepIds: string[],
  steps: StepperStep[],
  options: NormalizationOptions,
): string[] {
  const validStepIds = new Set(steps.map((step) => step.id));
  const openSet = new Set<string>();

  for (const id of openStepIds) {
    if (!validStepIds.has(id)) {
      continue;
    }

    const step = steps.find((item) => item.id === id);

    if (
      step != null &&
      hasStepPanel(
        step,
        options.showDescriptions,
        options.showSubsteps,
        options.showDisabledSubsteps,
      )
    ) {
      openSet.add(id);
    }
  }

  if (options.enforceActiveOpen === true && options.activeStepId != null) {
    const activeStep = steps.find((step) => step.id === options.activeStepId);

    if (
      activeStep != null &&
      hasStepPanel(
        activeStep,
        options.showDescriptions,
        options.showSubsteps,
        options.showDisabledSubsteps,
      )
    ) {
      openSet.add(activeStep.id);
    }
  }

  if (!options.allowMultipleOpen) {
    const finalOrder: string[] = [];

    if (
      options.preferredStepId != null &&
      openSet.has(options.preferredStepId) &&
      !finalOrder.includes(options.preferredStepId)
    ) {
      finalOrder.push(options.preferredStepId);
    }

    if (finalOrder.length === 0) {
      for (let index = openStepIds.length - 1; index >= 0; index -= 1) {
        const candidateId = openStepIds[index];

        if (
          candidateId != null &&
          openSet.has(candidateId) &&
          !finalOrder.includes(candidateId)
        ) {
          finalOrder.push(candidateId);
          break;
        }
      }
    }

    if (finalOrder.length === 0) {
      const firstOpen = steps.find((step) => openSet.has(step.id));

      if (firstOpen != null) {
        finalOrder.push(firstOpen.id);
      }
    }

    return finalOrder;
  }

  return steps.filter((step) => openSet.has(step.id)).map((step) => step.id);
}

function resolveInitialOpenStepIds(
  steps: StepperStep[],
  defaultOpenStepIds: string[] | undefined,
  options: NormalizationOptions,
): string[] {
  const seeded = [...(defaultOpenStepIds ?? [])];

  if (options.activeStepId != null) {
    seeded.push(options.activeStepId);
  }

  for (const step of steps) {
    if (
      step.defaultOpen === true ||
      step.open === true ||
      step.keepOpen === true
    ) {
      seeded.push(step.id);
    }
  }

  return normalizeOpenStepIds(seeded, steps, options);
}

function toLabelText(label: ReactNode): string {
  if (typeof label === "string") {
    const trimmed = label.trim();
    return trimmed === "" ? "" : trimmed;
  }

  if (typeof label === "number") {
    return String(label);
  }

  if (Array.isArray(label)) {
    return label
      .map((part) => toLabelText(part))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
  }

  return "";
}

function getEnabledStepIndices(
  steps: StepperStep[],
  disabled: boolean,
): number[] {
  if (disabled) {
    return [];
  }

  return steps.reduce<number[]>((indices, step, index) => {
    if (step.disabled !== true) {
      indices.push(index);
    }

    return indices;
  }, []);
}

function resolveControlButton(
  config: StepperControlButtonConfig | undefined,
  defaults: {
    label: string;
    icon: ReactNode;
    ariaLabel: string;
    variant: NonNullable<ButtonProps["variant"]>;
    size: ButtonProps["size"];
  },
): ResolvedControlButton {
  const show = config?.show ?? true;
  const label = config?.label ?? defaults.label;
  const icon =
    config?.showIcon === false
      ? null
      : config?.icon !== undefined
        ? config.icon
        : defaults.icon;
  const iconOnly = config?.iconOnly ?? false;
  const iconPosition = config?.iconPosition ?? "left";
  const ariaLabel =
    config?.ariaLabel ??
    (typeof label === "string" ? label : defaults.ariaLabel);

  return {
    show,
    label,
    icon,
    iconOnly,
    iconPosition,
    ariaLabel,
    variant: config?.variant ?? defaults.variant,
    size: config?.size ?? defaults.size,
    compact: config?.compact ?? false,
  };
}

function renderControlContent(control: ResolvedControlButton): ReactNode {
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

export function Stepper({
  steps = [],
  variant,
  size = "md",
  activeStepId,
  defaultActiveStepId,
  onActiveStepChange,
  activeSubstepId,
  defaultActiveSubstepId,
  onActiveSubstepChange,
  openStepIds,
  defaultOpenStepIds,
  onOpenStepIdsChange,
  collapsible = true,
  allowMultipleOpen = false,
  disabled = false,
  showDescriptions = true,
  showShortDescriptions = true,
  showSubsteps = true,
  showDisabledSteps = true,
  showDisabledSubsteps = true,
  showStepNumbers = true,
  showIndicators = true,
  showControls = true,
  showControlsInside = false,
  showControlsOutside = true,
  showPrevious = true,
  showNext = true,
  showSubmit = true,
  submitOnLastStep = true,
  hideNextWhenLastStep = false,
  controls,
  onSubmit,
  onAction,
  className = "",
  style,
  role,
  ["aria-label"]: ariaLabel,
  ...props
}: StepperProps): JSX.Element {
  const generatedId = useId();
  const stepButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const resolvedVariant = resolveVariant(variant);
  const compact = isCompact(resolvedVariant);
  const horizontal = isHorizontal(resolvedVariant);
  const tokens = (compact ? compactTokens : regularTokens)[size];

  const visibleSteps = useMemo(
    () =>
      showDisabledSteps
        ? steps
        : steps.filter((step) => step.disabled !== true),
    [showDisabledSteps, steps],
  );

  const isActiveControlled = activeStepId !== undefined;
  const isOpenControlled = openStepIds !== undefined;
  const isActiveSubstepControlled = activeSubstepId !== undefined;

  const [uncontrolledActiveStepId, setUncontrolledActiveStepId] = useState<
    string | null
  >(() => resolveInitialActiveStepId(visibleSteps, defaultActiveStepId));

  const activeCandidate = isActiveControlled
    ? (activeStepId ?? null)
    : uncontrolledActiveStepId;

  const resolvedActiveStepId = resolveActiveStepId(
    visibleSteps,
    activeCandidate,
  );

  const normalizationOptions: NormalizationOptions = {
    activeStepId: resolvedActiveStepId,
    allowMultipleOpen,
    showDescriptions,
    showSubsteps,
    showDisabledSubsteps,
  };

  const [uncontrolledOpenStepIds, setUncontrolledOpenStepIds] = useState<
    string[]
  >(() =>
    resolveInitialOpenStepIds(
      visibleSteps,
      defaultOpenStepIds,
      normalizationOptions,
    ),
  );

  const openStepCandidates = isOpenControlled
    ? (openStepIds ?? [])
    : uncontrolledOpenStepIds;

  const resolvedOpenStepIds = useMemo(
    () =>
      normalizeOpenStepIds(
        openStepCandidates,
        visibleSteps,
        normalizationOptions,
      ),
    [normalizationOptions, openStepCandidates, visibleSteps],
  );

  const [uncontrolledActiveSubstepId, setUncontrolledActiveSubstepId] =
    useState<string | null>(defaultActiveSubstepId ?? null);

  const activeSubstepCandidate = isActiveSubstepControlled
    ? (activeSubstepId ?? null)
    : uncontrolledActiveSubstepId;

  const resolvedActiveSubstepId = resolveActiveSubstepId(
    visibleSteps,
    activeSubstepCandidate,
    showDisabledSubsteps,
  );

  useEffect(() => {
    if (
      !isActiveControlled &&
      resolvedActiveStepId !== uncontrolledActiveStepId
    ) {
      setUncontrolledActiveStepId(resolvedActiveStepId);
    }
  }, [isActiveControlled, resolvedActiveStepId, uncontrolledActiveStepId]);

  useEffect(() => {
    if (
      !isOpenControlled &&
      !areStringArraysEqual(resolvedOpenStepIds, uncontrolledOpenStepIds)
    ) {
      setUncontrolledOpenStepIds(resolvedOpenStepIds);
    }
  }, [isOpenControlled, resolvedOpenStepIds, uncontrolledOpenStepIds]);

  useEffect(() => {
    if (
      !isActiveSubstepControlled &&
      resolvedActiveSubstepId !== uncontrolledActiveSubstepId
    ) {
      setUncontrolledActiveSubstepId(resolvedActiveSubstepId);
    }
  }, [
    isActiveSubstepControlled,
    resolvedActiveSubstepId,
    uncontrolledActiveSubstepId,
  ]);

  const enabledStepIds = visibleSteps
    .filter((step) => disabled !== true && step.disabled !== true)
    .map((step) => step.id);

  const activeEnabledIndex =
    resolvedActiveStepId == null
      ? -1
      : enabledStepIds.indexOf(resolvedActiveStepId);

  const previousStepId =
    activeEnabledIndex > 0 ? enabledStepIds[activeEnabledIndex - 1] : null;

  const nextStepId =
    activeEnabledIndex >= 0 && activeEnabledIndex < enabledStepIds.length - 1
      ? enabledStepIds[activeEnabledIndex + 1]
      : null;

  const isLastEnabledStep =
    activeEnabledIndex >= 0 && activeEnabledIndex === enabledStepIds.length - 1;

  function emitAction(
    source: StepperActionSource,
    options?: {
      activeStepId?: string | null;
      stepId?: string;
      substepId?: string;
      openStepIds?: string[];
      event?: unknown;
    },
  ): void {
    onAction?.({
      source,
      activeStepId: options?.activeStepId ?? resolvedActiveStepId,
      stepId: options?.stepId,
      substepId: options?.substepId,
      openStepIds: options?.openStepIds ?? resolvedOpenStepIds,
      variant: resolvedVariant,
      size,
      event: options?.event,
    });
  }

  function updateOpenSteps(
    nextOpenStepIds: string[],
    options?: {
      source?: StepperActionSource;
      stepId?: string;
      activeStepId?: string | null;
      preferredStepId?: string | null;
      enforceActiveOpen?: boolean;
      event?: unknown;
    },
  ): string[] {
    const normalized = normalizeOpenStepIds(nextOpenStepIds, visibleSteps, {
      activeStepId: options?.activeStepId ?? resolvedActiveStepId,
      allowMultipleOpen,
      showDescriptions,
      showSubsteps,
      showDisabledSubsteps,
      preferredStepId: options?.preferredStepId,
      enforceActiveOpen: options?.enforceActiveOpen,
    });

    if (!areStringArraysEqual(normalized, resolvedOpenStepIds)) {
      if (!isOpenControlled) {
        setUncontrolledOpenStepIds(normalized);
      }

      onOpenStepIdsChange?.(normalized);
    }

    if (options?.source != null) {
      emitAction(options.source, {
        stepId: options.stepId,
        activeStepId: options.activeStepId,
        openStepIds: normalized,
        event: options.event,
      });
    }

    return normalized;
  }

  function handleStepSelect(
    step: StepperStep,
    event: ReactMouseEvent<HTMLButtonElement>,
    source: StepperActionSource,
  ): void {
    if (disabled || step.disabled === true) {
      return;
    }

    const nextActiveStepId = step.id;

    if (!isActiveControlled) {
      setUncontrolledActiveStepId(nextActiveStepId);
    }

    if (nextActiveStepId !== resolvedActiveStepId || isActiveControlled) {
      onActiveStepChange?.(nextActiveStepId);
    }

    const hasPanel = hasStepPanel(
      step,
      showDescriptions,
      showSubsteps,
      showDisabledSubsteps,
    );
    const nextOpenStepIds = hasPanel
      ? updateOpenSteps([...resolvedOpenStepIds, step.id], {
          activeStepId: nextActiveStepId,
          preferredStepId: step.id,
          enforceActiveOpen: true,
        })
      : resolvedOpenStepIds;

    emitAction(source, {
      activeStepId: nextActiveStepId,
      stepId: step.id,
      openStepIds: nextOpenStepIds,
      event,
    });
  }

  function handleStepToggle(
    step: StepperStep,
    event: ReactMouseEvent<HTMLButtonElement>,
  ): void {
    if (
      disabled ||
      !hasStepPanel(
        step,
        showDescriptions,
        showSubsteps,
        showDisabledSubsteps,
      ) ||
      (step.collapsible ?? collapsible) !== true
    ) {
      return;
    }

    const isOpen = resolvedOpenStepIds.includes(step.id);

    const next = isOpen
      ? resolvedOpenStepIds.filter((id) => id !== step.id)
      : [...resolvedOpenStepIds, step.id];

    updateOpenSteps(next, {
      source: "step-toggle",
      stepId: step.id,
      event,
    });
  }

  function handleSubstepSelect(
    step: StepperStep,
    substep: StepperSubstep,
    event: ReactMouseEvent<HTMLButtonElement>,
  ): void {
    if (
      disabled ||
      step.disabled === true ||
      substep.disabled === true ||
      !hasStepPanel(step, showDescriptions, showSubsteps, showDisabledSubsteps)
    ) {
      return;
    }

    if (!isActiveSubstepControlled) {
      setUncontrolledActiveSubstepId(substep.id);
    }

    onActiveSubstepChange?.(substep.id, step.id);

    let nextActiveStepId = resolvedActiveStepId;

    if (resolvedActiveStepId !== step.id) {
      nextActiveStepId = step.id;

      if (!isActiveControlled) {
        setUncontrolledActiveStepId(step.id);
      }

      onActiveStepChange?.(step.id);
    }

    const nextOpenStepIds = updateOpenSteps([...resolvedOpenStepIds, step.id], {
      activeStepId: step.id,
      preferredStepId: step.id,
      enforceActiveOpen: true,
    });

    emitAction("substep-select", {
      activeStepId: nextActiveStepId,
      stepId: step.id,
      substepId: substep.id,
      openStepIds: nextOpenStepIds,
      event,
    });
  }

  function handleStepTrigger(
    step: StepperStep,
    event: ReactMouseEvent<HTMLButtonElement>,
  ): void {
    if (disabled) {
      return;
    }

    const stepHasPanel = hasStepPanel(
      step,
      showDescriptions,
      showSubsteps,
      showDisabledSubsteps,
    );
    const stepCollapsible =
      stepHasPanel && (step.collapsible ?? collapsible) === true;
    const stepOpen = resolvedOpenStepIds.includes(step.id);

    if (step.disabled === true) {
      if (stepCollapsible) {
        handleStepToggle(step, event);
      }

      return;
    }

    if (stepCollapsible && stepOpen) {
      handleStepToggle(step, event);
      return;
    }

    handleStepSelect(step, event, "step-select");
  }

  function handlePrevious(event: ReactMouseEvent<HTMLButtonElement>): void {
    if (previousStepId == null) {
      return;
    }

    const step = visibleSteps.find((item) => item.id === previousStepId);

    if (step == null) {
      return;
    }

    handleStepSelect(step, event, "previous");
  }

  function handleNext(event: ReactMouseEvent<HTMLButtonElement>): void {
    if (nextStepId == null) {
      return;
    }

    const step = visibleSteps.find((item) => item.id === nextStepId);

    if (step == null) {
      return;
    }

    handleStepSelect(step, event, "next");
  }

  function handleSubmit(event: ReactMouseEvent<HTMLButtonElement>): void {
    onSubmit?.(resolvedActiveStepId);

    emitAction("submit", {
      activeStepId: resolvedActiveStepId,
      stepId: resolvedActiveStepId ?? undefined,
      event,
    });
  }

  function focusStepByIndex(index: number): void {
    const element = stepButtonRefs.current[index];

    if (element != null) {
      element.focus();
    }
  }

  function handleStepKeyDown(
    stepIndex: number,
    event: ReactKeyboardEvent<HTMLButtonElement>,
  ): void {
    if (disabled) {
      return;
    }

    const enabledIndices = getEnabledStepIndices(visibleSteps, disabled);

    if (enabledIndices.length === 0) {
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      const first = enabledIndices[0];

      if (first != null) {
        focusStepByIndex(first);
      }

      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      const last = enabledIndices[enabledIndices.length - 1];

      if (last != null) {
        focusStepByIndex(last);
      }

      return;
    }

    const isPreviousKey = horizontal
      ? event.key === "ArrowLeft"
      : event.key === "ArrowUp";

    const isNextKey = horizontal
      ? event.key === "ArrowRight"
      : event.key === "ArrowDown";

    if (!isPreviousKey && !isNextKey) {
      return;
    }

    event.preventDefault();

    const currentEnabledPosition = enabledIndices.indexOf(stepIndex);

    if (currentEnabledPosition < 0) {
      const fallback = enabledIndices[0];

      if (fallback != null) {
        focusStepByIndex(fallback);
      }

      return;
    }

    const direction = isNextKey ? 1 : -1;
    const nextEnabledPosition =
      (currentEnabledPosition + direction + enabledIndices.length) %
      enabledIndices.length;

    const nextStepIndex = enabledIndices[nextEnabledPosition];

    if (nextStepIndex != null) {
      focusStepByIndex(nextStepIndex);
    }
  }

  const previousControl = resolveControlButton(controls?.previous, {
    label: "Previous",
    icon: <FiChevronLeft size={tokens.iconSize} />,
    ariaLabel: "Go to previous step",
    variant: "outline",
    size,
  });

  const nextControl = resolveControlButton(controls?.next, {
    label: "Next",
    icon: <FiChevronRight size={tokens.iconSize} />,
    ariaLabel: "Go to next step",
    variant: "primary",
    size,
  });

  const submitControl = resolveControlButton(controls?.submit, {
    label: "Submit",
    icon: <FiCheck size={tokens.iconSize} />,
    ariaLabel: "Submit stepper",
    variant: "primary",
    size,
  });

  const successButtonStyle: CSSProperties = {
    backgroundColor: "var(--ktn-action-success-bg, #16a34a)",
    borderColor: "var(--ktn-action-success-bg, #16a34a)",
    color: "var(--ktn-action-primary-fg, #ffffff)",
  };

  const shouldRenderControlsInside = showControls && showControlsInside;
  const shouldRenderControlsOutside = showControls && showControlsOutside;

  const composedClassName = `${baseClasses} ${className}`.trim();

  const rootStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: tokens.rootGap,
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    color: "var(--ktn-text-primary)",
    ...style,
  };

  const listStyle: CSSProperties = {
    display: horizontal ? "flex" : "flex",
    flexDirection: horizontal ? "row" : "column",
    alignItems: horizontal ? "flex-start" : "stretch",
    gap: tokens.stepGap,
    width: "100%",
    minWidth: 0,
    overflowX: horizontal ? "auto" : "visible",
    paddingBottom: horizontal ? "0.2rem" : 0,
    boxSizing: "border-box",
  };

  function renderControlsRow(
    placement: "inside" | "outside",
    contextStepId?: string,
  ): JSX.Element {
    const resolvedContextStepId = contextStepId ?? resolvedActiveStepId ?? null;

    const contextEnabledIndex =
      resolvedContextStepId == null
        ? -1
        : enabledStepIds.indexOf(resolvedContextStepId);

    const contextPreviousStepId =
      contextEnabledIndex > 0
        ? (enabledStepIds[contextEnabledIndex - 1] ?? null)
        : null;

    const contextNextStepId =
      contextEnabledIndex >= 0 &&
      contextEnabledIndex < enabledStepIds.length - 1
        ? (enabledStepIds[contextEnabledIndex + 1] ?? null)
        : null;

    const contextIsLastEnabledStep =
      contextEnabledIndex >= 0 &&
      contextEnabledIndex === enabledStepIds.length - 1;

    function handleContextPrevious(
      event: ReactMouseEvent<HTMLButtonElement>,
    ): void {
      if (contextPreviousStepId == null) {
        return;
      }

      const previousStep = visibleSteps.find(
        (item) => item.id === contextPreviousStepId,
      );

      if (previousStep == null) {
        return;
      }

      handleStepSelect(previousStep, event, "previous");
    }

    function handleContextNext(
      event: ReactMouseEvent<HTMLButtonElement>,
    ): void {
      if (contextNextStepId == null) {
        return;
      }

      const nextStep = visibleSteps.find(
        (item) => item.id === contextNextStepId,
      );

      if (nextStep == null) {
        return;
      }

      handleStepSelect(nextStep, event, "next");
    }

    function handleContextSubmit(
      event: ReactMouseEvent<HTMLButtonElement>,
    ): void {
      onSubmit?.(resolvedContextStepId);

      emitAction("submit", {
        activeStepId: resolvedContextStepId,
        stepId: resolvedContextStepId ?? undefined,
        event,
      });
    }

    const rowStyle: CSSProperties = {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      flexWrap: "wrap",
      gap: tokens.controlGap,
      borderTop: "1px solid var(--ktn-border-muted)",
      paddingTop: tokens.panelPadding,
      marginTop: placement === "inside" ? "0.2rem" : 0,
    };

    const controlsRightStyle: CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      gap: tokens.controlGap,
      flexWrap: "wrap",
    };

    const insideIconsOnly = placement === "inside";

    const effectivePreviousControl: ResolvedControlButton = insideIconsOnly
      ? {
          ...previousControl,
          iconOnly: true,
          compact: true,
          icon: previousControl.icon ?? (
            <FiChevronLeft size={tokens.iconSize} />
          ),
        }
      : previousControl;

    const effectiveNextControl: ResolvedControlButton = insideIconsOnly
      ? {
          ...nextControl,
          iconOnly: true,
          compact: true,
          icon: nextControl.icon ?? <FiChevronRight size={tokens.iconSize} />,
        }
      : nextControl;

    const effectiveSubmitControl: ResolvedControlButton = insideIconsOnly
      ? {
          ...submitControl,
          iconOnly: true,
          compact: true,
          icon: submitControl.icon ?? <FiCheck size={tokens.iconSize} />,
        }
      : submitControl;

    const shouldShowPreviousControl =
      showPrevious && effectivePreviousControl.show;

    const shouldShowNextControl = showNext && effectiveNextControl.show;

    const shouldShowSubmitControl = showSubmit && effectiveSubmitControl.show;

    return (
      <div style={rowStyle} data-controls-placement={placement}>
        <div style={controlsRightStyle}>
          {shouldShowPreviousControl ? (
            <Button
              variant={effectivePreviousControl.variant}
              size={effectivePreviousControl.size}
              compact={effectivePreviousControl.compact}
              iconOnly={effectivePreviousControl.iconOnly}
              aria-label={effectivePreviousControl.ariaLabel}
              disabled={disabled || contextPreviousStepId == null}
              onAction={handleContextPrevious}
            >
              {renderControlContent(effectivePreviousControl)}
            </Button>
          ) : null}

          {shouldShowNextControl &&
          !(hideNextWhenLastStep && contextIsLastEnabledStep) ? (
            <Button
              variant={effectiveNextControl.variant}
              size={effectiveNextControl.size}
              compact={effectiveNextControl.compact}
              iconOnly={effectiveNextControl.iconOnly}
              aria-label={effectiveNextControl.ariaLabel}
              disabled={disabled || contextNextStepId == null}
              onAction={handleContextNext}
            >
              {renderControlContent(effectiveNextControl)}
            </Button>
          ) : null}

          {shouldShowSubmitControl &&
          submitOnLastStep &&
          contextIsLastEnabledStep ? (
            <Button
              variant={effectiveSubmitControl.variant}
              size={effectiveSubmitControl.size}
              compact={effectiveSubmitControl.compact}
              iconOnly={effectiveSubmitControl.iconOnly}
              aria-label={effectiveSubmitControl.ariaLabel}
              disabled={disabled}
              style={successButtonStyle}
              onAction={handleContextSubmit}
            >
              {renderControlContent(effectiveSubmitControl)}
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div
      className={composedClassName}
      style={rootStyle}
      role={role ?? "navigation"}
      aria-label={ariaLabel ?? "Stepper"}
      {...props}
    >
      <ol style={listStyle}>
        {visibleSteps.map((step, index) => {
          const stepDisabled = disabled || step.disabled === true;
          const stepActive = step.id === resolvedActiveStepId;
          const stepCompleted = step.completed === true;
          const reachedStepIndex = enabledStepIds.indexOf(step.id);
          const stepPassed =
            reachedStepIndex >= 0 &&
            activeEnabledIndex >= 0 &&
            reachedStepIndex < activeEnabledIndex;
          const stepReached = stepCompleted || stepActive || stepPassed;
          const stepHasPanel = hasStepPanel(
            step,
            showDescriptions,
            showSubsteps,
            showDisabledSubsteps,
          );
          const visibleSubsteps = getVisibleSubsteps(
            step,
            showDisabledSubsteps,
          );
          const stepCollapsible =
            stepHasPanel && (step.collapsible ?? collapsible);
          const stepOpen = stepCollapsible
            ? resolvedOpenStepIds.includes(step.id)
            : stepActive && stepHasPanel;

          const indicatorTextColor = stepDisabled
            ? "var(--ktn-text-secondary, var(--ktn-text-primary))"
            : stepCompleted
              ? "var(--ktn-action-success-bg, #16a34a)"
              : stepActive
                ? "var(--ktn-action-primary-bg)"
                : "var(--ktn-text-secondary, var(--ktn-text-primary))";

          const lineActiveColor =
            "color-mix(in srgb, var(--ktn-action-primary-bg) 70%, white)";
          const lineInactiveColor = "var(--ktn-border-muted)";
          const connectorGapCompensation = `calc(${tokens.stepGap} / 2)`;

          const leftLineActive = stepReached;
          const rightLineActive = stepCompleted || stepPassed;

          const markerSize = tokens.indicatorSize;

          const indicatorVariant = stepDisabled
            ? "outline"
            : stepActive || stepCompleted
              ? "primary"
              : "secondary";

          const indicatorContent = step.completed ? (
            <FiCheck size={tokens.iconSize} />
          ) : step.icon != null ? (
            step.icon
          ) : showStepNumbers ? (
            index + 1
          ) : (
            <span
              aria-hidden
              style={{
                width: "0.32rem",
                height: "0.32rem",
                borderRadius: "999px",
                backgroundColor: "currentColor",
              }}
            />
          );

          const triggerId = `${generatedId}-step-trigger-${index}`;
          const panelId = `${generatedId}-step-panel-${index}`;

          const itemStyle: CSSProperties = {
            display: "flex",
            flexDirection: "column",
            gap: tokens.panelGap,
            minWidth: 0,
            flex: horizontal ? "0 0 auto" : "0 1 auto",
            width: horizontal ? (compact ? "10rem" : "13rem") : "100%",
            opacity: stepDisabled ? 0.62 : 1,
          };

          const headerContainerStyle: CSSProperties = {
            display: "flex",
            alignItems: "flex-start",
            gap: tokens.panelGap,
            minWidth: 0,
            width: "100%",
          };

          const triggerStyle: CSSProperties = {
            flex: "1 1 auto",
            minWidth: 0,
            display: "flex",
            flexDirection: horizontal ? "column" : "row",
            alignItems: horizontal ? "stretch" : "flex-start",
            gap: horizontal ? "0.32rem" : tokens.panelGap,
            border: 0,
            backgroundColor: "transparent",
            color: "inherit",
            textAlign: horizontal ? "center" : "left",
            padding: 0,
            cursor:
              disabled || (stepDisabled && !stepCollapsible)
                ? "not-allowed"
                : "pointer",
          };

          const horizontalIndicatorRowStyle: CSSProperties = {
            display: "flex",
            alignItems: "center",
            width: "100%",
            minWidth: 0,
            gap: "0.32rem",
          };

          const lineStyle: CSSProperties = {
            flex: "1 1 auto",
            minWidth: compact ? "0.7rem" : "1rem",
            height: "2px",
            borderRadius: "999px",
            backgroundColor: lineInactiveColor,
          };

          const verticalRailStyle: CSSProperties = {
            width: markerSize,
            minWidth: markerSize,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            alignSelf: "stretch",
            gap: "0.16rem",
            flexShrink: 0,
          };

          const verticalLineStyle: CSSProperties = {
            width: "2px",
            flex: "1 1 auto",
            minHeight: compact ? "0.4rem" : "0.6rem",
            borderRadius: "999px",
            backgroundColor: lineInactiveColor,
          };

          const markerStyle: CSSProperties = {
            width: markerSize,
            minWidth: markerSize,
            height: markerSize,
            padding: 0,
            borderRadius: "999px",
            fontSize: tokens.indicatorFontSize,
            lineHeight: 1,
            flexShrink: 0,
          };

          const indicatorBadgeStyle: CSSProperties = stepCompleted
            ? {
                ...markerStyle,
                backgroundColor:
                  "color-mix(in srgb, var(--ktn-action-success-bg, #16a34a) 16%, white)",
                borderColor:
                  "color-mix(in srgb, var(--ktn-action-success-bg, #16a34a) 32%, white)",
              }
            : markerStyle;

          const titleWrapStyle: CSSProperties = {
            display: "flex",
            flexDirection: "column",
            alignItems: horizontal ? "center" : "flex-start",
            textAlign: horizontal ? "center" : "left",
            gap: "0.14rem",
            minWidth: 0,
            flex: "1 1 auto",
          };

          const titleStyle: CSSProperties = {
            margin: 0,
            fontSize: tokens.titleFontSize,
            fontWeight: 600,
            lineHeight: 1.3,
            color: stepActive
              ? "color-mix(in srgb, var(--ktn-action-primary-bg) 86%, black)"
              : "var(--ktn-text-primary)",
            overflow: "hidden",
            textOverflow: "ellipsis",
          };

          const shortDescriptionStyle: CSSProperties = {
            margin: 0,
            fontSize: tokens.shortDescriptionFontSize,
            lineHeight: 1.35,
            color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
            overflow: "hidden",
            textOverflow: "ellipsis",
          };

          const panelStyle: CSSProperties = {
            display: stepOpen ? "flex" : "none",
            flexDirection: "column",
            gap: tokens.panelGap,
            minWidth: 0,
            marginInlineStart:
              horizontal || !showIndicators
                ? 0
                : `calc(${tokens.indicatorSize} + ${tokens.panelGap})`,
            border: "1px solid var(--ktn-border-muted)",
            borderColor: stepActive
              ? "color-mix(in srgb, var(--ktn-action-primary-bg) 32%, var(--ktn-border-muted))"
              : "var(--ktn-border-muted)",
            borderRadius: "var(--ktn-radius-md)",
            backgroundColor: "var(--ktn-bg-surface, #ffffff)",
            boxShadow:
              "var(--ktn-shadow-sm, 0 6px 16px rgba(15, 23, 42, 0.08))",
            padding: tokens.panelPadding,
          };

          const descriptionStyle: CSSProperties = {
            margin: 0,
            fontSize: tokens.descriptionFontSize,
            lineHeight: 1.45,
            color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
          };

          const substepListStyle: CSSProperties = {
            display: "flex",
            flexDirection: "column",
            gap: "0.35rem",
            margin: 0,
            padding: 0,
            listStyle: "none",
          };

          const substepButtonStyle: CSSProperties = {
            width: "100%",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.4rem",
            border: "1px solid var(--ktn-border-muted)",
            borderRadius: "var(--ktn-radius-sm)",
            backgroundColor: "var(--ktn-bg-surface, #ffffff)",
            color: "var(--ktn-text-primary)",
            textAlign: "left",
            paddingBlock: tokens.substepPaddingY,
            paddingInline: tokens.substepPaddingX,
            cursor: "pointer",
          };

          const substepLabelStyle: CSSProperties = {
            margin: 0,
            fontSize: tokens.shortDescriptionFontSize,
            fontWeight: 500,
            lineHeight: 1.3,
          };

          const substepDescriptionStyle: CSSProperties = {
            margin: 0,
            fontSize: tokens.descriptionFontSize,
            lineHeight: 1.35,
            color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
          };

          return (
            <li key={step.id} style={{ listStyle: "none", minWidth: 0 }}>
              <article style={itemStyle}>
                <div style={headerContainerStyle}>
                  <button
                    id={triggerId}
                    ref={(element) => {
                      stepButtonRefs.current[index] = element;
                    }}
                    type="button"
                    style={triggerStyle}
                    disabled={disabled}
                    aria-disabled={stepDisabled}
                    aria-label={
                      step.ariaLabel ??
                      (toLabelText(step.title) || `Step ${index + 1}`)
                    }
                    aria-current={stepActive ? "step" : undefined}
                    aria-controls={stepHasPanel ? panelId : undefined}
                    aria-expanded={stepCollapsible ? stepOpen : undefined}
                    onClick={(event) => {
                      handleStepTrigger(step, event);
                    }}
                    onKeyDown={(event) => {
                      handleStepKeyDown(index, event);
                    }}
                  >
                    {showIndicators && horizontal ? (
                      <span style={horizontalIndicatorRowStyle}>
                        {index > 0 ? (
                          <span
                            aria-hidden
                            style={{
                              ...lineStyle,
                              marginInlineStart: `-${connectorGapCompensation}`,
                              backgroundColor: leftLineActive
                                ? lineActiveColor
                                : lineInactiveColor,
                            }}
                          />
                        ) : (
                          <span
                            aria-hidden
                            style={{ ...lineStyle, opacity: 0 }}
                          />
                        )}

                        <Badge
                          size={size}
                          variant={indicatorVariant}
                          style={indicatorBadgeStyle}
                          aria-hidden
                        >
                          <span style={{ color: indicatorTextColor }}>
                            {indicatorContent}
                          </span>
                        </Badge>

                        {index < visibleSteps.length - 1 ? (
                          <span
                            aria-hidden
                            style={{
                              ...lineStyle,
                              marginInlineEnd: `-${connectorGapCompensation}`,
                              backgroundColor: rightLineActive
                                ? lineActiveColor
                                : lineInactiveColor,
                            }}
                          />
                        ) : (
                          <span
                            aria-hidden
                            style={{ ...lineStyle, opacity: 0 }}
                          />
                        )}
                      </span>
                    ) : null}

                    {showIndicators && !horizontal ? (
                      <span style={verticalRailStyle}>
                        {index > 0 ? (
                          <span
                            aria-hidden
                            style={{
                              ...verticalLineStyle,
                              marginBlockStart: `-${connectorGapCompensation}`,
                              backgroundColor: leftLineActive
                                ? lineActiveColor
                                : lineInactiveColor,
                            }}
                          />
                        ) : (
                          <span
                            aria-hidden
                            style={{ ...verticalLineStyle, opacity: 0 }}
                          />
                        )}

                        <Badge
                          size={size}
                          variant={indicatorVariant}
                          style={indicatorBadgeStyle}
                          aria-hidden
                        >
                          <span style={{ color: indicatorTextColor }}>
                            {indicatorContent}
                          </span>
                        </Badge>

                        {index < visibleSteps.length - 1 ? (
                          <span
                            aria-hidden
                            style={{
                              ...verticalLineStyle,
                              marginBlockEnd: `-${connectorGapCompensation}`,
                              backgroundColor: rightLineActive
                                ? lineActiveColor
                                : lineInactiveColor,
                            }}
                          />
                        ) : (
                          <span
                            aria-hidden
                            style={{ ...verticalLineStyle, opacity: 0 }}
                          />
                        )}
                      </span>
                    ) : null}

                    <span style={titleWrapStyle}>
                      <span style={titleStyle}>{step.title}</span>

                      {showShortDescriptions &&
                      step.shortDescription != null ? (
                        <span style={shortDescriptionStyle}>
                          {step.shortDescription}
                        </span>
                      ) : null}
                    </span>
                  </button>

                  {stepCollapsible ? (
                    <Button
                      variant="ghost"
                      size={compact ? "xs" : "sm"}
                      compact
                      iconOnly
                      disabled={disabled}
                      aria-label={`${stepOpen ? "Collapse" : "Expand"} ${
                        toLabelText(step.title) || `step ${index + 1}`
                      }`}
                      onAction={(event) => {
                        handleStepToggle(step, event);
                      }}
                    >
                      {stepOpen ? (
                        <FiChevronUp size={tokens.iconSize} />
                      ) : (
                        <FiChevronDown size={tokens.iconSize} />
                      )}
                    </Button>
                  ) : null}
                </div>

                <div
                  id={panelId}
                  role={stepHasPanel ? "region" : undefined}
                  aria-labelledby={stepHasPanel ? triggerId : undefined}
                  style={panelStyle}
                >
                  {showDescriptions && step.description != null ? (
                    <p style={descriptionStyle}>{step.description}</p>
                  ) : null}

                  {showDescriptions &&
                  step.description != null &&
                  showSubsteps &&
                  visibleSubsteps.length > 0 ? (
                    <Separator orientation="horizontal" size="xs" />
                  ) : null}

                  {showSubsteps && visibleSubsteps.length > 0 ? (
                    <ul style={substepListStyle}>
                      {visibleSubsteps.map((substep, substepIndex) => {
                        const substepDisabled =
                          stepDisabled || substep.disabled === true;
                        const substepActive =
                          resolvedActiveSubstepId != null &&
                          resolvedActiveSubstepId === substep.id;

                        const substepIndicator = substep.completed ? (
                          <FiCheck size={Math.max(tokens.iconSize - 2, 10)} />
                        ) : substep.icon != null ? (
                          substep.icon
                        ) : (
                          <span
                            aria-hidden
                            style={{
                              width: "0.3rem",
                              height: "0.3rem",
                              borderRadius: "999px",
                              backgroundColor: "currentColor",
                              marginTop: "0.32rem",
                            }}
                          />
                        );

                        const computedStyle: CSSProperties = {
                          ...substepButtonStyle,
                          opacity: substepDisabled ? 0.6 : 1,
                          borderColor: substepActive
                            ? "color-mix(in srgb, var(--ktn-action-primary-bg) 34%, var(--ktn-border-muted))"
                            : "var(--ktn-border-muted)",
                          backgroundColor: substepActive
                            ? "color-mix(in srgb, var(--ktn-action-primary-bg) 6%, var(--ktn-bg-surface, #ffffff))"
                            : "var(--ktn-bg-surface, #ffffff)",
                          cursor: substepDisabled ? "not-allowed" : "pointer",
                        };

                        return (
                          <li key={`${step.id}-${substep.id}-${substepIndex}`}>
                            <button
                              type="button"
                              style={computedStyle}
                              disabled={substepDisabled}
                              aria-disabled={substepDisabled}
                              aria-current={substepActive ? "step" : undefined}
                              aria-label={
                                substep.ariaLabel ??
                                (toLabelText(substep.title) ||
                                  `Substep ${substepIndex + 1}`)
                              }
                              onClick={(event) => {
                                handleSubstepSelect(step, substep, event);
                              }}
                            >
                              <span
                                aria-hidden
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: substepActive
                                    ? "color-mix(in srgb, var(--ktn-action-primary-bg) 88%, black)"
                                    : "var(--ktn-text-secondary, var(--ktn-text-primary))",
                                  marginTop: "0.05rem",
                                  flexShrink: 0,
                                }}
                              >
                                {substepIndicator}
                              </span>

                              <span
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "0.12rem",
                                  minWidth: 0,
                                  flex: "1 1 auto",
                                }}
                              >
                                <span style={substepLabelStyle}>
                                  {substep.title}
                                </span>

                                {substep.shortDescription != null ? (
                                  <span style={substepDescriptionStyle}>
                                    {substep.shortDescription}
                                  </span>
                                ) : null}

                                {substep.description != null ? (
                                  <span style={substepDescriptionStyle}>
                                    {substep.description}
                                  </span>
                                ) : null}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}

                  {step.content != null ? (
                    <>
                      {showSubsteps && visibleSubsteps.length > 0 ? (
                        <Separator orientation="horizontal" size="xs" />
                      ) : null}

                      <div style={{ minWidth: 0 }}>{step.content}</div>
                    </>
                  ) : null}

                  {shouldRenderControlsInside
                    ? renderControlsRow("inside", step.id)
                    : null}
                </div>
              </article>
            </li>
          );
        })}
      </ol>

      {shouldRenderControlsOutside ? renderControlsRow("outside") : null}
    </div>
  );
}
