import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { useVirtualizer } from "@tanstack/react-virtual";

import { Badge, type BadgeVariant } from "./Badge";
import { Button, type ButtonProps } from "./Button";
import { Card } from "./Card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./DropdownMenu";
import { FiMoreVertical } from "./icons/feather";
import { Progress, type ProgressSize } from "./Progress";
import { Scrollbar } from "./Scrollbar";

export type AdaptiveCardVariant = "default" | "compact" | "ghost";
export type AdaptiveCardSize = "xs" | "sm" | "md" | "lg";
export type AdaptiveCardFieldType =
  | "auto"
  | "text"
  | "link"
  | "number"
  | "currency"
  | "percent"
  | "date"
  | "phone"
  | "status"
  | "badge"
  | "progress"
  | "media";
export type AdaptiveCardActionMode = "auto" | "inline" | "menu";
export type AdaptiveCardActionAlignment = "left" | "right";
export type AdaptiveCardActionPlacement = "top" | "bottom";
export type AdaptiveCardActionLayout = "own-row" | "same-row";
export type AdaptiveCardInnerColumns = 1 | 2 | 3;

type AdaptiveCardStatusTone = "neutral" | "positive" | "warning" | "negative";

export interface AdaptiveCardColumns {
  mobile?: number;
  tablet?: number;
  web?: number;
}

export interface AdaptiveCardColumnBreakpoints {
  tablet?: number;
  web?: number;
}

export interface AdaptiveCardFieldSchema<TData extends object = object> {
  key: Extract<keyof TData, string> | string;
  label?: ReactNode;
  showLabel?: boolean;
  type?: AdaptiveCardFieldType;
  align?: "left" | "right";
  span?: 1 | 2 | 3 | "full";
  priority?: number;
  hideIfEmpty?: boolean;
  formatter?: (value: unknown, row: TData, rowIndex: number) => ReactNode;
  locale?: string;
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  dateOptions?: Intl.DateTimeFormatOptions;
  mediaAlt?: string;
  mediaType?: "auto" | "image" | "video" | "audio" | "file";
}

export interface AdaptiveCardAction<TData extends object = object> {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  variant?: ButtonProps["variant"];
  disabled?: boolean | ((row: TData, rowIndex: number) => boolean);
  onAction?: (row: TData, rowIndex: number) => void;
}

export type AdaptiveCardActionSource = "item-action";

export interface AdaptiveCardActionContext<TData extends object = object> {
  source: AdaptiveCardActionSource;
  actionId?: string;
  row?: TData;
  rowIndex?: number;
  event?: unknown;
}

export interface AdaptiveCardProps<TData extends object = object> extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  data?: TData[];
  schema?: AdaptiveCardFieldSchema<TData>[];
  rowKey?: keyof TData | ((row: TData, index: number) => string | number);

  variant?: AdaptiveCardVariant;
  size?: AdaptiveCardSize;
  locale?: string;
  currency?: string;
  showFieldLabels?: boolean;

  insideColumns?: AdaptiveCardInnerColumns;
  columns?: number | AdaptiveCardColumns;
  columnBreakpoints?: AdaptiveCardColumnBreakpoints;

  actions?:
    | AdaptiveCardAction<TData>[]
    | ((row: TData, rowIndex: number) => AdaptiveCardAction<TData>[]);
  actionMode?: AdaptiveCardActionMode;
  actionInlineMaxVisible?: number;
  actionAlignment?: AdaptiveCardActionAlignment;
  actionPlacement?: AdaptiveCardActionPlacement;
  actionLayout?: AdaptiveCardActionLayout;
  actionMenuLabel?: ReactNode;

  virtualized?: boolean;
  virtualizedMaxHeight?: number | string;
  virtualizedEstimateSize?: number;
  virtualizedOverscan?: number;

  viewportMaxHeight?: number | string;
  emptyText?: ReactNode;
  onAction?: (context: AdaptiveCardActionContext<TData>) => void;
}

type AdaptiveCardVariantTokens = {
  surfaceBackground: string;
  surfaceBorder: string;
  surfaceShadow: string;
  labelColor: string;
  valueColor: string;
  mutedColor: string;
};

type AdaptiveCardSizeTokens = {
  cardSize: "xs" | "sm" | "md" | "lg";
  cardPadding: string;
  cardGap: string;
  listGap: string;
  fieldGap: string;
  labelFontSize: string;
  valueFontSize: string;
  valueLineHeight: number;
  actionGap: string;
  actionButtonSize: "xs" | "sm" | "md" | "lg";
  progressSize: ProgressSize;
  iconSize: number;
  mediaHeight: string;
};

interface ResolvedAdaptiveCardColumns {
  mobile: number;
  tablet: number;
  web: number;
}

interface ResolvedAdaptiveCardBreakpoints {
  tablet: number;
  web: number;
}

interface ResolvedAdaptiveCardFieldSchema<
  TData extends object,
> extends AdaptiveCardFieldSchema<TData> {
  key: string;
  label: ReactNode;
  type: AdaptiveCardFieldType;
  align: "left" | "right";
  span: 1 | 2 | 3 | "full";
  priority: number;
  showLabel: boolean;
  hideIfEmpty: boolean;
}

