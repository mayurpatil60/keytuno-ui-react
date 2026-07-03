import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

import { Badge, type BadgeVariant } from "./Badge";
import { Button, type ButtonProps } from "./Button";
import {
  DataFilterSortDialog,
  type DataFilterSortDialogColumn,
  type DataFilterSortDialogResult,
} from "./DataFilterSortDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./DropdownMenu";
import { Input } from "./Input";
import {
  FiFilter,
  FiList,
  FiMaximize2,
  FiMinimize2,
  FiMoreVertical,
  FiRefreshCw,
  FiSearch,
} from "./icons/feather";
import {
  Pagination,
  type PaginationActionContext,
  type PaginationProps,
  type PaginationSize,
} from "./Pagination";
import { Progress, type ProgressSize } from "./Progress";
import { Scrollbar } from "./Scrollbar";

export type CardDataVariant = "default" | "compact" | "ghost";
export type CardDataSize = "xs" | "sm" | "md" | "lg";
export type CardDataActionAlignment = "left" | "right";
export type CardDataActionPlacement = "top" | "bottom";
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

export interface CardDataColumns {
  mobile?: number;
  tablet?: number;
  web?: number;
}

export interface CardDataColumnBreakpoints {
  tablet?: number;
  web?: number;
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

export type CardDataActionSource =
  | "item-action"
  | "view-switch"
  | "refresh"
  | "fullscreen"
  | "search"
  | "sort"
  | "sort-reset"
  | "filter"
  | "column-filters-toggle"
  | "column-filters-apply"
  | "column-filters-clear"
  | "pagination"
  | "page-size";

export interface CardDataActionContext<TData extends object = object> {
  source: CardDataActionSource;
  actionId?: string;
  row?: TData;
  rowIndex?: number;
  page?: number;
  pageSize?: number;
  sort?: SortingState;
  filters?: ColumnFiltersState;
  search?: string;
  fullscreen?: boolean;
  showColumnFilters?: boolean;
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

  sortable?: boolean;
  filterable?: boolean;
  columnFilters?: string[];
  globalFilter?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchAriaLabel?: string;

  showToolbar?: boolean;
  showRefresh?: boolean;
  onRefresh?: () => void | Promise<void>;
  refreshLabel?: string;
  refreshingLabel?: string;
  fullscreen?: boolean;
  fullscreenLabel?: string;
  resetScreenLabel?: string;
  showFiltersLabel?: string;
  hideFiltersLabel?: string;
  filterDialogTitle?: string;
  filterDialogDescription?: string;
  addFilterLabel?: string;
  addSortLabel?: string;
  clearFiltersLabel?: string;
  resetSortingLabel?: string;
  applyFiltersLabel?: string;
  globalFilterLabel?: string;
  globalFilterPlaceholder?: string;

  actionInlineMaxVisible?: number;
  actionMode?: CardDataActionMode;
  actionAlignment?: CardDataActionAlignment;
  actionPlacement?: CardDataActionPlacement;
  actionMenuLabel?: ReactNode;
  showViewSwitch?: boolean;
  switchToTableViewLabel?: string;
  onSwitchToTableView?: () => void;

  columns?: number | CardDataColumns;
  columnBreakpoints?: CardDataColumnBreakpoints;

  virtualized?: boolean;
  virtualizedMaxHeight?: number | string;
  virtualizedEstimateSize?: number;
  virtualizedOverscan?: number;

