import {
  useMemo,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { Badge, type BadgeVariant } from "./Badge";
import { Button, type ButtonProps } from "./Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./DropdownMenu";
import { FiList, FiMoreVertical } from "./icons/feather";
import { Progress, type ProgressSize } from "./Progress";
import { Scrollbar } from "./Scrollbar";

export type CardDataVariant = "default" | "compact" | "ghost";
export type CardDataSize = "xs" | "sm" | "md" | "lg";
export type CardDataActionAlignment = "left" | "right";
export type CardDataActionMode = "auto" | "inline" | "menu";
export type CardDataFieldType =
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

type CardDataStatusTone = "neutral" | "positive" | "warning" | "negative";

export interface CardDataStatusValue {
  label: ReactNode;
  tone?: CardDataStatusTone;
}

export interface CardDataBadgeValue {
  label: ReactNode;
  variant?: BadgeVariant;
}

export interface CardDataProgressValue {
  value: number;
  min?: number;
  max?: number;
  label?: ReactNode;
}

export interface CardDataMediaValue {
  src: string;
  alt?: string;
  type?: "auto" | "image" | "video" | "audio" | "file";
}

export interface CardDataFieldSchema<TData extends object = object> {
  key: Extract<keyof TData, string> | string;
  label?: ReactNode;
  showLabel?: boolean;
  type?: CardDataFieldType;
  align?: "left" | "right";
  span?: 1 | 2 | "auto";
  priority?: number;
  hideIfEmpty?: boolean;
  formatter?: (value: unknown, row: TData, rowIndex: number) => ReactNode;
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  dateOptions?: Intl.DateTimeFormatOptions;
  mediaAlt?: string;
  mediaType?: "auto" | "image" | "video" | "audio" | "file";
}

export interface CardDataAction<TData extends object = object> {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  variant?: ButtonProps["variant"];
  disabled?: boolean | ((row: TData, rowIndex: number) => boolean);
  onAction?: (row: TData, rowIndex: number) => void;
}

export type CardDataActionSource = "item-action" | "view-switch";

export interface CardDataActionContext<TData extends object = object> {
  source: CardDataActionSource;
  actionId?: string;
  row?: TData;
  rowIndex?: number;
  event?: unknown;
}

export interface CardDataProps<TData extends object = object> extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  data?: TData[];
  schema?: CardDataFieldSchema<TData>[];
  rowKey?: keyof TData | ((row: TData, index: number) => string | number);
  variant?: CardDataVariant;
  size?: CardDataSize;
  locale?: string;
  currency?: string;
  showFieldLabels?: boolean;
  actions?:
    | CardDataAction<TData>[]
    | ((row: TData, rowIndex: number) => CardDataAction<TData>[]);
  actionInlineMaxVisible?: number;
  actionMode?: CardDataActionMode;
  actionAlignment?: CardDataActionAlignment;
  actionMenuLabel?: ReactNode;
  showViewSwitch?: boolean;
  switchToTableViewLabel?: string;
  onSwitchToTableView?: () => void;
  viewportMaxHeight?: number | string;
  safeAreaAware?: boolean;
  emptyText?: ReactNode;
  onAction?: (context: CardDataActionContext<TData>) => void;
}

interface CardDataSizeTokens {
  cardPadding: string;
  cardGap: string;
  listGap: string;
  fieldGap: string;
  labelSize: string;
  valueSize: string;
  valueLineHeight: number;
  actionGap: string;
  buttonSize: "xs" | "sm" | "md" | "lg";
  progressSize: ProgressSize;
  mediaHeight: string;
}

interface CardDataVariantTokens {
  cardBackgroundColor: string;
  cardBorder: string;
  cardShadow: string;
  labelColor: string;
  valueColor: string;
  mutedColor: string;
}

interface ResolvedFieldSchema<
  TData extends object,
> extends CardDataFieldSchema<TData> {
  key: string;
  label: ReactNode;
  showLabel: boolean;
  type: CardDataFieldType;
  align: "left" | "right";
  span: 1 | 2 | "auto";
  priority: number;
  hideIfEmpty: boolean;
}

const baseClasses = "flex w-full min-w-0 flex-col";