const baseClasses = "flex w-full min-w-0 flex-col";
const defaultEmptyText = "No adaptive cards available.";

const sizeTokens: Record<AdaptiveCardSize, AdaptiveCardSizeTokens> = {
  xs: {
    cardSize: "xs",
    cardPadding: "0.56rem",
    cardGap: "0.42rem",
    listGap: "0.58rem",
    fieldGap: "0.3rem",
    labelFontSize: "0.68rem",
    valueFontSize: "0.78rem",
    valueLineHeight: 1.35,
    actionGap: "0.3rem",
    actionButtonSize: "xs",
    progressSize: "xs",
    iconSize: 12,
    mediaHeight: "8.5rem",
  },
  sm: {
    cardSize: "sm",
    cardPadding: "0.68rem",
    cardGap: "0.52rem",
    listGap: "0.72rem",
    fieldGap: "0.34rem",
    labelFontSize: "0.72rem",
    valueFontSize: "0.84rem",
    valueLineHeight: 1.4,
    actionGap: "0.36rem",
    actionButtonSize: "sm",
    progressSize: "sm",
    iconSize: 13,
    mediaHeight: "9.75rem",
  },
  md: {
    cardSize: "md",
    cardPadding: "0.8rem",
    cardGap: "0.62rem",
    listGap: "0.82rem",
    fieldGap: "0.4rem",
    labelFontSize: "0.76rem",
    valueFontSize: "0.9rem",
    valueLineHeight: 1.42,
    actionGap: "0.42rem",
    actionButtonSize: "md",
    progressSize: "md",
    iconSize: 14,
    mediaHeight: "11rem",
  },
  lg: {
    cardSize: "lg",
    cardPadding: "0.92rem",
    cardGap: "0.7rem",
    listGap: "0.95rem",
    fieldGap: "0.46rem",
    labelFontSize: "0.82rem",
    valueFontSize: "0.98rem",
    valueLineHeight: 1.46,
    actionGap: "0.48rem",
    actionButtonSize: "lg",
    progressSize: "lg",
    iconSize: 15,
    mediaHeight: "12.5rem",
  },
};

const variantTokens: Record<AdaptiveCardVariant, AdaptiveCardVariantTokens> = {
  default: {
    surfaceBackground: "var(--ktn-bg-surface, #ffffff)",
    surfaceBorder: "1px solid var(--ktn-border-muted, #e2e8f0)",
    surfaceShadow: "var(--ktn-shadow-sm, 0 1px 2px rgba(15, 23, 42, 0.08))",
    labelColor: "var(--ktn-text-secondary, #64748b)",
    valueColor: "var(--ktn-text-primary, #0f172a)",
    mutedColor: "var(--ktn-text-secondary, #64748b)",
  },
  compact: {
    surfaceBackground: "var(--ktn-bg-default, #f8fafc)",
    surfaceBorder: "1px solid var(--ktn-border-muted, #e2e8f0)",
    surfaceShadow: "none",
    labelColor: "var(--ktn-text-secondary, #64748b)",
    valueColor: "var(--ktn-text-primary, #0f172a)",
    mutedColor: "var(--ktn-text-secondary, #64748b)",
  },
  ghost: {
    surfaceBackground: "transparent",
    surfaceBorder: "1px dashed var(--ktn-border-muted, #cbd5e1)",
    surfaceShadow: "none",
    labelColor: "var(--ktn-text-secondary, #64748b)",
    valueColor: "var(--ktn-text-primary, #0f172a)",
    mutedColor: "var(--ktn-text-secondary, #64748b)",
  },
};

const defaultColumns: ResolvedAdaptiveCardColumns = {
  mobile: 1,
  tablet: 1,
  web: 1,
};

const defaultBreakpoints: ResolvedAdaptiveCardBreakpoints = {
  tablet: 768,
  web: 1024,
};

const defaultVirtualEstimate: Record<AdaptiveCardSize, number> = {
  xs: 210,
  sm: 248,
  md: 292,
  lg: 334,
};

function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
}

function normalizePositiveInteger(
  value: number | undefined,
  fallback: number,
): number {
  if (!(typeof value === "number" && Number.isFinite(value))) {
    return fallback;
  }

  const normalized = Math.floor(value);
  return normalized <= 0 ? fallback : normalized;
}

function normalizeViewportWidth(): number {
  if (typeof window === "undefined") {
    return Number.POSITIVE_INFINITY;
  }

  return window.innerWidth;
}

function normalizeColumns(value: number | undefined, fallback: number): number {
  if (!(typeof value === "number" && Number.isFinite(value))) {
    return fallback;
  }

  return clampNumber(Math.floor(value), 1, 12);
}

function resolveColumns(
  columns: number | AdaptiveCardColumns | undefined,
): ResolvedAdaptiveCardColumns {
  if (typeof columns === "number") {
    const normalized = normalizeColumns(columns, 1);

    return {
      mobile: normalized,
      tablet: normalized,
      web: normalized,
    };
  }

  return {
    mobile: normalizeColumns(columns?.mobile, defaultColumns.mobile),
    tablet: normalizeColumns(columns?.tablet, defaultColumns.tablet),
    web: normalizeColumns(columns?.web, defaultColumns.web),
  };
}