  serverSide?: boolean;
  totalRows?: number;
  pageIndex?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  showPagination?: boolean;
  paginationVariant?: PaginationProps["variant"];
  paginationDefaultPageSize?: number;
  paginationPageSizeOptions?: number[];
  paginationMaxVisiblePages?: number;
  paginationShowPageSizeSelector?: boolean;
  paginationShowSummary?: boolean;
  paginationShowShowingPage?: boolean;
  paginationResetPageOnPageSizeChange?: boolean;
  paginationLabels?: PaginationProps["labels"];
  paginationSummaryFormatter?: PaginationProps["summaryFormatter"];
  paginationShowingPageFormatter?: PaginationProps["showingPageFormatter"];
  onSortChange?: (sort: SortingState) => void;
  onFilterChange?: (filters: ColumnFiltersState) => void;

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
  paginationSize: PaginationSize;
  progressSize: ProgressSize;
  mediaHeight: string;
  iconSize: number;
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

interface ResolvedCardDataColumns {
  mobile: number;
  tablet: number;
  web: number;
}

interface ResolvedCardDataColumnBreakpoints {
  tablet: number;
  web: number;
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
    paginationSize: "xs",
    progressSize: "xs",
    mediaHeight: "9rem",
    iconSize: 12,
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
    paginationSize: "sm",
    progressSize: "sm",
    mediaHeight: "10rem",
    iconSize: 13,
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
    paginationSize: "md",
    progressSize: "md",
    mediaHeight: "11.5rem",
    iconSize: 14,
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
    paginationSize: "lg",
    progressSize: "lg",
    mediaHeight: "13rem",
    iconSize: 15,
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
const GLOBAL_FILTER_ID = "__global";
const DEFAULT_PAGE_SIZE = 10;
const defaultCardColumns: ResolvedCardDataColumns = {
  mobile: 1,
  tablet: 2,
  web: 3,
};
const defaultCardColumnBreakpoints: ResolvedCardDataColumnBreakpoints = {
  tablet: 768,
  web: 1024,
};
const defaultVirtualEstimate: Record<CardDataSize, number> = {
  xs: 168,
  sm: 184,
  md: 208,
  lg: 236,
};

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

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function normalizePositiveInteger(
  value: number | undefined,
  fallback: number,
): number {
  if (value == null || Number.isNaN(value) || !Number.isFinite(value)) {
    return fallback;
  }

  const nextValue = Math.round(value);

  if (nextValue <= 0) {
    return fallback;
  }

  return nextValue;
}

function splitColumnFilterTerms(filterValue: unknown): string[] {
  if (typeof filterValue !== "string") {
    return [];
  }

  return filterValue
    .split(",")
    .map((term) => term.trim())
    .filter((term) => term !== "");
}

type NumericFilterOperator = "gt" | "gte" | "lt" | "lte" | "eq" | "neq";

type ParsedNumericCondition = {
  operator: NumericFilterOperator;
  value: number;
};

function parseNumericFilterCondition(
  term: string,
): ParsedNumericCondition | null {
  const normalizedTerm = term.trim();

  if (normalizedTerm === "") {
    return null;
  }

  const prefixedMatch = normalizedTerm.match(
    /^(>=|<=|!=|>|<|=)\s*(-?(?:\d+(?:\.\d+)?|\.\d+))$/,
  );

  if (prefixedMatch != null) {
    const [, operatorToken, valueToken] = prefixedMatch;
    const numericValue = Number.parseFloat(valueToken);

    if (Number.isNaN(numericValue) || !Number.isFinite(numericValue)) {
      return null;
    }

    if (operatorToken === ">") {
      return {
        operator: "gt",
        value: numericValue,
      };
    }

    if (operatorToken === ">=") {
      return {
        operator: "gte",
        value: numericValue,
      };
    }

    if (operatorToken === "<") {
      return {
        operator: "lt",
        value: numericValue,
      };
    }

    if (operatorToken === "<=") {
      return {
        operator: "lte",
        value: numericValue,
      };
    }

    if (operatorToken === "!=") {
      return {
        operator: "neq",
        value: numericValue,
      };
    }

    return {
      operator: "eq",
      value: numericValue,
    };
  }

  const bareNumberMatch = normalizedTerm.match(/^-?(?:\d+(?:\.\d+)?|\.\d+)$/);

  if (bareNumberMatch == null) {
    return null;
  }

  const numericValue = Number.parseFloat(normalizedTerm);

  if (Number.isNaN(numericValue) || !Number.isFinite(numericValue)) {
    return null;
  }

  return {
    operator: "eq",
    value: numericValue,
  };
}

function matchesStringCondition(source: string, term: string): boolean {
  const normalizedSource = source.toLowerCase();
  const normalizedTerm = term.trim();

  if (normalizedTerm === "") {
    return true;
  }

  if (normalizedTerm.startsWith("!=")) {
    const expected = normalizedTerm.slice(2).trim().toLowerCase();

    if (expected === "") {
      return true;
    }

    return normalizedSource !== expected;
  }

  if (normalizedTerm.startsWith("=")) {
    const expected = normalizedTerm.slice(1).trim().toLowerCase();

    if (expected === "") {
      return true;
    }

    return normalizedSource === expected;
  }

  if (normalizedTerm.startsWith("^")) {
    const expected = normalizedTerm.slice(1).trim().toLowerCase();

    if (expected === "") {
      return true;
    }

    return normalizedSource.startsWith(expected);
  }

  if (normalizedTerm.startsWith("~")) {
    const expected = normalizedTerm.slice(1).trim().toLowerCase();

    if (expected === "") {
      return true;
    }

    return normalizedSource.includes(expected);
  }

  if (normalizedTerm.endsWith("$")) {
    const expected = normalizedTerm.slice(0, -1).trim().toLowerCase();

    if (expected === "") {
      return true;
    }

    return normalizedSource.endsWith(expected);
  }

  return normalizedSource.includes(normalizedTerm.toLowerCase());
}

function matchesNumericCondition(
  value: number,
  condition: ParsedNumericCondition,
): boolean {
  if (condition.operator === "gt") {
    return value > condition.value;
  }

  if (condition.operator === "gte") {
    return value >= condition.value;
  }

  if (condition.operator === "lt") {
    return value < condition.value;
  }

  if (condition.operator === "lte") {
    return value <= condition.value;
  }

  if (condition.operator === "neq") {
    return value !== condition.value;
  }

  return value === condition.value;
}

function matchesAdvancedColumnFilter(
  cellValue: unknown,
  filterValue: unknown,
): boolean {
  const terms = splitColumnFilterTerms(filterValue);

  if (terms.length === 0) {
    return true;
  }

  const numericCellValue = toFiniteNumber(cellValue);
  const stringCellValue = toTextValue(cellValue);

  return terms.some((term) => {
    const numericCondition = parseNumericFilterCondition(term);

    if (numericCondition != null) {
      if (numericCellValue == null) {
        return false;
      }

      return matchesNumericCondition(numericCellValue, numericCondition);
    }

    return matchesStringCondition(stringCellValue, term);
  });
}

function toFieldLabelText(label: ReactNode, fallback: string): string {
  if (typeof label === "string") {
    const normalized = label.trim();
    return normalized === "" ? fallback : normalized;
  }

  if (typeof label === "number") {
    return String(label);
  }

  return fallback;
}

type RenderableCardRow<TData extends object> = {
  id: string;
  row: TData;
  rowIndex: number;
};

function chunkCardRows<TData extends object>(
  rows: RenderableCardRow<TData>[],
  chunkSize: number,
): RenderableCardRow<TData>[][] {
  const safeChunkSize = Math.max(1, chunkSize);
  const chunks: RenderableCardRow<TData>[][] = [];

  for (let index = 0; index < rows.length; index += safeChunkSize) {
    chunks.push(rows.slice(index, index + safeChunkSize));
  }

  return chunks;
}

function normalizeColumnCount(value: unknown, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(1, Math.min(12, Math.floor(value)));
}

function normalizeBreakpoint(value: unknown, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(320, Math.floor(value));
}

function resolveCardColumnsConfig(
  columns?: number | CardDataColumns,
): ResolvedCardDataColumns {
  if (typeof columns === "number") {
    const normalized = normalizeColumnCount(columns, defaultCardColumns.mobile);
    return {
      mobile: normalized,
      tablet: normalized,
      web: normalized,
    };
  }

  return {
    mobile: normalizeColumnCount(columns?.mobile, defaultCardColumns.mobile),
    tablet: normalizeColumnCount(columns?.tablet, defaultCardColumns.tablet),
    web: normalizeColumnCount(columns?.web, defaultCardColumns.web),
  };
}

function resolveCardColumnBreakpoints(
  breakpoints?: CardDataColumnBreakpoints,
): ResolvedCardDataColumnBreakpoints {
  const tablet = normalizeBreakpoint(
    breakpoints?.tablet,
    defaultCardColumnBreakpoints.tablet,
  );
  const web = normalizeBreakpoint(
    breakpoints?.web,
    defaultCardColumnBreakpoints.web,
  );

  return {
    tablet,
    web: web > tablet ? web : tablet + 1,
  };
}

function resolveListColumnCount(
  viewportWidth: number,
  columns: ResolvedCardDataColumns,
  breakpoints: ResolvedCardDataColumnBreakpoints,
): number {
  if (viewportWidth >= breakpoints.web) {
    return columns.web;
  }

  if (viewportWidth >= breakpoints.tablet) {
    return columns.tablet;
  }

  return columns.mobile;
}

function getViewportWidth(): number {
  if (typeof window === "undefined") {
    return 0;
  }

  return window.innerWidth;
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
  sortable = false,
  filterable = false,
  columnFilters,
  globalFilter,
  searchable = false,
  searchPlaceholder = "Search cards...",
  searchAriaLabel = "Search cards",
  showToolbar = true,
  showRefresh = false,
  onRefresh,
  refreshLabel = "Refresh",
  refreshingLabel = "Refreshing",
  fullscreen = false,
  fullscreenLabel = "Fullscreen",
  resetScreenLabel = "Reset",
  showFiltersLabel = "Filters",
  hideFiltersLabel = "Close",
  filterDialogTitle = "Advanced column filters",
  filterDialogDescription = "Build multiple per-column rules with operators, then apply or clear in one place.",
  addFilterLabel = "Add filter",
  addSortLabel = "Add sort",
  clearFiltersLabel = "Clear filters",
  resetSortingLabel = "Reset sorting",
  applyFiltersLabel = "Apply filters",
  globalFilterLabel = "Global search",
  globalFilterPlaceholder = "Search all columns",
  actionInlineMaxVisible = 5,
  actionMode = "auto",
  actionAlignment = "right",
  actionPlacement = "bottom",
  actionMenuLabel = "Actions",
  showViewSwitch = false,
  switchToTableViewLabel = "Table",
  onSwitchToTableView,
  columns,
  columnBreakpoints,
  virtualized = false,
  virtualizedMaxHeight = "34rem",
  virtualizedEstimateSize,
  virtualizedOverscan = 6,
  serverSide = false,
  totalRows,
  pageIndex,
  onPageChange,
  onPageSizeChange,
  showPagination = true,
  paginationVariant = "advance",
  paginationDefaultPageSize = DEFAULT_PAGE_SIZE,
  paginationPageSizeOptions,
  paginationMaxVisiblePages = 5,
  paginationShowPageSizeSelector = true,
  paginationShowSummary = true,
  paginationShowShowingPage = true,
  paginationResetPageOnPageSizeChange = true,
  paginationLabels,
  paginationSummaryFormatter,
  paginationShowingPageFormatter,
  onSortChange,
  onFilterChange,
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
  const normalizedDefaultPageSize = normalizePositiveInteger(
    paginationDefaultPageSize,
    DEFAULT_PAGE_SIZE,
  );
  const canUseGlobalFilter = globalFilter ?? searchable;
  const showSearchInput = searchable && canUseGlobalFilter;
  const resolvedInlineActionLimit = Number.isFinite(actionInlineMaxVisible)
    ? Math.max(1, Math.floor(actionInlineMaxVisible))
    : 5;
  const actionMenuA11yLabel =
    typeof actionMenuLabel === "string" && actionMenuLabel.trim() !== ""
      ? actionMenuLabel
      : "Actions";

  const filterableColumnSet = useMemo(
    () => new Set(columnFilters ?? []),
    [columnFilters],
  );

  const [sortingState, setSortingState] = useState<SortingState>([]);
  const [columnFilterState, setColumnFilterState] =
    useState<ColumnFiltersState>([]);
  const [globalSearch, setGlobalSearch] = useState("");
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: normalizedDefaultPageSize,
  });
  const [uncontrolledPage, setUncontrolledPage] = useState(
    Math.max(1, pageIndex ?? 1),
  );
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isFullscreenActive, setIsFullscreenActive] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFullscreenMode = fullscreen && isFullscreenActive;