const sizeTokens: Record<CardDataSize, CardDataSizeTokens> = {
  xs: {
    cardPadding: "0.5rem",
    cardGap: "0.4rem",
    listGap: "0.5rem",
    fieldGap: "0.3rem",
    labelSize: "0.68rem",
    valueSize: "0.78rem",
    valueLineHeight: 1.34,
    actionGap: "0.35rem",
    buttonSize: "xs",
    progressSize: "xs",
    mediaHeight: "9rem",
  },
  sm: {
    cardPadding: "0.64rem",
    cardGap: "0.5rem",
    listGap: "0.62rem",
    fieldGap: "0.34rem",
    labelSize: "0.72rem",
    valueSize: "0.83rem",
    valueLineHeight: 1.38,
    actionGap: "0.4rem",
    buttonSize: "sm",
    progressSize: "sm",
    mediaHeight: "10rem",
  },
  md: {
    cardPadding: "0.78rem",
    cardGap: "0.58rem",
    listGap: "0.75rem",
    fieldGap: "0.4rem",
    labelSize: "0.76rem",
    valueSize: "0.89rem",
    valueLineHeight: 1.42,
    actionGap: "0.46rem",
    buttonSize: "md",
    progressSize: "md",
    mediaHeight: "11.5rem",
  },
  lg: {
    cardPadding: "0.92rem",
    cardGap: "0.66rem",
    listGap: "0.85rem",
    fieldGap: "0.46rem",
    labelSize: "0.8rem",
    valueSize: "0.96rem",
    valueLineHeight: 1.45,
    actionGap: "0.5rem",
    buttonSize: "lg",
    progressSize: "lg",
    mediaHeight: "13rem",
  },
};

const variantTokens: Record<CardDataVariant, CardDataVariantTokens> = {
  default: {
    cardBackgroundColor: "var(--ktn-bg-surface, #ffffff)",
    cardBorder: "1px solid var(--ktn-border-muted)",
    cardShadow: "0 2px 12px color-mix(in srgb, #0f172a 8%, transparent)",
    labelColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    valueColor: "var(--ktn-text-primary)",
    mutedColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
  },
  compact: {
    cardBackgroundColor:
      "color-mix(in srgb, var(--ktn-bg-surface, #ffffff) 90%, var(--ktn-bg-muted, #f8fafc))",
    cardBorder:
      "1px solid color-mix(in srgb, var(--ktn-border-muted) 88%, transparent)",
    cardShadow: "0 1px 8px color-mix(in srgb, #0f172a 6%, transparent)",
    labelColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    valueColor: "var(--ktn-text-primary)",
    mutedColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
  },
  ghost: {
    cardBackgroundColor: "transparent",
    cardBorder:
      "1px solid color-mix(in srgb, var(--ktn-border-muted) 58%, transparent)",
    cardShadow: "none",
    labelColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    valueColor: "var(--ktn-text-primary)",
    mutedColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
  },
};

const defaultEmptyText = "No card data available.";

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value != null;
}