function resolveBreakpoints(
  breakpoints: AdaptiveCardColumnBreakpoints | undefined,
): ResolvedAdaptiveCardBreakpoints {
  const tablet = normalizePositiveInteger(
    breakpoints?.tablet,
    defaultBreakpoints.tablet,
  );
  const webCandidate = normalizePositiveInteger(
    breakpoints?.web,
    defaultBreakpoints.web,
  );

  return {
    tablet,
    web: webCandidate > tablet ? webCandidate : tablet + 1,
  };
}

function resolveViewportColumns(
  viewportWidth: number,
  columns: ResolvedAdaptiveCardColumns,
  breakpoints: ResolvedAdaptiveCardBreakpoints,
): number {
  if (viewportWidth < breakpoints.tablet) {
    return columns.mobile;
  }

  if (viewportWidth < breakpoints.web) {
    return columns.tablet;
  }

  return columns.web;
}

function humanizeKey(rawKey: string): string {
  const lastSegment = rawKey.split(".").pop() ?? rawKey;

  return lastSegment
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (firstChar) => firstChar.toUpperCase());
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value != null;
}

function getPathValue(row: object, keyPath: string): unknown {
  const normalizedPath = keyPath.trim();

  if (normalizedPath === "") {
    return undefined;
  }

  const pathSegments = normalizedPath.split(".");
  let currentValue: unknown = row;

  for (const segment of pathSegments) {
    if (!isObjectRecord(currentValue) || !(segment in currentValue)) {
      return undefined;
    }

    currentValue = currentValue[segment];
  }

  return currentValue;
}

function inferFieldType(
  key: string,
  sampleValue: unknown,
): AdaptiveCardFieldType {
  if (typeof sampleValue === "number") {
    if (/percent|ratio|change|delta/i.test(key)) {
      return "percent";
    }

    if (/price|cost|amount|value|total|balance/i.test(key)) {
      return "currency";
    }

    return "number";
  }

  if (typeof sampleValue === "string") {
    if (/^https?:\/\//i.test(sampleValue)) {
      if (/\.(png|jpe?g|gif|webp|svg)$/i.test(sampleValue)) {
        return "media";
      }

      return "link";
    }

    if (/^\+?[0-9\-()\s]{7,}$/.test(sampleValue)) {
      return "phone";
    }

    if (
      /^\d{4}-\d{2}-\d{2}/.test(sampleValue) ||
      /date|updated|created/i.test(key)
    ) {
      return "date";
    }

    if (/status|state|health/i.test(key)) {
      return "status";
    }

    return "text";
  }

  if (isObjectRecord(sampleValue)) {
    if ("value" in sampleValue && "max" in sampleValue) {
      return "progress";
    }

    if ("src" in sampleValue) {
      return "media";
    }

    if ("label" in sampleValue && "variant" in sampleValue) {
      return "badge";
    }

    if ("label" in sampleValue && "tone" in sampleValue) {
      return "status";
    }

    return "text";
  }

  return "text";
}

function inferSchemaFromData<TData extends object>(
  data: TData[],
): AdaptiveCardFieldSchema<TData>[] {
  const sample = data[0];

  if (sample == null || !isObjectRecord(sample)) {
    return [];
  }

  const entries = Object.entries(sample);

  return entries.map(([key, sampleValue], index) => ({
    key,
    label: humanizeKey(key),
    type: inferFieldType(key, sampleValue),
    align: typeof sampleValue === "number" ? "right" : "left",
    span: 1,
    priority: index,
    showLabel: true,
    hideIfEmpty: true,
  }));
}

function resolveSchema<TData extends object>(
  schema: AdaptiveCardFieldSchema<TData>[] | undefined,
  data: TData[],
  showFieldLabels: boolean,
): ResolvedAdaptiveCardFieldSchema<TData>[] {
  const fallbackSchema = inferSchemaFromData(data);
  const source = schema != null && schema.length > 0 ? schema : fallbackSchema;

  return source
    .map((field, index) => ({
      ...field,
      key: String(field.key),
      label: field.label ?? humanizeKey(String(field.key)),
      type: field.type ?? "auto",
      align: field.align ?? "left",
      span: field.span ?? 1,
      priority: field.priority ?? index,
      showLabel: field.showLabel ?? showFieldLabels,
      hideIfEmpty: field.hideIfEmpty ?? false,
    }))
    .sort((left, right) => {
      if (left.priority === right.priority) {
        return left.key.localeCompare(right.key);
      }

      return left.priority - right.priority;
    });
}