  useEffect(() => {
    if (pageIndex != null) {
      setUncontrolledPage(Math.max(1, pageIndex));
    }
  }, [pageIndex]);

  useEffect(() => {
    setPaginationState((current) => {
      if (current.pageSize === normalizedDefaultPageSize) {
        return current;
      }

      return {
        ...current,
        pageIndex: 0,
        pageSize: normalizedDefaultPageSize,
      };
    });
  }, [normalizedDefaultPageSize]);

  const resolvedCardColumns = useMemo(
    () => resolveCardColumnsConfig(columns),
    [columns],
  );
  const resolvedCardBreakpoints = useMemo(
    () => resolveCardColumnBreakpoints(columnBreakpoints),
    [columnBreakpoints],
  );
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    getViewportWidth(),
  );
  const listColumnCount = useMemo(
    () =>
      resolveListColumnCount(
        viewportWidth,
        resolvedCardColumns,
        resolvedCardBreakpoints,
      ),
    [viewportWidth, resolvedCardColumns, resolvedCardBreakpoints],
  );

  const virtualViewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleResize = (): void => {
      setViewportWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!fullscreen || !isFullscreenActive) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [fullscreen, isFullscreenActive]);

  useEffect(() => {
    if (!fullscreen || !isFullscreenActive) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setIsFullscreenActive(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fullscreen, isFullscreenActive]);

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

  const schemaLabelByKey = useMemo(() => {
    const next = new Map<string, string>();

    resolvedSchema.forEach((field) => {
      next.set(
        field.key,
        toFieldLabelText(field.label, humanizeKey(field.key)),
      );
    });

    return next;
  }, [resolvedSchema]);

  const tableColumns = useMemo<ColumnDef<TData, unknown>[]>(() => {
    return resolvedSchema.map((field) => {
      const canFilterColumn =
        filterable &&
        (columnFilters == null ||
          columnFilters.length === 0 ||
          filterableColumnSet.has(field.key));

      const nextColumn: ColumnDef<TData, unknown> = {
        id: field.key,
        accessorFn: (row) => getValueByPath(row, field.key),
        enableSorting: sortable,
        enableColumnFilter: canFilterColumn,
      };

      if (canFilterColumn) {
        nextColumn.filterFn = ((row, columnId, filterValue) => {
          return matchesAdvancedColumnFilter(
            row.getValue(columnId),
            filterValue,
          );
        }) as NonNullable<typeof nextColumn.filterFn>;
      }

      return nextColumn;
    });
  }, [
    columnFilters,
    filterable,
    filterableColumnSet,
    resolvedSchema,
    sortable,
  ]);

  const isPageControlled = pageIndex !== undefined;
  const resolvedServerRowCount = Math.max(0, totalRows ?? data.length);
  const serverPageCount = Math.max(
    1,
    Math.ceil(resolvedServerRowCount / paginationState.pageSize),
  );
  const currentServerPageRaw = isPageControlled
    ? Math.max(1, pageIndex ?? 1)
    : uncontrolledPage;
  const currentServerPage = clamp(currentServerPageRaw, 1, serverPageCount);

  const tablePaginationState: PaginationState = {
    pageIndex: serverSide ? currentServerPage - 1 : paginationState.pageIndex,
    pageSize: paginationState.pageSize,
  };

  function buildExternalFilterState(
    filters: ColumnFiltersState,
    searchValue: string,
  ): ColumnFiltersState {
    const withoutGlobal = filters.filter(
      (item) => item.id !== GLOBAL_FILTER_ID,
    );

    if (!canUseGlobalFilter) {
      return withoutGlobal;
    }

    const normalizedSearch = searchValue.trim();

    if (normalizedSearch === "") {
      return withoutGlobal;
    }

    return [
      ...withoutGlobal,
      {
        id: GLOBAL_FILTER_ID,
        value: normalizedSearch,
      },
    ];
  }

  const table = useReactTable<TData>({
    data,
    columns: tableColumns,
    state: {
      sorting: sortingState,
      columnFilters: columnFilterState,
      globalFilter: canUseGlobalFilter ? globalSearch : undefined,
      pagination: tablePaginationState,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableSorting: sortable,
    enableSortingRemoval: true,
    globalFilterFn: "includesString",
    manualSorting: serverSide,
    manualFiltering: serverSide,
    manualPagination: serverSide,
    pageCount: serverSide ? serverPageCount : undefined,
    autoResetPageIndex: !serverSide,
    onSortingChange: (updater) => {
      setSortingState((current) => {
        const next = typeof updater === "function" ? updater(current) : updater;

        onSortChange?.(next);
        onAction?.({
          source: "sort",
          sort: next,
        });

        if (serverSide) {
          if (!isPageControlled) {
            setUncontrolledPage(1);
          }

          onPageChange?.(1);
        }

        return next;
      });
    },
    onColumnFiltersChange: (updater) => {
      setColumnFilterState((current) => {
        const next = typeof updater === "function" ? updater(current) : updater;
        const externalFilters = buildExternalFilterState(next, globalSearch);

        onFilterChange?.(externalFilters);
        onAction?.({
          source: "filter",
          filters: externalFilters,
          search: globalSearch,
        });

        if (serverSide) {
          if (!isPageControlled) {
            setUncontrolledPage(1);
          }

          onPageChange?.(1);
        }

        return next;
      });
    },
    onGlobalFilterChange: (updater) => {
      setGlobalSearch((current) => {
        const next =
          typeof updater === "function"
            ? updater(current)
            : String(updater ?? "");
        const externalFilters = buildExternalFilterState(
          columnFilterState,
          next,
        );

        onFilterChange?.(externalFilters);
        onAction?.({
          source: "search",
          search: next,
          filters: externalFilters,
        });

        if (serverSide) {
          if (!isPageControlled) {
            setUncontrolledPage(1);
          }

          onPageChange?.(1);
        }

        return next;
      });
    },
    getRowId: (row, index, parent) => {
      if (typeof rowKey === "function") {
        return String(rowKey(row, index));
      }

      if (rowKey != null) {
        const keyValue = row[rowKey];

        if (typeof keyValue === "string" || typeof keyValue === "number") {
          return String(keyValue);
        }
      }

      return parent != null ? `${parent.id}.${index}` : `${index}`;
    },
  });

  const filteredRowCount = table.getFilteredRowModel().rows.length;
  const clientPageCount = Math.max(
    1,
    Math.ceil(filteredRowCount / paginationState.pageSize),
  );

  useEffect(() => {
    if (serverSide) {
      return;
    }

    const maxPageIndex = clientPageCount - 1;

    setPaginationState((current) => {
      if (current.pageIndex <= maxPageIndex) {
        return current;
      }

      return {
        ...current,
        pageIndex: maxPageIndex,
      };
    });
  }, [clientPageCount, serverSide]);

  const totalRowsCount = serverSide ? resolvedServerRowCount : filteredRowCount;
  const totalPages = serverSide ? serverPageCount : clientPageCount;
  const currentPage = serverSide
    ? currentServerPage
    : table.getState().pagination.pageIndex + 1;

  useEffect(() => {
    if (!showPagination) {
      return;
    }

    if (listColumnCount <= 1) {
      return;
    }

    const requestedPageSize = Math.max(1, paginationState.pageSize);
    const remainder = requestedPageSize % listColumnCount;

    if (remainder === 0) {
      return;
    }

    const additionalNeeded = listColumnCount - remainder;
    const rowsRemainingAfterRequestedPage =
      totalRowsCount - currentPage * requestedPageSize;

    if (rowsRemainingAfterRequestedPage <= 0) {
      return;
    }

    const transferableRowCount = Math.min(
      additionalNeeded,
      rowsRemainingAfterRequestedPage,
    );
    const adjustedPageSize = requestedPageSize + transferableRowCount;

    setPaginationState((current) => {
      if (current.pageSize === adjustedPageSize && current.pageIndex === 0) {
        return current;
      }

      return {
        ...current,
        pageIndex: 0,
        pageSize: adjustedPageSize,
      };
    });

    onPageSizeChange?.(adjustedPageSize);

    if (serverSide) {
      if (!isPageControlled) {
        setUncontrolledPage(1);
      }

      onPageChange?.(1);
    }
  }, [
    currentPage,
    isPageControlled,
    listColumnCount,
    onPageChange,
    onPageSizeChange,
    paginationState.pageSize,
    serverSide,
    showPagination,
    totalRowsCount,
  ]);

  const filterableColumns = table.getAllLeafColumns().filter((column) => {
    if (!column.getCanFilter()) {
      return false;
    }

    if (columnFilters == null || columnFilters.length === 0) {
      return true;
    }

    return filterableColumnSet.has(column.id);
  });

  const activeColumnFilterCount = columnFilterState.reduce((count, filter) => {
    if (filter.id === GLOBAL_FILTER_ID) {
      return count;
    }

    return count + splitColumnFilterTerms(filter.value).length;
  }, 0);

  const hasActiveGlobalSearch =
    canUseGlobalFilter && globalSearch.trim() !== "";
  const totalActiveAdvancedFilters =
    activeColumnFilterCount + (hasActiveGlobalSearch ? 1 : 0);
  const showAdvancedFilterTrigger = filterable && filterableColumns.length > 0;

  const filterSortDialogColumns = useMemo<DataFilterSortDialogColumn[]>(() => {
    return table.getAllLeafColumns().map((column) => {
      const canFilterColumn =
        filterable &&
        (columnFilters == null ||
          columnFilters.length === 0 ||
          filterableColumnSet.has(column.id));

      return {
        id: column.id,
        label: schemaLabelByKey.get(column.id) ?? humanizeKey(column.id),
        canFilter: canFilterColumn && column.getCanFilter(),
        canSort: sortable && column.getCanSort(),
      };
    });
  }, [
    columnFilters,
    filterable,
    filterableColumnSet,
    schemaLabelByKey,
    sortable,
    table,
  ]);

  function handleAdvancedFilterDialogOpen(): void {
    if (!filterable || filterableColumns.length === 0) {
      return;
    }

    setIsFilterDialogOpen(true);

    onAction?.({
      source: "column-filters-toggle",
      showColumnFilters: true,
    });
  }

  function handleAdvancedFilterDialogOpenChange(nextOpen: boolean): void {
    setIsFilterDialogOpen(nextOpen);

    if (!nextOpen) {
      onAction?.({
        source: "column-filters-toggle",
        showColumnFilters: false,
      });
    }
  }

  function handleFilterSortDialogApply(
    result: DataFilterSortDialogResult,
    reason: "apply" | "clear-filters" | "reset-sorting",
  ): void {
    table.setColumnFilters(result.columnFilters);

    if (canUseGlobalFilter) {
      table.setGlobalFilter(result.globalSearch);
    }

    if (sortable) {
      table.setSorting(result.sorting);
    }

    if (reason === "clear-filters") {
      onAction?.({
        source: "column-filters-clear",
        filters: [],
        search: "",
      });
      return;
    }

    if (reason === "reset-sorting") {
      onAction?.({
        source: "sort-reset",
        sort: [],
      });
      return;
    }

    onAction?.({
      source: "column-filters-apply",
      filters: buildExternalFilterState(
        result.columnFilters,
        canUseGlobalFilter ? result.globalSearch : "",
      ),
      sort: result.sorting,
      search: canUseGlobalFilter ? result.globalSearch : undefined,
    });
  }

  function handlePageChange(nextPage: number): void {
    const normalized = clamp(nextPage, 1, totalPages);

    if (serverSide) {
      if (!isPageControlled) {
        setUncontrolledPage(normalized);
      }

      onPageChange?.(normalized);
      return;
    }

    setPaginationState((current) => ({
      ...current,
      pageIndex: normalized - 1,
    }));

    onPageChange?.(normalized);
  }

  function handlePageSizeChange(nextPageSize: number): void {
    const safePageSize = Math.max(1, nextPageSize);

    setPaginationState((current) => ({
      ...current,
      pageIndex: 0,
      pageSize: safePageSize,
    }));

    onPageSizeChange?.(safePageSize);

    if (serverSide) {
      if (!isPageControlled) {
        setUncontrolledPage(1);
      }

      onPageChange?.(1);
    }
  }

  function handlePaginationAction(context: PaginationActionContext): void {
    const source =
      context.source === "page-size" || context.source === "page-size-reset"
        ? "page-size"
        : "pagination";

    onAction?.({
      source,
      page: context.page,
      pageSize: context.pageSize,
      event: context.event,
    });
  }

  const renderedRows = table.getRowModel().rows.map((row) => ({
    id: row.id,
    row: row.original,
    rowIndex: row.index,
  }));
  const renderedRowGroups = useMemo(
    () => chunkCardRows(renderedRows, listColumnCount),
    [renderedRows, listColumnCount],
  );

  const shouldVirtualize = virtualized && renderedRows.length > 0;
  const resolvedVirtualHeight =
    virtualizedMaxHeight ?? viewportMaxHeight ?? "34rem";
  const resolvedVirtualEstimate =
    virtualizedEstimateSize ?? defaultVirtualEstimate[size];

  const virtualizer = useVirtualizer({
    count: renderedRowGroups.length,
    getScrollElement: () =>
      shouldVirtualize ? virtualViewportRef.current : null,
    estimateSize: () => resolvedVirtualEstimate,
    overscan: virtualizedOverscan,
    getItemKey: (groupIndex) => {
      const group = renderedRowGroups[groupIndex];

      if (group == null || group.length === 0) {
        return groupIndex;
      }

      return group.map((entry) => entry.id).join("|");
    },
    measureElement: (element) => {
      if (element == null) {
        return resolvedVirtualEstimate;
      }

      return element.getBoundingClientRect().height;
    },
  });

  useEffect(() => {
    if (!shouldVirtualize) {
      return;
    }

    virtualizer.measure();
  }, [
    shouldVirtualize,
    renderedRowGroups.length,
    listColumnCount,
    virtualizer,
  ]);

  const rootStyle: CSSProperties = {
    width: isFullscreenMode ? "auto" : "100%",
    maxWidth: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: tokens.listGap,
    position: isFullscreenMode ? "fixed" : undefined,
    inset: isFullscreenMode ? "1rem" : undefined,
    zIndex: isFullscreenMode ? 220 : undefined,
    padding: isFullscreenMode ? "0.8rem" : undefined,
    borderRadius: isFullscreenMode
      ? "var(--ktn-radius-lg, 0.625rem)"
      : undefined,
    boxShadow: isFullscreenMode
      ? "0 28px 60px rgba(15, 23, 42, 0.28)"
      : undefined,
    backgroundColor: isFullscreenMode ? tone.cardBackgroundColor : undefined,
    overflow: isFullscreenMode ? "hidden" : undefined,
    minHeight: isFullscreenMode ? 0 : undefined,
    ...(safeAreaAware
      ? {
          paddingLeft: "max(0.55rem, env(safe-area-inset-left))",
          paddingRight: "max(0.55rem, env(safe-area-inset-right))",
          paddingBottom: "max(0.55rem, env(safe-area-inset-bottom))",
        }
      : {}),
    ...style,
  };

  const toolbarStyle: CSSProperties = {
    width: "100%",
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.listGap,
    flexWrap: "nowrap",
  };

  const toolbarLeftStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    flexWrap: "nowrap",
    gap: "0.5rem",
    minWidth: 0,
    maxWidth: "100%",
    flex: "1 1 auto",
  };

  const toolbarRightStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    flexWrap: "nowrap",
    gap: "0.4rem",
    marginInlineStart: "auto",
    minWidth: "fit-content",
    maxWidth: "100%",
  };

  const searchWrapStyle: CSSProperties = {
    position: "relative",
    flex: "1 1 auto",
    width: "auto",
    boxSizing: "border-box",
    minInlineSize: 0,
    inlineSize: "auto",
    maxWidth: "100%",
    minWidth: 0,
  };

  const searchIconStyle: CSSProperties = {
    position: "absolute",
    insetInlineStart: "0.65rem",
    insetBlockStart: "50%",
    transform: "translateY(-50%)",
    display: "inline-flex",
    alignItems: "center",
    color: tone.mutedColor,
    pointerEvents: "none",
    lineHeight: 0,
  };

  const listStyle: CSSProperties = {
    width: "100%",
    minWidth: 0,
    display: "grid",
    gridTemplateColumns: `repeat(${listColumnCount}, minmax(0, 1fr))`,
    gap: tokens.listGap,
    alignItems: "start",
  };

  const viewportStyle: CSSProperties = {
    width: "100%",
    minWidth: 0,
    maxHeight:
      viewportMaxHeight != null ? toMaxHeight(viewportMaxHeight) : undefined,
    paddingInlineEnd: viewportMaxHeight != null ? "0.08rem" : undefined,
  };

  const virtualViewportStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    minWidth: 0,
    maxHeight: toMaxHeight(resolvedVirtualHeight),
    overflowY: "auto",
    overflowX: "hidden",
    paddingInlineEnd: "0.08rem",
  };

  const virtualTotalStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    minWidth: 0,
    height: `${virtualizer.getTotalSize()}px`,
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
    paddingTop: actionPlacement === "bottom" ? "0.15rem" : undefined,
    paddingBottom: actionPlacement === "top" ? "0.15rem" : undefined,
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

  const canShowViewSwitch = showViewSwitch && onSwitchToTableView != null;
  const canShowToolbar =
    showToolbar &&
    (showSearchInput ||
      showAdvancedFilterTrigger ||
      showRefresh ||
      canShowViewSwitch ||
      fullscreen);

  const filterTriggerTooltipLabel = isFilterDialogOpen
    ? hideFiltersLabel
    : showFiltersLabel;
  const filterTriggerAriaLabel =
    !isFilterDialogOpen && totalActiveAdvancedFilters > 0
      ? `${showFiltersLabel} (${totalActiveAdvancedFilters} active)`
      : filterTriggerTooltipLabel;

  async function handleRefresh(): Promise<void> {
    if (onRefresh == null) {
      return;
    }

    setIsRefreshing(true);

    try {
      await Promise.resolve(onRefresh());
    } finally {
      setIsRefreshing(false);
    }
  }

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

  function renderCardNode(
    row: TData,
    rowIndex: number,
    rowId: string,
  ): JSX.Element {
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

    const actionNode = renderCardActions(row, rowIndex);

    return (
      <article key={rowId} style={cardStyle}>
        {actionPlacement === "top" ? actionNode : null}
        {fieldNodes.length > 0 ? (
          <div style={contentGridStyle}>{fieldNodes}</div>
        ) : null}
        {actionPlacement === "bottom" ? actionNode : null}
      </article>
    );
  }

  const cardNodes = renderedRows.map((entry) =>
    renderCardNode(entry.row, entry.rowIndex, entry.id),
  );

  return (
    <div
      className={`${baseClasses} ${className}`.trim()}
      style={rootStyle}
      {...props}
    >
      {canShowToolbar ? (
        <div style={toolbarStyle}>
          <div style={toolbarLeftStyle}>
            {showSearchInput ? (
              <div style={searchWrapStyle}>
                <span style={searchIconStyle}>
                  <FiSearch size={tokens.iconSize} />
                </span>

                <Input
                  size={tokens.buttonSize}
                  value={globalSearch}
                  placeholder={searchPlaceholder}
                  aria-label={searchAriaLabel}
                  onChange={(event) => {
                    table.setGlobalFilter(event.currentTarget.value);
                  }}
                  style={{ paddingInlineStart: "1.95rem" }}
                />
              </div>
            ) : null}
          </div>

          <div style={toolbarRightStyle}>
            {showAdvancedFilterTrigger ? (
              <Button
                size={tokens.buttonSize}
                variant={
                  isFilterDialogOpen || totalActiveAdvancedFilters > 0
                    ? "primary"
                    : "outline"
                }
                iconOnly
                tooltip={filterTriggerTooltipLabel}
                tooltipSide="top"
                tooltipSize="xs"
                aria-label={filterTriggerAriaLabel}
                onClick={() => {
                  handleAdvancedFilterDialogOpen();
                }}
              >
                <FiFilter size={tokens.iconSize} />
              </Button>
            ) : null}

            {canShowViewSwitch ? (
              <Button
                size={tokens.buttonSize}
                variant="outline"
                iconOnly
                tooltip={switchToTableViewLabel}
                tooltipSide="top"
                tooltipSize="xs"
                aria-label={switchToTableViewLabel}
                onAction={(event) => {
                  emitAction({
                    source: "view-switch",
                    actionId: "table-view",
                    event,
                  });

                  onSwitchToTableView?.();
                }}
              >
                <FiList size={tokens.iconSize} />
              </Button>
            ) : null}

            {showRefresh ? (
              <Button
                size={tokens.buttonSize}
                variant="outline"
                iconOnly
                tooltip={isRefreshing ? `${refreshingLabel}...` : refreshLabel}
                tooltipSide="top"
                tooltipSize="xs"
                aria-label={isRefreshing ? refreshingLabel : refreshLabel}
                disabled={isRefreshing}
                onClick={(event) => {
                  emitAction({
                    source: "refresh",
                    event,
                  });

                  void handleRefresh();
                }}
              >
                <FiRefreshCw size={tokens.iconSize} />
              </Button>
            ) : null}

            {fullscreen ? (
              <Button
                size={tokens.buttonSize}
                variant={isFullscreenActive ? "primary" : "outline"}
                iconOnly
                tooltip={
                  isFullscreenActive ? resetScreenLabel : fullscreenLabel
                }
                tooltipSide="top"
                tooltipSize="xs"
                aria-label={
                  isFullscreenActive ? resetScreenLabel : fullscreenLabel
                }
                onClick={() => {
                  setIsFullscreenActive((current) => {
                    const next = !current;

                    emitAction({
                      source: "fullscreen",
                      fullscreen: next,
                    });

                    return next;
                  });
                }}
              >
                {isFullscreenActive ? (
                  <FiMinimize2 size={tokens.iconSize} />
                ) : (
                  <FiMaximize2 size={tokens.iconSize} />
                )}
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

      {renderedRows.length === 0 ? (
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
      ) : shouldVirtualize ? (
        <div
          ref={virtualViewportRef}
          role="presentation"
          style={virtualViewportStyle}
        >
          <div role="presentation" style={virtualTotalStyle}>
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const rowGroup = renderedRowGroups[virtualRow.index];

              if (rowGroup == null) {
                return null;
              }

              return (
                <div
                  key={virtualRow.key}
                  role="presentation"
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div style={listStyle}>
                    {rowGroup.map((entry) =>
                      renderCardNode(entry.row, entry.rowIndex, entry.id),
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : viewportMaxHeight != null ? (
        <Scrollbar axis="y" style={viewportStyle}>
          <div style={listStyle}>{cardNodes}</div>
        </Scrollbar>
      ) : (
        <div style={listStyle}>{cardNodes}</div>
      )}

      {showAdvancedFilterTrigger ? (
        <DataFilterSortDialog
          open={isFilterDialogOpen}
          onOpenChange={handleAdvancedFilterDialogOpenChange}
          columns={filterSortDialogColumns}
          columnFilters={columnFilterState}
          sorting={sortingState}
          globalSearch={globalSearch}
          canUseGlobalFilter={canUseGlobalFilter}
          enableSorting={sortable}
          controlSize={tokens.buttonSize}
          title={filterDialogTitle}
          description={filterDialogDescription}
          addFilterLabel={addFilterLabel}
          addSortLabel={addSortLabel}
          clearFiltersLabel={clearFiltersLabel}
          resetSortingLabel={resetSortingLabel}
          applyFiltersLabel={applyFiltersLabel}
          globalFilterLabel={globalFilterLabel}
          globalFilterPlaceholder={globalFilterPlaceholder}
          onApply={handleFilterSortDialogApply}
        />
      ) : null}

      {showPagination ? (
        <Pagination
          variant={paginationVariant}
          size={tokens.paginationSize}
          page={currentPage}
          totalPages={totalPages}
          pageSize={paginationState.pageSize}
          pageSizeOptions={paginationPageSizeOptions}
          maxVisiblePages={paginationMaxVisiblePages}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          showSummary={paginationShowSummary}
          showShowingPage={paginationShowShowingPage}
          showPageSizeSelector={paginationShowPageSizeSelector}
          resetPageOnPageSizeChange={paginationResetPageOnPageSizeChange}
          labels={paginationLabels ?? { item: "rows", perPage: "page" }}
          summaryFormatter={paginationSummaryFormatter}
          showingPageFormatter={paginationShowingPageFormatter}
          onAction={handlePaginationAction}
        />
      ) : null}

      <p
        style={{
          margin: 0,
          fontSize: tokens.labelSize,
          color: tone.mutedColor,
        }}
      >
        {`${totalRowsCount} total rows`}
      </p>
    </div>
  );
}