function isStringValue(value: unknown): value is string {
  return typeof value === "string";
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const normalized = value.trim();

    if (normalized === "") {
      return null;
    }

    const parsed = Number.parseFloat(normalized.replaceAll(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function toTextValue(value: unknown): string {
  if (value == null) {
    return "";
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function getValueByPath(row: object, keyPath: string): unknown {
  const path = keyPath.trim();

  if (path === "") {
    return undefined;
  }

  const segments = path.split(".");
  let current: unknown = row;

  for (const segment of segments) {
    if (!isObjectRecord(current) || !(segment in current)) {
      return undefined;
    }

    current = current[segment];
  }

  return current;
}

function humanizeKey(key: string): string {
  const normalized = key
    .replaceAll(/[_-]+/g, " ")
    .replaceAll(/\./g, " ")
    .replaceAll(/\s+/g, " ")
    .trim();

  if (normalized === "") {
    return "Field";
  }

  return normalized.replaceAll(/\b\w/g, (character) => character.toUpperCase());
}

function looksLikePhone(value: string): boolean {
  const digits = value.replaceAll(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

function looksLikeDate(value: unknown): boolean {
  if (value instanceof Date) {
    return !Number.isNaN(value.getTime());
  }

  if (typeof value !== "string" && typeof value !== "number") {
    return false;
  }

  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

function looksLikeMedia(key: string, value: unknown): boolean {
  const normalizedKey = key.toLowerCase();
  const keyHint = /(image|photo|avatar|media|thumbnail|cover|video|audio)/.test(
    normalizedKey,
  );

  if (
    isObjectRecord(value) &&
    typeof value.src === "string" &&
    value.src.trim() !== ""
  ) {
    return true;
  }

  if (!isStringValue(value)) {
    return keyHint;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue === "") {
    return false;
  }

  if (
    normalizedValue.startsWith("http://") ||
    normalizedValue.startsWith("https://")
  ) {
    return /(\.png|\.jpg|\.jpeg|\.webp|\.gif|\.svg|\.mp4|\.webm|\.mp3|\.wav|\.ogg)(\?|#|$)/.test(
      normalizedValue,
    );
  }

  return keyHint;
}

function looksLikeLink(value: string): boolean {
  const normalized = value.trim().toLowerCase();

  if (normalized === "") {
    return false;
  }

  return (
    normalized.startsWith("http://") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("mailto:") ||
    normalized.startsWith("tel:") ||
    normalized.startsWith("www.")
  );
}

function toLinkHref(value: string): string | null {
  const normalized = value.trim();

  if (normalized === "") {
    return null;
  }

  if (
    normalized.startsWith("http://") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("mailto:") ||
    normalized.startsWith("tel:")
  ) {
    return normalized;
  }

  if (normalized.startsWith("www.")) {
    return `https://${normalized}`;
  }

  return null;
}

function defaultFieldAlign(
  type: CardDataFieldType,
  key: string,
): "left" | "right" {
  if (type === "number" || type === "currency" || type === "percent") {
    return "right";
  }

  const normalizedKey = key.toLowerCase();

  if (
    /(amount|price|total|cost|balance|revenue|income|expense|volume|qty|quantity|count|change|ratio|percent|value)/.test(
      normalizedKey,
    )
  ) {
    return "right";
  }

  return "left";
}

function inferFieldType(key: string, sampleValue: unknown): CardDataFieldType {
  const normalizedKey = key.toLowerCase();

  if (looksLikeMedia(key, sampleValue)) {
    return "media";
  }

  if (isStringValue(sampleValue) && looksLikeLink(sampleValue)) {
    return "link";
  }

  if (/(status|state|stage)/.test(normalizedKey)) {
    return "status";
  }

  if (/(progress|completion|ratio)/.test(normalizedKey)) {
    return "progress";
  }

  if (
    /(amount|price|total|cost|balance|revenue|income|expense)/.test(
      normalizedKey,
    )
  ) {
    return "currency";
  }

  if (/(percent|percentage|pct|change|growth)/.test(normalizedKey)) {
    return "percent";
  }

  if (/(date|time|at|on)/.test(normalizedKey) && looksLikeDate(sampleValue)) {
    return "date";
  }

  if (isStringValue(sampleValue) && looksLikePhone(sampleValue)) {
    return "phone";
  }

  if (toFiniteNumber(sampleValue) != null) {
    return "number";
  }

  return "text";
}

function findFirstNonEmptyValue<TData extends object>(
  rows: TData[],
  keyPath: string,
): unknown {
  const probeLength = Math.min(rows.length, 16);

  for (let index = 0; index < probeLength; index += 1) {
    const row = rows[index];

    if (row == null) {
      continue;
    }

    const value = getValueByPath(row, keyPath);

    if (value != null && toTextValue(value).trim() !== "") {
      return value;
    }
  }

  return undefined;
}

function inferSchema<TData extends object>(
  rows: TData[],
): CardDataFieldSchema<TData>[] {
  const firstRow = rows[0];

  if (firstRow == null) {
    return [];
  }

  const keys = Object.keys(firstRow);

  return keys.map((key, index) => {
    const sampleValue = findFirstNonEmptyValue(rows, key);
    const inferredType = inferFieldType(key, sampleValue);

    return {
      key,
      label: humanizeKey(key),
      type: inferredType,
      priority: index,
      hideIfEmpty: true,
      span: "auto",
      align: defaultFieldAlign(inferredType, key),
    };
  });
}

function isValueEmpty(value: unknown): boolean {
  if (value == null) {
    return true;
  }

  if (typeof value === "string") {
    return value.trim() === "";
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === "number") {
    return Number.isNaN(value);
  }

  if (isObjectRecord(value)) {
    if (typeof value.src === "string" && value.src.trim() !== "") {
      return false;
    }

    if (value.value != null && toFiniteNumber(value.value) != null) {
      return false;
    }

    if (value.label != null && !isValueEmpty(value.label)) {
      return false;
    }

    return Object.keys(value).length === 0;
  }

  return false;
}

function resolveStatusTone(rawValue: unknown): CardDataStatusTone {
  const text = toTextValue(rawValue).trim().toLowerCase();

  if (text === "") {
    return "neutral";
  }

  if (
    /(success|active|completed|open|online|approved|paid|resolved)/.test(text)
  ) {
    return "positive";
  }

  if (/(warning|pending|paused|hold|queued|draft)/.test(text)) {
    return "warning";
  }

  if (
    /(error|failed|inactive|closed|cancelled|blocked|rejected|offline)/.test(
      text,
    )
  ) {
    return "negative";
  }

  return "neutral";
}

function toneToBadgeVariant(tone: CardDataStatusTone): BadgeVariant {
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

function formatPhoneLike(value: string): string {
  const digits = value.replaceAll(/\D/g, "");

  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  if (digits.length > 6) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`.trim();
  }

  return value;
}

function resolveActionMode(
  mode: CardDataActionMode,
  actionCount: number,
  actionInlineMaxVisible: number,
): CardDataActionMode {
  if (mode !== "auto") {
    return mode;
  }

  return actionCount > actionInlineMaxVisible ? "menu" : "inline";
}

function resolveActionAlignment(
  alignment: CardDataActionAlignment,
): CSSProperties["justifyContent"] {
  if (alignment === "left") {
    return "flex-start";
  }

  return "flex-end";
}

function resolveFieldSpan(
  type: CardDataFieldType,
  key: string,
  value: unknown,
  span: 1 | 2 | "auto",
): CSSProperties["gridColumn"] {
  if (span === 2) {
    return "1 / -1";
  }

  if (span === 1) {
    return "auto";
  }

  if (type === "media" || type === "progress") {
    return "1 / -1";
  }

  const normalizedKey = key.toLowerCase();

  if (
    /(description|summary|message|details|note|comment|reason|body|content)/.test(
      normalizedKey,
    )
  ) {
    return "1 / -1";
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();

    if (trimmedValue.includes("\n")) {
      return "1 / -1";
    }

    if (trimmedValue.length > 84) {
      return "1 / -1";
    }

    if (type === "link" && trimmedValue.length > 72) {
      return "1 / -1";
    }
  }

  if (Array.isArray(value) && value.length > 3) {
    return "1 / -1";
  }

  if (isObjectRecord(value) && type === "text") {
    return "1 / -1";
  }

  return "auto";
}

function toActionLabelText(label: ReactNode, actionId: string): string {
  if (typeof label === "string") {
    return label;
  }

  if (typeof label === "number") {
    return String(label);
  }

  return actionId;
}

function toMaxHeight(value: number | string): string {
  return typeof value === "number" ? `${value}px` : value;
}

function resolveRowId<TData extends object>(
  row: TData,
  index: number,
  rowKey?: keyof TData | ((row: TData, index: number) => string | number),
): string {
  if (typeof rowKey === "function") {
    return String(rowKey(row, index));
  }

  if (rowKey != null) {
    const rowValue = row[rowKey];

    if (typeof rowValue === "string" || typeof rowValue === "number") {
      return String(rowValue);
    }
  }

  return String(index);
}

function resolveActionDisabled<TData extends object>(
  action: CardDataAction<TData>,
  row: TData,
  rowIndex: number,
): boolean {
  if (typeof action.disabled === "function") {
    return action.disabled(row, rowIndex);
  }

  return action.disabled === true;
}

export function CardData<TData extends object = object>({
  data = [],
  schema,
  rowKey,
  variant = "default",
  size = "md",
  locale,
  currency,
  showFieldLabels = true,
  actions = [],
  actionInlineMaxVisible = 5,
  actionMode = "auto",
  actionAlignment = "right",
  actionMenuLabel = "Actions",
  showViewSwitch = false,
  switchToTableViewLabel = "Table",
  onSwitchToTableView,
  viewportMaxHeight,
  safeAreaAware = true,
  emptyText = defaultEmptyText,
  onAction,
  className = "",
  style,
  ...props
}: CardDataProps<TData>): JSX.Element {
  const tokens = sizeTokens[size];
  const tone = variantTokens[variant];
  const resolvedInlineActionLimit = Number.isFinite(actionInlineMaxVisible)
    ? Math.max(1, Math.floor(actionInlineMaxVisible))
    : 5;
  const actionMenuA11yLabel =
    typeof actionMenuLabel === "string" && actionMenuLabel.trim() !== ""
      ? actionMenuLabel
      : "Actions";

  const resolvedSchema = useMemo<ResolvedFieldSchema<TData>[]>(() => {
    const sourceSchema =
      schema != null && schema.length > 0 ? schema : inferSchema(data);

    return sourceSchema
      .map((field, index) => {
        const key = String(field.key).trim();
        const sampleValue = findFirstNonEmptyValue(data, key);
        const inferredType = inferFieldType(key, sampleValue);

        return {
          ...field,
          key,
          label: field.label ?? humanizeKey(key),
          showLabel: field.showLabel ?? showFieldLabels,
          type:
            field.type == null || field.type === "auto"
              ? inferredType
              : field.type,
          align:
            field.align ??
            defaultFieldAlign(
              field.type == null || field.type === "auto"
                ? inferredType
                : field.type,
              key,
            ),
          span: field.span ?? "auto",
          priority: field.priority ?? index,
          hideIfEmpty: field.hideIfEmpty ?? true,
        };
      })
      .filter((field) => field.key !== "")
      .sort((left, right) => left.priority - right.priority);
  }, [data, schema, showFieldLabels]);

  const rootStyle: CSSProperties = {
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: tokens.listGap,
    ...(safeAreaAware
      ? {
          paddingLeft: "max(0.55rem, env(safe-area-inset-left))",
          paddingRight: "max(0.55rem, env(safe-area-inset-right))",
          paddingBottom: "max(0.55rem, env(safe-area-inset-bottom))",
        }
      : {}),
    ...style,
  };

  const topBarStyle: CSSProperties = {
    width: "100%",
    minWidth: 0,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  };

  const listStyle: CSSProperties = {
    width: "100%",
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: tokens.listGap,
  };

  const viewportStyle: CSSProperties = {
    width: "100%",
    minWidth: 0,
    maxHeight:
      viewportMaxHeight != null ? toMaxHeight(viewportMaxHeight) : undefined,
    paddingInlineEnd: viewportMaxHeight != null ? "0.08rem" : undefined,
  };

  const cardStyle: CSSProperties = {
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    borderRadius: "var(--ktn-radius-md, 0.5rem)",
    border: tone.cardBorder,
    backgroundColor: tone.cardBackgroundColor,
    boxShadow: tone.cardShadow,
    padding: tokens.cardPadding,
    display: "flex",
    flexDirection: "column",
    gap: tokens.cardGap,
  };

  const contentGridStyle: CSSProperties = {
    width: "100%",
    minWidth: 0,
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: tokens.fieldGap,
    alignItems: "start",
  };

  const labelStyle: CSSProperties = {
    margin: 0,
    fontSize: tokens.labelSize,
    lineHeight: 1.2,
    fontWeight: 600,
    color: tone.labelColor,
  };

  const valueStyle: CSSProperties = {
    margin: 0,
    fontSize: tokens.valueSize,
    lineHeight: tokens.valueLineHeight,
    color: tone.valueColor,
    minWidth: 0,
    wordBreak: "break-word",
  };

  const actionRowStyle: CSSProperties = {
    width: "100%",
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: resolveActionAlignment(actionAlignment),
    gap: tokens.actionGap,
    flexWrap: "wrap",
    paddingTop: "0.15rem",
  };

  const statusStyleBase: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    minWidth: 0,
    fontSize: "0.95em",
    fontWeight: 600,
    lineHeight: 1.2,
  };

  function emitAction(context: CardDataActionContext<TData>): void {
    onAction?.(context);
  }

  function runAction(
    action: CardDataAction<TData>,
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

  function resolveActionsForRow(
    row: TData,
    rowIndex: number,
  ): CardDataAction<TData>[] {
    if (typeof actions === "function") {
      const resolvedActions = actions(row, rowIndex);
      return Array.isArray(resolvedActions) ? resolvedActions : [];
    }

    return Array.isArray(actions) ? actions : [];
  }

  function renderStatusValue(rawValue: unknown): ReactNode {
    if (isObjectRecord(rawValue) && rawValue.label != null) {
      const toneValue =
        rawValue.tone === "positive" ||
        rawValue.tone === "warning" ||
        rawValue.tone === "negative" ||
        rawValue.tone === "neutral"
          ? rawValue.tone
          : resolveStatusTone(rawValue.label);

      return (
        <Badge variant={toneToBadgeVariant(toneValue)} size={size}>
          {rawValue.label as ReactNode}
        </Badge>
      );
    }

    const text = toTextValue(rawValue).trim();

    if (text === "") {
      return "";
    }

    const toneValue = resolveStatusTone(text);

    return (
      <span
        style={{
          ...statusStyleBase,
          color:
            toneValue === "positive"
              ? "var(--ktn-action-success-bg, #16a34a)"
              : toneValue === "warning"
                ? "var(--ktn-warning-600, #d97706)"
                : toneValue === "negative"
                  ? "var(--ktn-action-danger-bg, #dc2626)"
                  : tone.mutedColor,
        }}
      >
        <span
          aria-hidden
          style={{
            width: "0.5rem",
            height: "0.5rem",
            borderRadius: "999px",
            backgroundColor: "currentColor",
            flexShrink: 0,
          }}
        />
        {text}
      </span>
    );
  }

  function renderBadgeValue(rawValue: unknown): ReactNode {
    if (isObjectRecord(rawValue) && rawValue.label != null) {
      const variantValue =
        rawValue.variant === "primary" ||
        rawValue.variant === "secondary" ||
        rawValue.variant === "destructive" ||
        rawValue.variant === "outline" ||
        rawValue.variant === "ghost" ||
        rawValue.variant === "link"
          ? rawValue.variant
          : "secondary";

      return (
        <Badge variant={variantValue} size={size}>
          {rawValue.label as ReactNode}
        </Badge>
      );
    }

    const text = toTextValue(rawValue).trim();

    if (text === "") {
      return "";
    }

    return (
      <Badge variant="secondary" size={size}>
        {text}
      </Badge>
    );
  }

  function renderProgressValue(rawValue: unknown): ReactNode {
    if (rawValue == null) {
      return "";
    }

    const progressRecord = isObjectRecord(rawValue) ? rawValue : undefined;
    const baseValue =
      progressRecord?.value ?? progressRecord?.current ?? rawValue;
    const baseMin = progressRecord?.min;
    const baseMax = progressRecord?.max ?? progressRecord?.total;

    const valueNumber = toFiniteNumber(baseValue);

    if (valueNumber == null) {
      return "";
    }

    const minNumber = toFiniteNumber(baseMin) ?? 0;
    const maxNumber = toFiniteNumber(baseMax) ?? 100;
    const normalizedMax = maxNumber >= minNumber ? maxNumber : minNumber;

    return (
      <Progress
        value={valueNumber}
        min={minNumber}
        max={normalizedMax}
        size={tokens.progressSize}
      />
    );
  }

  function renderMediaValue(
    rawValue: unknown,
    field: ResolvedFieldSchema<TData>,
  ): ReactNode {
    const mediaRecord = isObjectRecord(rawValue) ? rawValue : undefined;
    const src =
      typeof mediaRecord?.src === "string"
        ? mediaRecord.src
        : isStringValue(rawValue)
          ? rawValue
          : "";

    if (src.trim() === "") {
      return "";
    }

    const mediaType =
      field.mediaType ??
      (typeof mediaRecord?.type === "string"
        ? (mediaRecord.type as "auto" | "image" | "video" | "audio" | "file")
        : "auto");

    const resolvedType =
      mediaType === "auto"
        ? /\.(mp4|webm|mov)(\?|#|$)/i.test(src)
          ? "video"
          : /\.(mp3|wav|ogg|m4a)(\?|#|$)/i.test(src)
            ? "audio"
            : /\.(png|jpg|jpeg|gif|webp|svg|avif)(\?|#|$)/i.test(src)
              ? "image"
              : "file"
        : mediaType;

    const altText =
      field.mediaAlt ??
      (typeof mediaRecord?.alt === "string"
        ? mediaRecord.alt
        : "Media preview");

    const mediaFrameStyle: CSSProperties = {
      width: "100%",
      minWidth: 0,
      maxWidth: "100%",
      height: tokens.mediaHeight,
      borderRadius: "var(--ktn-radius-sm, 0.375rem)",
      border: "1px solid var(--ktn-border-muted)",
      backgroundColor:
        "color-mix(in srgb, var(--ktn-bg-muted, #f8fafc) 80%, transparent)",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };

    if (resolvedType === "image") {
      return (
        <div style={mediaFrameStyle}>
          <img
            src={src}
            alt={altText}
            loading="lazy"
            decoding="async"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      );
    }

    if (resolvedType === "video") {
      return (
        <div style={mediaFrameStyle}>
          <video
            controls
            preload="none"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          >
            <source src={src} />
          </video>
        </div>
      );
    }

    if (resolvedType === "audio") {
      return (
        <div style={mediaFrameStyle}>
          <audio controls preload="none" style={{ width: "100%" }}>
            <source src={src} />
          </audio>
        </div>
      );
    }

    return (
      <a
        href={src}
        target="_blank"
        rel="noreferrer"
        style={{
          color: "var(--ktn-action-primary-bg)",
          textDecoration: "underline",
        }}
      >
        Open file
      </a>
    );
  }

  function renderLinkValue(rawValue: unknown): ReactNode {
    const rawText = toTextValue(rawValue).trim();

    if (rawText === "") {
      return "";
    }

    const href = toLinkHref(rawText);

    if (href == null) {
      return rawText;
    }

    const isExternal =
      href.startsWith("http://") || href.startsWith("https://");

    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        style={{
          color: "var(--ktn-action-primary-bg)",
          textDecoration: "underline",
          textUnderlineOffset: "0.12em",
          wordBreak: "break-all",
        }}
      >
        {rawText}
      </a>
    );
  }

  function formatFieldValue(
    field: ResolvedFieldSchema<TData>,
    rawValue: unknown,
  ): ReactNode {
    if (rawValue == null) {
      return "";
    }

    const numericValue = toFiniteNumber(rawValue);
    const fieldLocale = field.locale ?? locale;

    if (field.type === "currency") {
      if (numericValue == null) {
        return toTextValue(rawValue);
      }

      const fieldCurrency = field.currency ?? currency ?? "USD";

      return new Intl.NumberFormat(fieldLocale, {
        style: "currency",
        currency: fieldCurrency,
        minimumFractionDigits: field.minimumFractionDigits,
        maximumFractionDigits: field.maximumFractionDigits,
      }).format(numericValue);
    }

    if (field.type === "number") {
      if (numericValue == null) {
        return toTextValue(rawValue);
      }

      return new Intl.NumberFormat(fieldLocale, {
        minimumFractionDigits: field.minimumFractionDigits,
        maximumFractionDigits: field.maximumFractionDigits,
      }).format(numericValue);
    }

    if (field.type === "percent") {
      if (numericValue == null) {
        return toTextValue(rawValue);
      }

      const percentBase =
        Math.abs(numericValue) > 1 ? numericValue / 100 : numericValue;

      return new Intl.NumberFormat(fieldLocale, {
        style: "percent",
        minimumFractionDigits: field.minimumFractionDigits ?? 0,
        maximumFractionDigits: field.maximumFractionDigits ?? 2,
      }).format(percentBase);
    }

    if (field.type === "date") {
      const dateInput =
        rawValue instanceof Date ||
        typeof rawValue === "string" ||
        typeof rawValue === "number"
          ? rawValue
          : null;

      if (dateInput == null) {
        return toTextValue(rawValue);
      }

      const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

      if (Number.isNaN(date.getTime())) {
        return toTextValue(rawValue);
      }

      return new Intl.DateTimeFormat(fieldLocale, field.dateOptions).format(
        date,
      );
    }

    if (field.type === "phone") {
      const text = toTextValue(rawValue).trim();
      return text === "" ? "" : formatPhoneLike(text);
    }

    if (field.type === "link") {
      return renderLinkValue(rawValue);
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

    if (
      field.type === "text" &&
      isStringValue(rawValue) &&
      looksLikeLink(rawValue)
    ) {
      return renderLinkValue(rawValue);
    }

    return toTextValue(rawValue);
  }

  function renderCardActions(row: TData, rowIndex: number): ReactNode {
    const rowActions = resolveActionsForRow(row, rowIndex);

    if (rowActions.length === 0) {
      return null;
    }

    const resolvedRowActionMode = resolveActionMode(
      actionMode,
      rowActions.length,
      resolvedInlineActionLimit,
    );

    if (resolvedRowActionMode === "menu") {
      return (
        <div style={actionRowStyle}>
          <DropdownMenu size={tokens.buttonSize}>
            <DropdownMenuTrigger
              openLabel="Open actions"
              closeLabel="Close actions"
            >
              <Button
                size={tokens.buttonSize}
                variant="outline"
                compact
                iconOnly
                tooltip={actionMenuLabel}
                aria-label={actionMenuA11yLabel}
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

    return (
      <div style={actionRowStyle}>
        {rowActions.map((action) => {
          const disabled = resolveActionDisabled(action, row, rowIndex);
          const shouldRenderIconOnly =
            rowActions.length <= resolvedInlineActionLimit &&
            action.icon != null;
          const actionLabelText = toActionLabelText(action.label, action.id);

          return (
            <Button
              key={`${rowIndex}-${action.id}`}
              size={tokens.buttonSize}
              variant={action.variant ?? "outline"}
              compact
              iconOnly={shouldRenderIconOnly}
              tooltip={shouldRenderIconOnly ? action.label : undefined}
              aria-label={shouldRenderIconOnly ? actionLabelText : undefined}
              disabled={disabled}
              onClick={(event) => {
                runAction(action, row, rowIndex, event);
              }}
            >
              {shouldRenderIconOnly ? (
                action.icon
              ) : (
                <>
                  {action.icon}
                  {action.label}
                </>
              )}
            </Button>
          );
        })}
      </div>
    );
  }

  const cardNodes = data.map((row, rowIndex) => {
    const rowId = resolveRowId(row, rowIndex, rowKey);

    const fieldNodes = resolvedSchema
      .map((field) => {
        const rawValue = getValueByPath(row, field.key);

        if (field.hideIfEmpty && isValueEmpty(rawValue)) {
          return null;
        }

        const valueNode =
          field.formatter != null
            ? field.formatter(rawValue, row, rowIndex)
            : formatFieldValue(field, rawValue);

        if (field.hideIfEmpty && isValueEmpty(valueNode)) {
          return null;
        }

        const resolvedSpan = resolveFieldSpan(
          field.type,
          field.key,
          rawValue,
          field.span,
        );
        return (
          <div
            key={`${rowId}-${field.key}`}
            style={{
              width: "100%",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: field.showLabel ? "0.12rem" : 0,
              alignItems: field.align === "right" ? "flex-end" : "flex-start",
              textAlign: field.align,
              justifySelf: "stretch",
              gridColumn: resolvedSpan,
            }}
          >
            {field.showLabel ? (
              <span style={labelStyle}>{field.label}</span>
            ) : null}
            <div
              style={{
                ...valueStyle,
                width: "100%",
              }}
            >
              {valueNode}
            </div>
          </div>
        );
      })
      .filter((node): node is JSX.Element => node != null);

    return (
      <article key={rowId} style={cardStyle}>
        {fieldNodes.length > 0 ? (
          <div style={contentGridStyle}>{fieldNodes}</div>
        ) : null}
        {renderCardActions(row, rowIndex)}
      </article>
    );
  });

  return (
    <div
      className={`${baseClasses} ${className}`.trim()}
      style={rootStyle}
      {...props}
    >
      {showViewSwitch && onSwitchToTableView != null ? (
        <div style={topBarStyle}>
          <Button
            size={tokens.buttonSize}
            variant="outline"
            compact
            onAction={(event) => {
              emitAction({
                source: "view-switch",
                actionId: "table-view",
                event,
              });

              onSwitchToTableView();
            }}
          >
            <FiList size={14} />
            {switchToTableViewLabel}
          </Button>
        </div>
      ) : null}

      {cardNodes.length === 0 ? (
        <div
          style={{
            ...cardStyle,
            color: tone.mutedColor,
            fontSize: tokens.valueSize,
            lineHeight: tokens.valueLineHeight,
          }}
        >
          {emptyText}
        </div>
      ) : viewportMaxHeight != null ? (
        <Scrollbar axis="y" style={viewportStyle}>
          <div style={listStyle}>{cardNodes}</div>
        </Scrollbar>
      ) : (
        <div style={listStyle}>{cardNodes}</div>
      )}
    </div>
  );
}