function isEmptyValue(value: unknown): boolean {
  if (value == null) {
    return true;
  }

  if (typeof value === "string") {
    return value.trim() === "";
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (isObjectRecord(value)) {
    return Object.keys(value).length === 0;
  }

  return false;
}

function toTextValue(value: unknown): ReactNode {
  if (value == null) {
    return "-";
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map((entry) => String(entry)).join(", ");
  }

  return JSON.stringify(value);
}

function resolveStatusToneFromValue(rawValue: unknown): AdaptiveCardStatusTone {
  const text = String(rawValue ?? "")
    .trim()
    .toLowerCase();

  if (/open|active|success|ok|healthy|done|complete|approved/.test(text)) {
    return "positive";
  }

  if (/pending|hold|paused|review|warning|attention/.test(text)) {
    return "warning";
  }

  if (/closed|failed|error|blocked|rejected|cancel/.test(text)) {
    return "negative";
  }

  return "neutral";
}

function toneToBadgeVariant(tone: AdaptiveCardStatusTone): BadgeVariant {
  if (tone === "positive") {
    return "primary";
  }

  if (tone === "warning") {
    return "outline";
  }

  if (tone === "negative") {
    return "destructive";
  }

  return "secondary";
}

function toActionLabelText(label: ReactNode, fallbackId: string): string {
  if (typeof label === "string") {
    const normalizedLabel = label.trim();

    if (normalizedLabel !== "") {
      return normalizedLabel;
    }
  }

  return humanizeKey(fallbackId);
}

function resolveActionMode(
  mode: AdaptiveCardActionMode,
  actionCount: number,
  inlineMaxVisible: number,
): AdaptiveCardActionMode {
  if (mode !== "auto") {
    return mode;
  }

  return actionCount > inlineMaxVisible ? "menu" : "inline";
}

function resolveActionDisabled<TData extends object>(
  action: AdaptiveCardAction<TData>,
  row: TData,
  rowIndex: number,
): boolean {
  if (typeof action.disabled === "function") {
    return action.disabled(row, rowIndex);
  }

  return action.disabled === true;
}

function resolveRowKey<TData extends object>(
  row: TData,
  rowIndex: number,
  rowKey?: keyof TData | ((row: TData, index: number) => string | number),
): string {
  if (typeof rowKey === "function") {
    return String(rowKey(row, rowIndex));
  }

  if (typeof rowKey === "string" && rowKey in row) {
    return String((row as Record<string, unknown>)[rowKey]);
  }

  return String(rowIndex);
}

function resolveInlineActionCount(
  actionInlineMaxVisible: number | undefined,
): number {
  if (
    !(
      typeof actionInlineMaxVisible === "number" &&
      Number.isFinite(actionInlineMaxVisible)
    )
  ) {
    return 4;
  }

  return clampNumber(Math.floor(actionInlineMaxVisible), 1, 8);
}

function toCardAriaLabel<TData extends object>(
  row: TData,
  rowIndex: number,
  schema: ResolvedAdaptiveCardFieldSchema<TData>[],
): string {
  const firstField = schema[0];

  if (firstField != null) {
    const firstValue = getPathValue(row, firstField.key);

    if (!isEmptyValue(firstValue)) {
      return `${toTextValue(firstValue)}`;
    }
  }

  return `Adaptive card ${rowIndex + 1}`;
}

function toCardSpacing(size: AdaptiveCardSize): "xs" | "sm" | "md" | "lg" {
  if (size === "xs") {
    return "sm";
  }

  return size;
}

export function AdaptiveCard<TData extends object = object>({
  data = [],
  schema,
  rowKey,
  variant = "default",
  size = "md",
  locale,
  currency,
  showFieldLabels = true,
  insideColumns = 2,
  columns,
  columnBreakpoints,
  actions = [],
  actionMode = "auto",
  actionInlineMaxVisible,
  actionAlignment = "right",
  actionPlacement = "bottom",
  actionLayout = "own-row",
  actionMenuLabel = "Actions",
  virtualized = false,
  virtualizedMaxHeight = "36rem",
  virtualizedEstimateSize,
  virtualizedOverscan = 6,
  viewportMaxHeight,
  emptyText = defaultEmptyText,
  onAction,
  className = "",
  style,
  ...props
}: AdaptiveCardProps<TData>): JSX.Element {
  const variantToken = variantTokens[variant];
  const sizeToken = sizeTokens[size];

  const resolvedColumns = useMemo(() => resolveColumns(columns), [columns]);
  const resolvedBreakpoints = useMemo(
    () => resolveBreakpoints(columnBreakpoints),
    [columnBreakpoints],
  );

  const [viewportWidth, setViewportWidth] = useState(() =>
    normalizeViewportWidth(),
  );

  const listParentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    function handleResize(): void {
      setViewportWidth(window.innerWidth);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const resolvedSchema = useMemo(
    () => resolveSchema(schema, data, showFieldLabels),
    [data, schema, showFieldLabels],
  );

  const resolvedInnerColumns = clampNumber(
    insideColumns,
    1,
    3,
  ) as AdaptiveCardInnerColumns;
  const resolvedOutsideColumns = resolveViewportColumns(
    viewportWidth,
    resolvedColumns,
    resolvedBreakpoints,
  );
  const visibleRows = data;

  const resolvedVirtualEstimate =
    typeof virtualizedEstimateSize === "number" &&
    Number.isFinite(virtualizedEstimateSize)
      ? Math.max(120, Math.floor(virtualizedEstimateSize))
      : defaultVirtualEstimate[size];

  const resolvedVirtualOverscan =
    typeof virtualizedOverscan === "number" &&
    Number.isFinite(virtualizedOverscan)
      ? Math.max(1, Math.floor(virtualizedOverscan))
      : 6;

  const canVirtualize = virtualized && resolvedOutsideColumns === 1;

  const rowVirtualizer = useVirtualizer({
    count: canVirtualize ? visibleRows.length : 0,
    getScrollElement: () => listParentRef.current,
    estimateSize: () => resolvedVirtualEstimate,
    overscan: resolvedVirtualOverscan,
  });

  const inlineActionLimit = resolveInlineActionCount(actionInlineMaxVisible);

  function emitAction(context: AdaptiveCardActionContext<TData>): void {
    onAction?.(context);
  }

  function resolveRowActions(
    row: TData,
    rowIndex: number,
  ): AdaptiveCardAction<TData>[] {
    if (typeof actions === "function") {
      const resolved = actions(row, rowIndex);
      return Array.isArray(resolved) ? resolved : [];
    }

    return Array.isArray(actions) ? actions : [];
  }

  function runAction(
    action: AdaptiveCardAction<TData>,
    row: TData,
    rowIndex: number,
    event?: unknown,
  ): void {
    emitAction({
      source: "item-action",
      actionId: action.id,
      row,
      rowIndex,
      event,
    });

    action.onAction?.(row, rowIndex);
  }

  function renderBadgeValue(rawValue: unknown): ReactNode {
    if (isObjectRecord(rawValue) && rawValue.label != null) {
      const variantCandidate = rawValue.variant;
      const resolvedVariant =
        variantCandidate === "primary" ||
        variantCandidate === "outline" ||
        variantCandidate === "ghost" ||
        variantCandidate === "secondary" ||
        variantCandidate === "destructive" ||
        variantCandidate === "link"
          ? variantCandidate
          : "secondary";

      return (
        <Badge variant={resolvedVariant}>{toTextValue(rawValue.label)}</Badge>
      );
    }

    return <Badge variant="secondary">{toTextValue(rawValue)}</Badge>;
  }

  function renderStatusValue(rawValue: unknown): ReactNode {
    const tone =
      isObjectRecord(rawValue) &&
      (rawValue.tone === "positive" ||
        rawValue.tone === "warning" ||
        rawValue.tone === "negative" ||
        rawValue.tone === "neutral")
        ? rawValue.tone
        : resolveStatusToneFromValue(
            isObjectRecord(rawValue) && rawValue.label != null
              ? rawValue.label
              : rawValue,
          );

    const label =
      isObjectRecord(rawValue) && rawValue.label != null
        ? toTextValue(rawValue.label)
        : toTextValue(rawValue);

    return <Badge variant={toneToBadgeVariant(tone)}>{label}</Badge>;
  }

  function renderProgressValue(rawValue: unknown): ReactNode {
    if (isObjectRecord(rawValue) && typeof rawValue.value === "number") {
      const min = typeof rawValue.min === "number" ? rawValue.min : 0;
      const max = typeof rawValue.max === "number" ? rawValue.max : 100;
      const value = clampNumber(rawValue.value, min, max);

      return (
        <Progress
          value={value}
          min={min}
          max={max}
          size={sizeToken.progressSize}
        >
          {rawValue.label != null ? (
            <span>{toTextValue(rawValue.label)}</span>
          ) : null}
        </Progress>
      );
    }

    const numericValue = Number(rawValue);

    if (!Number.isFinite(numericValue)) {
      return toTextValue(rawValue);
    }

    return (
      <Progress
        value={clampNumber(numericValue, 0, 100)}
        size={sizeToken.progressSize}
      />
    );
  }

  function renderMediaValue(
    rawValue: unknown,
    field: ResolvedAdaptiveCardFieldSchema<TData>,
  ): ReactNode {
    const mediaValue = isObjectRecord(rawValue) ? rawValue : { src: rawValue };

    if (typeof mediaValue.src !== "string" || mediaValue.src.trim() === "") {
      return toTextValue(rawValue);
    }

    const mediaType =
      field.mediaType ??
      (typeof mediaValue.type === "string" ? mediaValue.type : "auto");

    const altText =
      field.mediaAlt ??
      (typeof mediaValue.alt === "string" && mediaValue.alt.trim() !== ""
        ? mediaValue.alt
        : "Adaptive card media");

    const shouldRenderImage =
      mediaType === "image" ||
      (mediaType === "auto" &&
        /\.(png|jpe?g|gif|webp|svg)$/i.test(mediaValue.src));

    if (shouldRenderImage) {
      return (
        <img
          src={mediaValue.src}
          alt={altText}
          loading="lazy"
          style={{
            width: "100%",
            minWidth: 0,
            maxHeight: sizeToken.mediaHeight,
            objectFit: "cover",
            borderRadius: "0.5rem",
            border: "1px solid var(--ktn-border-muted, #e2e8f0)",
          }}
        />
      );
    }

    return (
      <a
        href={mediaValue.src}
        target="_blank"
        rel="noreferrer"
        style={{
          color: "var(--ktn-action-primary-bg, #2563eb)",
          textDecoration: "none",
          overflowWrap: "anywhere",
        }}
      >
        {mediaValue.src}
      </a>
    );
  }

  function renderFieldValue(
    field: ResolvedAdaptiveCardFieldSchema<TData>,
    rawValue: unknown,
    row: TData,
    rowIndex: number,
  ): ReactNode {
    if (field.formatter != null) {
      return field.formatter(rawValue, row, rowIndex);
    }

    if (field.type === "auto") {
      const inferred = inferFieldType(field.key, rawValue);
      return renderFieldValue(
        { ...field, type: inferred },
        rawValue,
        row,
        rowIndex,
      );
    }

    if (field.type === "status") {
      return renderStatusValue(rawValue);
    }

    if (field.type === "badge") {
      return renderBadgeValue(rawValue);
    }

    if (field.type === "progress") {
      return renderProgressValue(rawValue);
    }

    if (field.type === "media") {
      return renderMediaValue(rawValue, field);
    }

    if (field.type === "link") {
      const href =
        typeof rawValue === "string" ? rawValue : String(rawValue ?? "");

      if (href.trim() === "") {
        return "-";
      }

      return (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          style={{
            color: "var(--ktn-action-primary-bg, #2563eb)",
            textDecoration: "none",
            overflowWrap: "anywhere",
          }}
        >
          {href}
        </a>
      );
    }

    if (field.type === "phone") {
      const phoneValue =
        typeof rawValue === "string" ? rawValue : String(rawValue ?? "");
      const telHref = `tel:${phoneValue.replace(/[^+\d]/g, "")}`;

      return (
        <a
          href={telHref}
          style={{
            color: "var(--ktn-action-primary-bg, #2563eb)",
            textDecoration: "none",
          }}
        >
          {phoneValue}
        </a>
      );
    }

    if (field.type === "currency") {
      const numericValue = Number(rawValue);

      if (!Number.isFinite(numericValue)) {
        return toTextValue(rawValue);
      }

      return new Intl.NumberFormat(field.locale ?? locale, {
        style: "currency",
        currency: field.currency ?? currency ?? "USD",
        minimumFractionDigits: field.minimumFractionDigits,
        maximumFractionDigits: field.maximumFractionDigits,
      }).format(numericValue);
    }

    if (field.type === "percent") {
      const numericValue = Number(rawValue);

      if (!Number.isFinite(numericValue)) {
        return toTextValue(rawValue);
      }

      return new Intl.NumberFormat(field.locale ?? locale, {
        style: "percent",
        minimumFractionDigits: field.minimumFractionDigits ?? 0,
        maximumFractionDigits: field.maximumFractionDigits ?? 2,
      }).format(numericValue);
    }

    if (field.type === "number") {
      const numericValue = Number(rawValue);

      if (!Number.isFinite(numericValue)) {
        return toTextValue(rawValue);
      }

      return new Intl.NumberFormat(field.locale ?? locale, {
        minimumFractionDigits: field.minimumFractionDigits,
        maximumFractionDigits: field.maximumFractionDigits,
      }).format(numericValue);
    }

    if (field.type === "date") {
      if (rawValue == null) {
        return "-";
      }

      const candidate =
        rawValue instanceof Date ? rawValue : new Date(String(rawValue));

      if (Number.isNaN(candidate.getTime())) {
        return toTextValue(rawValue);
      }

      return new Intl.DateTimeFormat(
        field.locale ?? locale,
        field.dateOptions ?? {
          year: "numeric",
          month: "short",
          day: "numeric",
        },
      ).format(candidate);
    }

    return toTextValue(rawValue);
  }

  function renderCardActions(
    row: TData,
    rowIndex: number,
    layout: AdaptiveCardActionLayout,
  ): ReactNode {
    const rowActions = resolveRowActions(row, rowIndex);

    if (rowActions.length === 0) {
      return null;
    }

    const isSameRowLayout = layout === "same-row";

    const resolvedActionMode = resolveActionMode(
      actionMode,
      rowActions.length,
      inlineActionLimit,
    );

    const rowActionStyle: CSSProperties = {
      minWidth: 0,
      width: isSameRowLayout ? "auto" : "100%",
      display: "flex",
      flexWrap: isSameRowLayout ? "nowrap" : "wrap",
      flexShrink: isSameRowLayout ? 0 : undefined,
      gap: sizeToken.actionGap,
      justifyContent: actionAlignment === "left" ? "flex-start" : "flex-end",
      alignItems: "center",
      paddingTop:
        !isSameRowLayout && actionPlacement === "bottom"
          ? "0.12rem"
          : undefined,
      paddingBottom:
        !isSameRowLayout && actionPlacement === "top" ? "0.12rem" : undefined,
    };

    if (resolvedActionMode === "menu") {
      return (
        <div style={rowActionStyle}>
          <DropdownMenu size={sizeToken.actionButtonSize}>
            <DropdownMenuTrigger
              openLabel="Open actions"
              closeLabel="Close actions"
            >
              <Button
                size={sizeToken.actionButtonSize}
                variant="outline"
                compact
                iconOnly
                tooltip={actionMenuLabel}
                aria-label={
                  typeof actionMenuLabel === "string" &&
                  actionMenuLabel.trim() !== ""
                    ? actionMenuLabel
                    : "Actions"
                }
              >
                <FiMoreVertical size={14} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align={actionAlignment === "left" ? "start" : "end"}
            >
              {rowActions.map((action) => {
                const disabled = resolveActionDisabled(action, row, rowIndex);

                return (
                  <DropdownMenuItem
                    key={`${rowIndex}-${action.id}`}
                    disabled={disabled}
                    icon={action.icon}
                    onSelect={() => {
                      runAction(action, row, rowIndex);
                    }}
                  >
                    {action.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }

    const inlineActions = rowActions.slice(0, inlineActionLimit);

    return (
      <div style={rowActionStyle}>
        {inlineActions.map((action) => {
          const disabled = resolveActionDisabled(action, row, rowIndex);
          const iconOnly = action.icon != null;

          return (
            <Button
              key={`${rowIndex}-${action.id}`}
              size={sizeToken.actionButtonSize}
              variant={action.variant ?? "outline"}
              compact
              disabled={disabled}
              iconOnly={iconOnly}
              tooltip={iconOnly ? action.label : undefined}
              aria-label={toActionLabelText(action.label, action.id)}
              onAction={(event) => {
                runAction(action, row, rowIndex, event);
              }}
            >
              {action.icon ?? action.label}
            </Button>
          );
        })}
      </div>
    );
  }

  function renderCard(row: TData, rowIndex: number): JSX.Element {
    const rowId = resolveRowKey(row, rowIndex, rowKey);

    const cardStyle: CSSProperties = {
      width: "100%",
      minWidth: 0,
      padding: sizeToken.cardPadding,
      display: "flex",
      flexDirection: "column",
      gap: sizeToken.cardGap,
      background: variantToken.surfaceBackground,
      border: variantToken.surfaceBorder,
      boxShadow: variantToken.surfaceShadow,
      boxSizing: "border-box",
    };

    const fieldsGridStyle: CSSProperties = {
      width: "100%",
      minWidth: 0,
      display: "grid",
      gridTemplateColumns: `repeat(${resolvedInnerColumns}, minmax(0, 1fr))`,
      gap: sizeToken.cardGap,
      alignItems: "start",
      boxSizing: "border-box",
    };

    const sameRowLayoutStyle: CSSProperties = {
      width: "100%",
      minWidth: 0,
      display: "flex",
      alignItems: "center",
      gap: sizeToken.cardGap,
      boxSizing: "border-box",
    };

    const sameRowFieldContainerStyle: CSSProperties = {
      flex: 1,
      minWidth: 0,
    };

    const cardAriaLabel = toCardAriaLabel(row, rowIndex, resolvedSchema);
    const cardActions = renderCardActions(row, rowIndex, actionLayout);
    const usesSameRowLayout =
      actionLayout === "same-row" && cardActions != null;

    const resolvedFieldEntries: Array<{
      field: ResolvedAdaptiveCardFieldSchema<TData>;
      rawValue: unknown;
      resolvedSpan: number;
    }> = [];

    for (const field of resolvedSchema) {
      const rawValue = getPathValue(row, field.key);

      if (field.hideIfEmpty && isEmptyValue(rawValue)) {
        continue;
      }

      const resolvedSpan =
        field.span === "full"
          ? resolvedInnerColumns
          : clampNumber(field.span, 1, resolvedInnerColumns);

      resolvedFieldEntries.push({
        field,
        rawValue,
        resolvedSpan,
      });
    }

    const fieldRows: (typeof resolvedFieldEntries)[] = [];
    let activeRow: typeof resolvedFieldEntries = [];
    let activeRowSpan = 0;

    for (const entry of resolvedFieldEntries) {
      const canFitCurrentRow =
        activeRowSpan + entry.resolvedSpan <= resolvedInnerColumns;

      if (!canFitCurrentRow && activeRow.length > 0) {
        fieldRows.push(activeRow);
        activeRow = [];
        activeRowSpan = 0;
      }

      activeRow.push(entry);
      activeRowSpan += entry.resolvedSpan;

      if (activeRowSpan >= resolvedInnerColumns) {
        fieldRows.push(activeRow);
        activeRow = [];
        activeRowSpan = 0;
      }
    }

    if (activeRow.length > 0) {
      fieldRows.push(activeRow);
    }

    function renderFieldRow(
      rowEntries: typeof resolvedFieldEntries,
      rowSlotIndex: number,
      keyPrefix: string,
    ): JSX.Element {
      return (
        <div
          key={`${rowId}-${keyPrefix}-${rowSlotIndex}`}
          style={fieldsGridStyle}
        >
          {rowEntries.map((entry, entryIndex) => {
            const fieldStyle: CSSProperties = {
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: sizeToken.fieldGap,
              gridColumn:
                entry.resolvedSpan >= resolvedInnerColumns
                  ? "1 / -1"
                  : `span ${entry.resolvedSpan}`,
              textAlign: entry.field.align,
            };

            const labelStyle: CSSProperties = {
              margin: 0,
              fontSize: sizeToken.labelFontSize,
              lineHeight: 1.3,
              fontWeight: 600,
              color: variantToken.labelColor,
              letterSpacing: "0.01em",
            };

            const valueStyle: CSSProperties = {
              margin: 0,
              minWidth: 0,
              fontSize: sizeToken.valueFontSize,
              lineHeight: sizeToken.valueLineHeight,
              color: variantToken.valueColor,
              overflowWrap: "anywhere",
            };

            return (
              <div
                key={`${rowId}-${keyPrefix}-${rowSlotIndex}-${entry.field.key}-${entryIndex}`}
                style={fieldStyle}
              >
                {entry.field.showLabel ? (
                  <p style={labelStyle}>{entry.field.label}</p>
                ) : null}

                <div style={valueStyle}>
                  {renderFieldValue(entry.field, entry.rawValue, row, rowIndex)}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <Card
        key={rowId}
        size={sizeToken.cardSize}
        spacing={toCardSpacing(sizeToken.cardSize)}
        style={cardStyle}
        role="article"
        aria-label={cardAriaLabel}
      >
        {usesSameRowLayout ? (
          fieldRows.length === 0 ? (
            cardActions
          ) : (
            fieldRows.map((rowEntries, rowSlotIndex) => {
              const targetRowIndex =
                actionPlacement === "top" ? 0 : fieldRows.length - 1;
              const isActionRow = rowSlotIndex === targetRowIndex;

              if (!isActionRow) {
                return renderFieldRow(rowEntries, rowSlotIndex, "same-row");
              }

              return (
                <div
                  key={`${rowId}-same-row-action-${rowSlotIndex}`}
                  style={sameRowLayoutStyle}
                >
                  {actionAlignment === "left" ? cardActions : null}

                  <div style={sameRowFieldContainerStyle}>
                    {renderFieldRow(
                      rowEntries,
                      rowSlotIndex,
                      "same-row-action",
                    )}
                  </div>

                  {actionAlignment === "right" ? cardActions : null}
                </div>
              );
            })
          )
        ) : (
          <>
            {actionPlacement === "top" ? cardActions : null}

            {fieldRows.map((rowEntries, rowSlotIndex) =>
              renderFieldRow(rowEntries, rowSlotIndex, "own-row"),
            )}

            {actionPlacement === "bottom" ? cardActions : null}
          </>
        )}
      </Card>
    );
  }

  const cardsGridStyle: CSSProperties = {
    width: "100%",
    minWidth: 0,
    display: "grid",
    gridTemplateColumns: `repeat(${resolvedOutsideColumns}, minmax(0, 1fr))`,
    gap: sizeToken.listGap,
    boxSizing: "border-box",
  };

  const virtualViewportStyle: CSSProperties = {
    width: "100%",
    minWidth: 0,
    maxHeight:
      typeof virtualizedMaxHeight === "number"
        ? `${virtualizedMaxHeight}px`
        : virtualizedMaxHeight,
    overflowY: "auto",
    overflowX: "hidden",
    boxSizing: "border-box",
  };

  const contentViewportStyle: CSSProperties = {
    width: "100%",
    minWidth: 0,
    maxHeight:
      viewportMaxHeight == null
        ? undefined
        : typeof viewportMaxHeight === "number"
          ? `${viewportMaxHeight}px`
          : viewportMaxHeight,
    boxSizing: "border-box",
  };

  const rootStyle: CSSProperties = {
    width: "100%",
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: sizeToken.listGap,
    color: variantToken.valueColor,
    boxSizing: "border-box",
    ...style,
  };

  return (
    <div
      className={`${baseClasses} ${className}`.trim()}
      style={rootStyle}
      role="region"
      aria-label="Adaptive card grid"
      {...props}
    >
      {visibleRows.length === 0 ? (
        <div
          style={{
            width: "100%",
            minWidth: 0,
            padding: "0.95rem",
            borderRadius: "0.75rem",
            border: "1px dashed var(--ktn-border-muted, #cbd5e1)",
            color: variantToken.mutedColor,
            fontSize: sizeToken.valueFontSize,
            boxSizing: "border-box",
          }}
          role="status"
          aria-live="polite"
        >
          {emptyText}
        </div>
      ) : canVirtualize ? (
        <div ref={listParentRef} style={virtualViewportStyle}>
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
              boxSizing: "border-box",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = visibleRows[virtualRow.index];
              const cardRowIndex = virtualRow.index;

              return (
                <div
                  key={virtualRow.key}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualRow.start}px)`,
                    paddingBottom: sizeToken.listGap,
                    boxSizing: "border-box",
                  }}
                >
                  {renderCard(row, cardRowIndex)}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <Scrollbar
          axis="y"
          style={contentViewportStyle}
          aria-label="Adaptive cards list"
        >
          <div style={cardsGridStyle}>
            {visibleRows.map((row, index) => renderCard(row, index))}
          </div>
        </Scrollbar>
      )}
    </div>
  );
}
