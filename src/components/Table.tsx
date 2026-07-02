import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  FiChevronDown,
  FiChevronUp,
  FiFilter,
  FiColumns,
  FiDownload,
  FiMaximize2,
  FiMinimize2,
  FiRefreshCw,
  FiSearch,
  FiX,
} from "./icons/feather";

import { Button, type ButtonProps } from "./Button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./DropdownMenu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./Dialog";
import { Input } from "./Input";
import {
  Pagination,
  type PaginationActionContext,
  type PaginationProps,
  type PaginationSize,
} from "./Pagination";
import { Skeleton } from "./Skeleton";
import { Spinner } from "./Spinner";
import { Tooltip } from "./Tooltip";

export type TableVariant =
  | "basic"
  | "outline"
  | "ghost"
  | "filled"
  | "minimal"
  | "striped";
export type TableSize = "xs" | "sm" | "md" | "lg";
export type TableExportFormat = "csv" | "xlsx" | "pdf";
export type TableActionSource =
  | "search"
  | "sort"
  | "filter"
  | "selection"
  | "column-visibility"
  | "column-filters-toggle"
  | "column-filters-apply"
  | "column-filters-clear"
  | "refresh"
  | "export"
  | "fullscreen"
  | "pagination"
  | "page-size"
  | "row-action";

export interface TableActionContext<TData extends object = object> {
  source: TableActionSource;
  page?: number;
  pageSize?: number;
  sort?: SortingState;
  filters?: ColumnFiltersState;
  search?: string;
  selectedRows?: TData[];
  visibleColumnIds?: string[];
  actionId?: string;
  row?: TData;
  rowIndex?: number;
  exportFormat?: TableExportFormat;
  fullscreen?: boolean;
  showColumnFilters?: boolean;
  event?: unknown;
}

export interface TableExportRows {
  headers: string[];
  records: string[][];
}

export interface TableExportPayload {
  rows: TableExportRows;
  fileNameBase: string;
}

export type TableExportHandler = (
  payload: TableExportPayload,
) => Promise<void> | void;

export type TableColumnDef<TData extends object = object> = ColumnDef<
  TData,
  unknown
>;

type TableButtonVariant = NonNullable<ButtonProps["variant"]>;

export interface RowAction<TData extends object = object> {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  variant?: TableButtonVariant;
  compact?: boolean;
  iconOnly?: boolean;
  iconOnlyTone?: boolean;
  iconColor?: CSSProperties["color"];
  tooltip?: ButtonProps["tooltip"];
  tooltipSide?: ButtonProps["tooltipSide"];
  tooltipSize?: ButtonProps["tooltipSize"];
  tooltipDisabled?: ButtonProps["tooltipDisabled"];
  tooltipOpenDelay?: ButtonProps["tooltipOpenDelay"];
  tooltipCloseDelay?: ButtonProps["tooltipCloseDelay"];
  onClick: (row: TData, rowIndex: number) => void;
  disabled?: (row: TData, rowIndex: number) => boolean;
}

export interface TableProps<TData extends object = object> extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  data?: TData[];
  columns: TableColumnDef<TData>[];
  rowKey?: keyof TData | ((row: TData, index: number) => string | number);

  variant?: TableVariant;
  size?: TableSize;
  compact?: boolean;

  sortable?: boolean;

  filterable?: boolean;
  columnFilters?: string[];
  globalFilter?: boolean;

  searchable?: boolean;
  searchPlaceholder?: string;
  searchAriaLabel?: string;

  selectable?: boolean;
  multiSelect?: boolean;
  selectAllRowsAriaLabel?: string;
  selectRowAriaLabelFormatter?: (rowNumber: number) => string;
  selectedCountFormatter?: (count: number) => ReactNode;
  onSelectionChange?: (selectedRows: TData[]) => void;
  onAction?: (context: TableActionContext<TData>) => void;

  rowActions?: RowAction<TData>[];

  columnVisibility?: boolean;
  defaultHiddenColumns?: string[];

  showToolbar?: boolean;
  showColumnToggle?: boolean;
  columnsLabel?: string;
  toggleColumnsLabel?: string;
  showFiltersLabel?: string;
  hideFiltersLabel?: string;
  filterDialogTitle?: string;
  filterDialogDescription?: string;
  addFilterLabel?: string;
  clearFiltersLabel?: string;
  applyFiltersLabel?: string;
  globalFilterLabel?: string;
  globalFilterPlaceholder?: string;
  refreshLabel?: string;
  refreshingLabel?: string;
  fullscreenLabel?: string;
  resetScreenLabel?: string;
  downloadLabel?: string;
  exportingLabelFormatter?: (format: TableExportFormat) => string;
  exportFormatLabel?: string;
  showRefresh?: boolean;
  onRefresh?: () => void | Promise<void>;
  showExport?: boolean;

  exportable?: boolean;
  exportFormats?: TableExportFormat[];
  exportHandlers?: Partial<Record<TableExportFormat, TableExportHandler>>;
  exportFileName?: string;

  loading?: boolean;
  loadingRows?: number;
  loadingText?: ReactNode;
  skeleton?: boolean;

  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  rounded?: boolean;
  stickyHeader?: boolean;

  fullscreen?: boolean;

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

  emptyText?: ReactNode;
}

type TableSizeTokens = {
  tableFontSize: string;
  headerFontSize: string;
  cellPadding: string;
  toolbarGap: string;
  controlSize: "xs" | "sm" | "md" | "lg";
  paginationSize: PaginationSize;
  iconSize: number;
};

type TableVariantTokens = {
  rootBackgroundColor: string;
  headerBackgroundColor: string;
  headerTextColor: string;
  textColor: string;
  mutedTextColor: string;
  borderColor: string;
  rowBorderColor: string;
  stripedRowColor: string;
  hoverRowColor: string;
};

const baseClasses = "flex w-full min-w-0 flex-col";
const SPECIAL_SELECT_COLUMN_ID = "__select";
const SPECIAL_ACTIONS_COLUMN_ID = "__actions";
const GLOBAL_FILTER_ID = "__global";
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_EXPORT_FORMATS: TableExportFormat[] = ["csv"];
const DEFAULT_EXPORT_FILE_NAME = "table-export";
const DEFAULT_EMPTY_TEXT = "No records found.";

const sizeTokens: Record<TableSize, TableSizeTokens> = {
  xs: {
    tableFontSize: "0.75rem",
    headerFontSize: "0.7rem",
    cellPadding: "0.38rem 0.45rem",
    toolbarGap: "0.45rem",
    controlSize: "xs",
    paginationSize: "xs",
    iconSize: 12,
  },
  sm: {
    tableFontSize: "0.8125rem",
    headerFontSize: "0.74rem",
    cellPadding: "0.45rem 0.55rem",
    toolbarGap: "0.55rem",
    controlSize: "sm",
    paginationSize: "sm",
    iconSize: 13,
  },
  md: {
    tableFontSize: "0.875rem",
    headerFontSize: "0.78rem",
    cellPadding: "0.55rem 0.65rem",
    toolbarGap: "0.65rem",
    controlSize: "md",
    paginationSize: "md",
    iconSize: 14,
  },
  lg: {
    tableFontSize: "0.9375rem",
    headerFontSize: "0.84rem",
    cellPadding: "0.65rem 0.8rem",
    toolbarGap: "0.75rem",
    controlSize: "lg",
    paginationSize: "lg",
    iconSize: 15,
  },
};

const variantTokens: Record<TableVariant, TableVariantTokens> = {
  basic: {
    rootBackgroundColor: "var(--ktn-bg-surface, #ffffff)",
    headerBackgroundColor:
      "color-mix(in srgb, var(--ktn-bg-muted, #f8fafc) 85%, #ffffff)",
    headerTextColor: "var(--ktn-text-primary)",
    textColor: "var(--ktn-text-primary)",
    mutedTextColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    borderColor: "var(--ktn-border-muted)",
    rowBorderColor:
      "color-mix(in srgb, var(--ktn-border-muted) 88%, transparent)",
    stripedRowColor:
      "color-mix(in srgb, var(--ktn-bg-muted, #f8fafc) 62%, transparent)",
    hoverRowColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 10%, transparent)",
  },
  outline: {
    rootBackgroundColor: "var(--ktn-bg-surface, #ffffff)",
    headerBackgroundColor:
      "color-mix(in srgb, var(--ktn-bg-muted, #f8fafc) 90%, #ffffff)",
    headerTextColor: "var(--ktn-text-primary)",
    textColor: "var(--ktn-text-primary)",
    mutedTextColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    borderColor: "var(--ktn-border-strong, var(--ktn-border-muted))",
    rowBorderColor: "var(--ktn-border-muted)",
    stripedRowColor:
      "color-mix(in srgb, var(--ktn-bg-muted, #f8fafc) 58%, transparent)",
    hoverRowColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 11%, transparent)",
  },
  ghost: {
    rootBackgroundColor: "transparent",
    headerBackgroundColor: "transparent",
    headerTextColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    textColor: "var(--ktn-text-primary)",
    mutedTextColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    borderColor: "transparent",
    rowBorderColor: "transparent",
    stripedRowColor:
      "color-mix(in srgb, var(--ktn-bg-muted, #f8fafc) 46%, transparent)",
    hoverRowColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 8%, transparent)",
  },
  filled: {
    rootBackgroundColor:
      "color-mix(in srgb, var(--ktn-bg-surface, #ffffff) 88%, var(--ktn-bg-muted, #f8fafc))",
    headerBackgroundColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 14%, var(--ktn-bg-surface, #ffffff))",
    headerTextColor: "var(--ktn-text-primary)",
    textColor: "var(--ktn-text-primary)",
    mutedTextColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    borderColor: "color-mix(in srgb, var(--ktn-border-muted) 92%, transparent)",
    rowBorderColor:
      "color-mix(in srgb, var(--ktn-border-muted) 86%, transparent)",
    stripedRowColor:
      "color-mix(in srgb, var(--ktn-bg-muted, #f8fafc) 54%, transparent)",
    hoverRowColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 9%, transparent)",
  },
  minimal: {
    rootBackgroundColor: "var(--ktn-bg-surface, #ffffff)",
    headerBackgroundColor: "transparent",
    headerTextColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    textColor: "var(--ktn-text-primary)",
    mutedTextColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    borderColor: "color-mix(in srgb, var(--ktn-border-muted) 68%, transparent)",
    rowBorderColor:
      "color-mix(in srgb, var(--ktn-border-muted) 52%, transparent)",
    stripedRowColor:
      "color-mix(in srgb, var(--ktn-bg-muted, #f8fafc) 38%, transparent)",
    hoverRowColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 7%, transparent)",
  },
  striped: {
    rootBackgroundColor: "var(--ktn-bg-surface, #ffffff)",
    headerBackgroundColor:
      "color-mix(in srgb, var(--ktn-bg-muted, #f8fafc) 84%, #ffffff)",
    headerTextColor: "var(--ktn-text-primary)",
    textColor: "var(--ktn-text-primary)",
    mutedTextColor: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    borderColor: "var(--ktn-border-muted)",
    rowBorderColor:
      "color-mix(in srgb, var(--ktn-border-muted) 86%, transparent)",
    stripedRowColor:
      "color-mix(in srgb, var(--ktn-bg-muted, #f8fafc) 72%, transparent)",
    hoverRowColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 10%, transparent)",
  },
};

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

type AdvancedFilterOperator =
  | "contains"
  | "starts-with"
  | "ends-with"
  | "equals"
  | "not-equals"
  | "gt"
  | "gte"
  | "lt"
  | "lte";

interface AdvancedFilterRule {
  id: string;
  columnId: string;
  operator: AdvancedFilterOperator;
  value: string;
}

type AdvancedFilterOperatorOption = {
  value: AdvancedFilterOperator;
  label: string;
};

const advancedFilterOperatorOptions: AdvancedFilterOperatorOption[] = [
  { value: "contains", label: "Contains" },
  { value: "starts-with", label: "Starts with" },
  { value: "ends-with", label: "Ends with" },
  { value: "equals", label: "Equals" },
  { value: "not-equals", label: "Not equals" },
  { value: "gt", label: "Greater than" },
  { value: "gte", label: "Greater than or equal" },
  { value: "lt", label: "Less than" },
  { value: "lte", label: "Less than or equal" },
];

const defaultAdvancedFilterOperator: AdvancedFilterOperator = "contains";

type ParsedNumericCondition = {
  operator: NumericFilterOperator;
  value: number;
};

function createAdvancedFilterRuleId(): string {
  return `adv-filter-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

function createAdvancedFilterRule(columnId: string): AdvancedFilterRule {
  return {
    id: createAdvancedFilterRuleId(),
    columnId,
    operator: defaultAdvancedFilterOperator,
    value: "",
  };
}

function toAdvancedFilterToken(
  operator: AdvancedFilterOperator,
  rawValue: string,
): string {
  const value = rawValue.trim();

  if (value === "") {
    return "";
  }

  if (operator === "starts-with") {
    return `^${value}`;
  }

  if (operator === "ends-with") {
    return `${value}$`;
  }

  if (operator === "equals") {
    return `=${value}`;
  }

  if (operator === "not-equals") {
    return `!=${value}`;
  }

  if (operator === "gt") {
    return `>${value}`;
  }

  if (operator === "gte") {
    return `>=${value}`;
  }

  if (operator === "lt") {
    return `<${value}`;
  }

  if (operator === "lte") {
    return `<=${value}`;
  }

  return `~${value}`;
}

function parseAdvancedFilterToken(token: string): {
  operator: AdvancedFilterOperator;
  value: string;
} {
  const normalizedToken = token.trim();

  if (normalizedToken === "") {
    return {
      operator: defaultAdvancedFilterOperator,
      value: "",
    };
  }

  if (normalizedToken.startsWith("!=")) {
    return {
      operator: "not-equals",
      value: normalizedToken.slice(2).trim(),
    };
  }

  if (normalizedToken.startsWith(">=")) {
    return {
      operator: "gte",
      value: normalizedToken.slice(2).trim(),
    };
  }

  if (normalizedToken.startsWith("<=")) {
    return {
      operator: "lte",
      value: normalizedToken.slice(2).trim(),
    };
  }

  if (normalizedToken.startsWith(">")) {
    return {
      operator: "gt",
      value: normalizedToken.slice(1).trim(),
    };
  }

  if (normalizedToken.startsWith("<")) {
    return {
      operator: "lt",
      value: normalizedToken.slice(1).trim(),
    };
  }

  if (normalizedToken.startsWith("=")) {
    return {
      operator: "equals",
      value: normalizedToken.slice(1).trim(),
    };
  }

  if (normalizedToken.startsWith("^")) {
    return {
      operator: "starts-with",
      value: normalizedToken.slice(1).trim(),
    };
  }

  if (normalizedToken.startsWith("~")) {
    return {
      operator: "contains",
      value: normalizedToken.slice(1).trim(),
    };
  }

  if (normalizedToken.endsWith("$")) {
    return {
      operator: "ends-with",
      value: normalizedToken.slice(0, -1).trim(),
    };
  }

  return {
    operator: "contains",
    value: normalizedToken,
  };
}

function extractAdvancedFilterRules(
  filters: ColumnFiltersState,
): AdvancedFilterRule[] {
  const rules: AdvancedFilterRule[] = [];

  filters.forEach((filter) => {
    if (
      filter.id === GLOBAL_FILTER_ID ||
      filter.id === SPECIAL_SELECT_COLUMN_ID ||
      filter.id === SPECIAL_ACTIONS_COLUMN_ID
    ) {
      return;
    }

    const terms = splitColumnFilterTerms(filter.value);

    terms.forEach((term) => {
      const parsed = parseAdvancedFilterToken(term);

      rules.push({
        id: createAdvancedFilterRuleId(),
        columnId: filter.id,
        operator: parsed.operator,
        value: parsed.value,
      });
    });
  });

  return rules;
}

function buildColumnFiltersFromAdvancedRules(
  rules: AdvancedFilterRule[],
): ColumnFiltersState {
  const groupedByColumn = new Map<string, string[]>();

  rules.forEach((rule) => {
    const normalizedColumnId = rule.columnId.trim();

    if (
      normalizedColumnId === "" ||
      normalizedColumnId === SPECIAL_SELECT_COLUMN_ID ||
      normalizedColumnId === SPECIAL_ACTIONS_COLUMN_ID ||
      normalizedColumnId === GLOBAL_FILTER_ID
    ) {
      return;
    }

    const token = toAdvancedFilterToken(rule.operator, rule.value);

    if (token === "") {
      return;
    }

    const existingTokens = groupedByColumn.get(normalizedColumnId);

    if (existingTokens == null) {
      groupedByColumn.set(normalizedColumnId, [token]);
      return;
    }

    existingTokens.push(token);
  });

  return Array.from(groupedByColumn.entries()).map(([columnId, terms]) => ({
    id: columnId,
    value: terms.join(","),
  }));
}

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

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const normalizedValue = value.trim();

    if (!/^-?(?:\d+(?:\.\d+)?|\.\d+)$/.test(normalizedValue)) {
      return null;
    }

    const parsedValue = Number.parseFloat(normalizedValue);
    return Number.isFinite(parsedValue) ? parsedValue : null;
  }

  return null;
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
  const stringCellValue = toCellText(cellValue);

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

function toCompactTableSize(size: TableSize): TableSize {
  if (size === "lg") {
    return "md";
  }

  if (size === "md") {
    return "sm";
  }

  return "xs";
}

function resolveColumnId<TData extends object>(
  column: TableColumnDef<TData>,
  index: number,
): string {
  const maybeId = (column as { id?: unknown }).id;

  if (typeof maybeId === "string" && maybeId.trim() !== "") {
    return maybeId;
  }

  const maybeAccessorKey = (column as { accessorKey?: unknown }).accessorKey;

  if (typeof maybeAccessorKey === "string" && maybeAccessorKey.trim() !== "") {
    return maybeAccessorKey;
  }

  return `column-${index + 1}`;
}

function toHeaderLabel<TData extends object>(
  column: Column<TData, unknown>,
): string {
  const header = column.columnDef.header;

  if (typeof header === "string" || typeof header === "number") {
    return String(header);
  }

  return column.id;
}

function toCellText(value: unknown): string {
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

function escapeCsvValue(value: string): string {
  const escaped = value.replaceAll('"', '""');
  return `"${escaped}"`;
}

function isRowActionLabelEmpty(label: ReactNode): boolean {
  if (label == null) {
    return true;
  }

  if (typeof label === "string") {
    return label.trim() === "";
  }

  return false;
}

function humanizeActionId(actionId: string): string {
  const trimmed = actionId.trim();

  if (trimmed === "") {
    return "";
  }

  return trimmed
    .replaceAll(/[_-]+/g, " ")
    .replaceAll(/\s+/g, " ")
    .trim()
    .replaceAll(/\b\w/g, (character) => character.toUpperCase());
}

function resolveRowActionTooltip<TData extends object>(
  action: RowAction<TData>,
  isIconOnlyAction: boolean,
): ButtonProps["tooltip"] {
  if (!isIconOnlyAction) {
    return undefined;
  }

  if (
    action.tooltip != null &&
    !(typeof action.tooltip === "string" && action.tooltip.trim() === "")
  ) {
    return action.tooltip;
  }

  if (typeof action.label === "string" && action.label.trim() !== "") {
    return action.label;
  }

  const readableActionId = humanizeActionId(action.id);

  return readableActionId === "" ? undefined : readableActionId;
}

function triggerDownload(
  fileName: string,
  mimeType: string,
  content: BlobPart,
): void {
  const blob = new Blob([content], { type: mimeType });
  const objectUrl = URL.createObjectURL(blob);
  const anchorElement = document.createElement("a");
  anchorElement.href = objectUrl;
  anchorElement.download = fileName;
  document.body.appendChild(anchorElement);
  anchorElement.click();
  document.body.removeChild(anchorElement);
  URL.revokeObjectURL(objectUrl);
}

function exportTableAsCsv({ rows, fileNameBase }: TableExportPayload): void {
  const csvLines = [
    rows.headers.map(escapeCsvValue).join(","),
    ...rows.records.map((row) => row.map(escapeCsvValue).join(",")),
  ];

  triggerDownload(
    `${fileNameBase}.csv`,
    "text/csv;charset=utf-8",
    csvLines.join("\n"),
  );
}

const defaultTableExportHandlers: Partial<
  Record<TableExportFormat, TableExportHandler>
> = {
  csv: exportTableAsCsv,
};

export function Table<TData extends object = object>({
  data = [],
  columns,
  rowKey,
  variant,
  size = "md",
  compact = false,
  sortable = false,
  filterable = false,
  columnFilters,
  globalFilter,
  searchable = false,
  searchPlaceholder = "Search table...",
  searchAriaLabel = "Search table",
  selectable = false,
  multiSelect = true,
  selectAllRowsAriaLabel = "Select all rows on current page",
  selectRowAriaLabelFormatter = (rowNumber: number) =>
    `Select row ${rowNumber}`,
  selectedCountFormatter = (count: number) => `${count} selected`,
  onSelectionChange,
  onAction,
  rowActions,
  columnVisibility = false,
  defaultHiddenColumns,
  showToolbar = true,
  showColumnToggle = true,
  columnsLabel = "Columns",
  toggleColumnsLabel = "Toggle Columns",
  showFiltersLabel = "Show filters",
  hideFiltersLabel = "Hide filters",
  filterDialogTitle = "Advanced column filters",
  filterDialogDescription = "Build multiple per-column rules with operators, then apply or clear in one place.",
  addFilterLabel = "Add filter",
  clearFiltersLabel = "Clear filters",
  applyFiltersLabel = "Apply filters",
  globalFilterLabel = "Global search",
  globalFilterPlaceholder = "Search all columns",
  refreshLabel = "Refresh",
  refreshingLabel = "Refreshing",
  fullscreenLabel = "Fullscreen",
  resetScreenLabel = "Reset screen",
  downloadLabel = "Download",
  exportingLabelFormatter = (format: TableExportFormat) =>
    `Exporting ${format.toUpperCase()}...`,
  exportFormatLabel = "Export Format",
  showRefresh = false,
  onRefresh,
  showExport = false,
  exportable = false,
  exportFormats = DEFAULT_EXPORT_FORMATS,
  exportHandlers,
  exportFileName = DEFAULT_EXPORT_FILE_NAME,
  loading = false,
  loadingRows = 6,
  loadingText = "Loading table...",
  skeleton = true,
  striped,
  hoverable = true,
  bordered = true,
  rounded = true,
  stickyHeader = false,
  fullscreen = false,
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
  emptyText = DEFAULT_EMPTY_TEXT,
  className = "",
  style,
  ...props
}: TableProps<TData>): JSX.Element {
  const resolvedVariant = variant ?? "basic";
  const resolvedSize = compact ? toCompactTableSize(size) : size;
  const sizeToken = sizeTokens[resolvedSize];
  const colorToken = variantTokens[resolvedVariant];

  const shouldStriped = striped ?? resolvedVariant === "striped";
  const canUseGlobalFilter = globalFilter ?? searchable;
  const showSearchInput = searchable && canUseGlobalFilter;
  const hasRowActions = rowActions != null && rowActions.length > 0;
  const normalizedDefaultPageSize = normalizePositiveInteger(
    paginationDefaultPageSize,
    DEFAULT_PAGE_SIZE,
  );

  const filterableColumnSet = useMemo(
    () => new Set(columnFilters ?? []),
    [columnFilters],
  );

  const initialVisibilityState = useMemo<VisibilityState>(() => {
    const nextState: VisibilityState = {};

    defaultHiddenColumns?.forEach((columnId) => {
      if (columnId.trim() !== "") {
        nextState[columnId] = false;
      }
    });

    return nextState;
  }, [defaultHiddenColumns]);

  const [sortingState, setSortingState] = useState<SortingState>([]);
  const [columnFilterState, setColumnFilterState] =
    useState<ColumnFiltersState>([]);
  const [globalSearch, setGlobalSearch] = useState("");
  const [rowSelectionState, setRowSelectionState] = useState<RowSelectionState>(
    {},
  );
  const [visibilityState, setVisibilityState] = useState<VisibilityState>(
    initialVisibilityState,
  );
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: normalizedDefaultPageSize,
  });
  const [uncontrolledPage, setUncontrolledPage] = useState(
    Math.max(1, pageIndex ?? 1),
  );
  const [isFullscreenActive, setIsFullscreenActive] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [exportingFormat, setExportingFormat] =
    useState<TableExportFormat | null>(null);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [advancedFilterDraftRules, setAdvancedFilterDraftRules] = useState<
    AdvancedFilterRule[]
  >([]);
  const [advancedFilterDraftSearch, setAdvancedFilterDraftSearch] =
    useState("");
  const isFullscreenMode = fullscreen && isFullscreenActive;

  useEffect(() => {
    setVisibilityState(initialVisibilityState);
  }, [initialVisibilityState]);

  useEffect(() => {
    if (pageIndex != null) {
      setUncontrolledPage(Math.max(1, pageIndex));
    }
  }, [pageIndex]);

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

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFullscreenActive(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fullscreen, isFullscreenActive]);

  const normalizedColumns = useMemo<TableColumnDef<TData>[]>(() => {
    return columns.map((column, index) => {
      const resolvedId = resolveColumnId(column, index);

      const nextColumn: TableColumnDef<TData> = {
        ...column,
        id: (column as { id?: string }).id ?? resolvedId,
      };

      if (!sortable && nextColumn.enableSorting === undefined) {
        nextColumn.enableSorting = false;
      }

      if (filterable) {
        const canFilterColumn =
          columnFilters == null ||
          columnFilters.length === 0 ||
          filterableColumnSet.has(resolvedId);

        if (nextColumn.enableColumnFilter === undefined) {
          nextColumn.enableColumnFilter = canFilterColumn;
        }

        if (canFilterColumn && nextColumn.filterFn === undefined) {
          nextColumn.filterFn = ((
            row: Row<TData>,
            columnId: string,
            filterValue: unknown,
          ) => {
            return matchesAdvancedColumnFilter(
              row.getValue(columnId),
              filterValue,
            );
          }) as NonNullable<typeof nextColumn.filterFn>;
        }
      } else if (nextColumn.enableColumnFilter === undefined) {
        nextColumn.enableColumnFilter = false;
      }

      if (columnVisibility && nextColumn.enableHiding === undefined) {
        nextColumn.enableHiding = true;
      }

      return nextColumn;
    });
  }, [
    columnFilters,
    columnVisibility,
    columns,
    filterable,
    filterableColumnSet,
    sortable,
  ]);

  const selectionColumn = useMemo<TableColumnDef<TData> | null>(() => {
    if (!selectable) {
      return null;
    }

    return {
      id: SPECIAL_SELECT_COLUMN_ID,
      header: ({ table }) =>
        multiSelect ? (
          <input
            type="checkbox"
            aria-label={selectAllRowsAriaLabel}
            checked={table.getIsAllPageRowsSelected()}
            ref={(element) => {
              if (element != null) {
                element.indeterminate =
                  table.getIsSomePageRowsSelected() &&
                  !table.getIsAllPageRowsSelected();
              }
            }}
            onChange={(event) => {
              table.toggleAllPageRowsSelected(event.currentTarget.checked);

              onAction?.({
                source: "selection",
                actionId: event.currentTarget.checked
                  ? "select-all-page"
                  : "clear-page-selection",
                event,
              });
            }}
            style={{
              width: "0.9rem",
              height: "0.9rem",
              cursor: "pointer",
              accentColor: "var(--ktn-action-primary-bg, #2563eb)",
            }}
          />
        ) : null,
      cell: ({ row }) => (
        <input
          type="checkbox"
          aria-label={selectRowAriaLabelFormatter(row.index + 1)}
          checked={row.getIsSelected()}
          onChange={(event) => {
            row.toggleSelected(event.currentTarget.checked);

            onAction?.({
              source: "selection",
              actionId: event.currentTarget.checked
                ? "select-row"
                : "clear-row-selection",
              row: row.original,
              rowIndex: row.index,
              event,
            });
          }}
          style={{
            width: "0.9rem",
            height: "0.9rem",
            cursor: "pointer",
            accentColor: "var(--ktn-action-primary-bg, #2563eb)",
          }}
        />
      ),
      enableSorting: false,
      enableColumnFilter: false,
      enableHiding: false,
      size: 36,
    };
  }, [multiSelect, onAction, selectable]);

  const rowActionsColumn = useMemo<TableColumnDef<TData> | null>(() => {
    if (!hasRowActions || rowActions == null) {
      return null;
    }

    return {
      id: SPECIAL_ACTIONS_COLUMN_ID,
      header: "Actions",
      cell: ({ row }) => (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0,
            flexWrap: "nowrap",
            whiteSpace: "nowrap",
          }}
        >
          {rowActions.map((action) => {
            const isDisabled =
              action.disabled?.(row.original, row.index) ?? false;
            const isCompactAction = action.compact ?? true;
            const isIconOnlyAction =
              action.iconOnly ??
              (action.icon != null && isRowActionLabelEmpty(action.label));
            const actionTooltip = resolveRowActionTooltip(
              action,
              isIconOnlyAction,
            );
            const actionTooltipSize =
              action.tooltipSize ?? (isIconOnlyAction ? "xs" : undefined);
            const actionAriaLabel =
              isIconOnlyAction &&
              isRowActionLabelEmpty(action.label) &&
              typeof actionTooltip === "string"
                ? actionTooltip
                : undefined;

            return (
              <Button
                key={`${row.id}-${action.id}`}
                size={sizeToken.controlSize}
                variant={action.variant ?? "secondary"}
                compact={isCompactAction}
                iconOnly={isIconOnlyAction}
                iconOnlyTone={action.iconOnlyTone ?? isIconOnlyAction}
                iconColor={action.iconColor}
                tooltip={actionTooltip}
                tooltipSide={action.tooltipSide}
                tooltipSize={actionTooltipSize}
                tooltipDisabled={action.tooltipDisabled}
                tooltipOpenDelay={action.tooltipOpenDelay}
                tooltipCloseDelay={action.tooltipCloseDelay}
                aria-label={actionAriaLabel}
                disabled={isDisabled}
                onClick={(event) => {
                  event.stopPropagation();

                  onAction?.({
                    source: "row-action",
                    actionId: action.id,
                    row: row.original,
                    rowIndex: row.index,
                    event,
                  });

                  action.onClick(row.original, row.index);
                }}
              >
                {action.icon}
                {action.label}
              </Button>
            );
          })}
        </div>
      ),
      enableSorting: false,
      enableColumnFilter: false,
      enableHiding: false,
      size: 220,
    };
  }, [hasRowActions, onAction, rowActions, sizeToken.controlSize]);

  const tableColumns = useMemo<TableColumnDef<TData>[]>(() => {
    const nextColumns: TableColumnDef<TData>[] = [];

    if (selectionColumn != null) {
      nextColumns.push(selectionColumn);
    }

    nextColumns.push(...normalizedColumns);

    if (rowActionsColumn != null) {
      nextColumns.push(rowActionsColumn);
    }

    return nextColumns;
  }, [normalizedColumns, rowActionsColumn, selectionColumn]);

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
      { id: GLOBAL_FILTER_ID, value: normalizedSearch },
    ];
  }

  const table = useReactTable<TData>({
    data,
    columns: tableColumns,
    state: {
      sorting: sortingState,
      columnFilters: columnFilterState,
      globalFilter: canUseGlobalFilter ? globalSearch : undefined,
      rowSelection: rowSelectionState,
      columnVisibility: visibilityState,
      pagination: tablePaginationState,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableSorting: sortable,
    enableSortingRemoval: true,
    enableRowSelection: selectable,
    enableMultiRowSelection: multiSelect,
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
    onRowSelectionChange: (updater) => {
      setRowSelectionState((current) =>
        typeof updater === "function" ? updater(current) : updater,
      );
    },
    onColumnVisibilityChange: (updater) => {
      setVisibilityState((current) => {
        const next = typeof updater === "function" ? updater(current) : updater;

        const visibleColumnIds = tableColumns
          .map((column, index) => resolveColumnId(column, index))
          .filter((columnId) => next[columnId] !== false);

        onAction?.({
          source: "column-visibility",
          visibleColumnIds,
        });

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

  useEffect(() => {
    if (!selectable) {
      return;
    }

    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    onSelectionChange?.(selectedRows);
  }, [onSelectionChange, rowSelectionState, selectable, table]);

  const visibleColumns = table.getVisibleLeafColumns();
  const selectionCount = table.getSelectedRowModel().rows.length;

  const totalRowsCount = serverSide ? resolvedServerRowCount : filteredRowCount;
  const totalPages = serverSide ? serverPageCount : clientPageCount;
  const currentPage = serverSide
    ? currentServerPage
    : table.getState().pagination.pageIndex + 1;

  const togglableColumns = table
    .getAllLeafColumns()
    .filter(
      (column) =>
        column.getCanHide() &&
        column.id !== SPECIAL_SELECT_COLUMN_ID &&
        column.id !== SPECIAL_ACTIONS_COLUMN_ID,
    );

  const filterableColumns = table.getAllLeafColumns().filter((column) => {
    if (
      column.id === SPECIAL_SELECT_COLUMN_ID ||
      column.id === SPECIAL_ACTIONS_COLUMN_ID
    ) {
      return false;
    }

    if (!column.getCanFilter()) {
      return false;
    }

    if (columnFilters == null || columnFilters.length === 0) {
      return true;
    }

    return filterableColumnSet.has(column.id);
  });

  const firstFilterableColumnId = filterableColumns[0]?.id ?? "";

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

  function getInitialAdvancedFilterRules(): AdvancedFilterRule[] {
    const allowedColumnIds = new Set(
      filterableColumns.map((column) => column.id),
    );

    const nextRules = extractAdvancedFilterRules(columnFilterState).filter(
      (rule) => allowedColumnIds.has(rule.columnId),
    );

    if (nextRules.length > 0) {
      return nextRules;
    }

    if (firstFilterableColumnId === "") {
      return [];
    }

    return [createAdvancedFilterRule(firstFilterableColumnId)];
  }

  function handleAdvancedFilterDialogOpen(): void {
    if (!filterable || filterableColumns.length === 0) {
      return;
    }

    setAdvancedFilterDraftRules(getInitialAdvancedFilterRules());
    setAdvancedFilterDraftSearch(globalSearch);
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

  function handleAdvancedFilterRuleAdd(): void {
    if (firstFilterableColumnId === "") {
      return;
    }

    setAdvancedFilterDraftRules((current) => [
      ...current,
      createAdvancedFilterRule(firstFilterableColumnId),
    ]);
  }

  function handleAdvancedFilterRuleChange(
    ruleId: string,
    changes: Partial<Omit<AdvancedFilterRule, "id">>,
  ): void {
    setAdvancedFilterDraftRules((current) =>
      current.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              ...changes,
            }
          : rule,
      ),
    );
  }

  function handleAdvancedFilterRuleReset(ruleId: string): void {
    setAdvancedFilterDraftRules((current) => {
      if (current.length <= 1) {
        return current.map((rule) =>
          rule.id === ruleId
            ? {
                ...rule,
                operator: defaultAdvancedFilterOperator,
                value: "",
              }
            : rule,
        );
      }

      return current.filter((rule) => rule.id !== ruleId);
    });
  }

  function applyAdvancedFiltersFromDialog(): void {
    const nextColumnFilters = buildColumnFiltersFromAdvancedRules(
      advancedFilterDraftRules,
    );

    table.setColumnFilters(nextColumnFilters);

    if (canUseGlobalFilter) {
      table.setGlobalFilter(advancedFilterDraftSearch);
    }

    setIsFilterDialogOpen(false);

    onAction?.({
      source: "column-filters-apply",
      filters: buildExternalFilterState(
        nextColumnFilters,
        canUseGlobalFilter ? advancedFilterDraftSearch : globalSearch,
      ),
      search: canUseGlobalFilter ? advancedFilterDraftSearch : undefined,
    });
  }

  function clearAdvancedFilters(): void {
    const fallbackRules =
      firstFilterableColumnId === ""
        ? []
        : [createAdvancedFilterRule(firstFilterableColumnId)];

    setAdvancedFilterDraftRules(fallbackRules);
    setAdvancedFilterDraftSearch("");

    table.setColumnFilters([]);

    if (canUseGlobalFilter) {
      table.setGlobalFilter("");
    }

    onAction?.({
      source: "column-filters-clear",
      filters: [],
      search: "",
    });
  }

  const resolvedExportFormats = useMemo(() => {
    const requestedFormats =
      exportFormats.length > 0 ? exportFormats : [...DEFAULT_EXPORT_FORMATS];
    const nextFormats: TableExportFormat[] = [];

    requestedFormats.forEach((format) => {
      if (
        (format === "csv" || format === "xlsx" || format === "pdf") &&
        !nextFormats.includes(format)
      ) {
        const handler =
          exportHandlers?.[format] ?? defaultTableExportHandlers[format];

        if (handler != null) {
          nextFormats.push(format);
        }
      }
    });

    return nextFormats;
  }, [exportFormats, exportHandlers]);

  const canRenderExportControl =
    showExport && exportable && resolvedExportFormats.length > 0;

  const canShowToolbar =
    showToolbar &&
    (filterable ||
      showSearchInput ||
      (columnVisibility && showColumnToggle) ||
      showRefresh ||
      canRenderExportControl ||
      fullscreen ||
      selectionCount > 0);

  const exportRows = useMemo(() => {
    const rowsToExport = serverSide
      ? table.getRowModel().rows
      : table.getPrePaginationRowModel().rows;

    const exportableColumns = table
      .getVisibleLeafColumns()
      .filter(
        (column) =>
          column.id !== SPECIAL_SELECT_COLUMN_ID &&
          column.id !== SPECIAL_ACTIONS_COLUMN_ID,
      );

    const headers = exportableColumns.map((column) => toHeaderLabel(column));

    const records = rowsToExport.map((row) => {
      return exportableColumns.map((column) =>
        toCellText(row.getValue(column.id)),
      );
    });

    return {
      headers,
      records,
    };
  }, [serverSide, table]);

  async function handleExport(format: TableExportFormat): Promise<void> {
    if (
      !exportable ||
      exportRows.headers.length === 0 ||
      exportRows.records.length === 0
    ) {
      return;
    }

    const handler =
      exportHandlers?.[format] ?? defaultTableExportHandlers[format];

    if (handler == null) {
      return;
    }

    const trimmedFileName = exportFileName.trim();
    const fileNameBase =
      trimmedFileName === "" ? DEFAULT_EXPORT_FILE_NAME : trimmedFileName;

    setExportingFormat(format);

    try {
      await Promise.resolve(
        handler({
          rows: exportRows,
          fileNameBase,
        }),
      );
    } finally {
      setExportingFormat(null);
    }
  }

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

  const rootStyle: CSSProperties = {
    width: isFullscreenMode ? "auto" : "100%",
    maxWidth: "100%",
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0.45rem",
    boxSizing: "border-box",
    fontSize: sizeToken.tableFontSize,
    position: isFullscreenMode ? "fixed" : undefined,
    inset: isFullscreenMode ? "1rem" : undefined,
    zIndex: isFullscreenMode ? 220 : undefined,
    padding: isFullscreenMode ? "0.8rem" : undefined,
    backgroundColor: isFullscreenMode
      ? colorToken.rootBackgroundColor
      : undefined,
    borderRadius: isFullscreenMode
      ? "var(--ktn-radius-lg, 0.625rem)"
      : undefined,
    boxShadow: isFullscreenMode
      ? "0 28px 60px rgba(15, 23, 42, 0.28)"
      : undefined,
    overflow: isFullscreenMode ? "hidden" : undefined,
    minHeight: isFullscreenMode ? 0 : undefined,
    ...style,
  };

  const containerStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    backgroundColor: colorToken.rootBackgroundColor,
    border:
      bordered && resolvedVariant !== "ghost"
        ? `1px solid ${colorToken.borderColor}`
        : "1px solid transparent",
    borderRadius: rounded ? "var(--ktn-radius-lg, 0.625rem)" : 0,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    flex: isFullscreenMode ? 1 : undefined,
    minHeight: isFullscreenMode ? 0 : undefined,
  };

  const toolbarStyle: CSSProperties = {
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: sizeToken.toolbarGap,
    padding: "0.12rem 0",
  };

  const toolbarLeftStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: sizeToken.toolbarGap,
    minWidth: 0,
    maxWidth: "100%",
  };

  const toolbarRightStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "0.4rem",
    marginInlineStart: "auto",
    minWidth: 0,
    maxWidth: "100%",
  };

  const toolbarIconTriggerStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 0,
  };

  const compactDropdownContentStyle: CSSProperties = {
    width: "max-content",
    minWidth: "fit-content",
  };

  const searchWrapStyle: CSSProperties = {
    position: "relative",
    flex: "1 1 9rem",
    width: "100%",
    boxSizing: "border-box",
    minInlineSize: 0,
    inlineSize: "clamp(10rem, 28vw, 15rem)",
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
    color: colorToken.mutedTextColor,
    pointerEvents: "none",
    lineHeight: 0,
  };

  const selectedCountStyle: CSSProperties = {
    color: colorToken.mutedTextColor,
    fontSize: sizeToken.headerFontSize,
    margin: 0,
  };

  const tableViewportStyle: CSSProperties = {
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    overflow: "auto",
    backgroundColor: colorToken.rootBackgroundColor,
    flex: isFullscreenMode ? 1 : undefined,
    minHeight: isFullscreenMode ? 0 : undefined,
    maxHeight: stickyHeader
      ? isFullscreenMode
        ? "calc(100vh - 14rem)"
        : "34rem"
      : undefined,
  };

  const tableStyle: CSSProperties = {
    width: "100%",
    minWidth: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    tableLayout: "auto",
    fontSize: sizeToken.tableFontSize,
  };

  const tableHeaderCellStyle: CSSProperties = {
    padding: sizeToken.cellPadding,
    textAlign: "left",
    fontSize: sizeToken.headerFontSize,
    lineHeight: 1.2,
    letterSpacing: "0.01em",
    color: colorToken.headerTextColor,
    backgroundColor: colorToken.headerBackgroundColor,
    borderBottom:
      resolvedVariant === "ghost"
        ? undefined
        : `1px solid ${colorToken.rowBorderColor}`,
    position: stickyHeader ? "sticky" : undefined,
    top: stickyHeader ? "0px" : undefined,
    zIndex: stickyHeader ? 5 : undefined,
    whiteSpace: "nowrap",
  };

  const tableHeadStyle: CSSProperties = {
    position: stickyHeader ? "sticky" : undefined,
    top: stickyHeader ? "0px" : undefined,
    zIndex: stickyHeader ? 4 : undefined,
  };

  const tableBodyCellStyle: CSSProperties = {
    padding: sizeToken.cellPadding,
    textAlign: "left",
    color: colorToken.textColor,
    borderBottom:
      resolvedVariant === "ghost"
        ? undefined
        : `1px solid ${colorToken.rowBorderColor}`,
    verticalAlign: "middle",
  };

  const sortableHeaderContentStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    userSelect: "none",
  };

  const sortableHeaderButtonStyle: CSSProperties = {
    margin: 0,
    padding: 0,
    border: "none",
    background: "transparent",
    color: "inherit",
    font: "inherit",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
  };

  const sortIconWrapStyle: CSSProperties = {
    display: "inline-flex",
    flexDirection: "column",
    justifyContent: "center",
    lineHeight: 0,
    marginInlineStart: "0.08rem",
  };

  const emptyRowStyle: CSSProperties = {
    ...tableBodyCellStyle,
    textAlign: "center",
    color: colorToken.mutedTextColor,
    paddingBlock: "1.2rem",
  };

  const loadingRowStyle: CSSProperties = {
    ...tableBodyCellStyle,
    paddingBlock: "0.7rem",
  };

  const actionsColumnRightPadding = "0.72rem";

  const filterDialogBodyStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.72rem",
    minWidth: 0,
  };

  const filterDialogTopRowStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.5rem",
    flexWrap: "wrap",
  };

  const filterDialogRulesWrapStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  };

  const filterDialogRuleRowStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.15fr) minmax(0, 1.15fr) minmax(0, 1.8fr) auto",
    gap: "0.42rem",
    alignItems: "center",
    width: "100%",
    minWidth: 0,
  };

  const filterDialogSelectStyle: CSSProperties = {
    width: "100%",
    minWidth: 0,
    height: "2.05rem",
    border: `1px solid ${colorToken.borderColor}`,
    borderRadius: "var(--ktn-radius-sm, 0.375rem)",
    backgroundColor: "var(--ktn-bg-surface, #ffffff)",
    color: colorToken.textColor,
    fontSize: "0.83rem",
    paddingInline: "0.55rem",
    boxSizing: "border-box",
  };

  const filterDialogRuleHintStyle: CSSProperties = {
    margin: 0,
    fontSize: "0.76rem",
    color: colorToken.mutedTextColor,
  };

  const filterDialogFooterStyle: CSSProperties = {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.5rem",
    flexWrap: "wrap",
  };

  function renderSortIcon(column: Column<TData, unknown>): ReactNode {
    const state = column.getIsSorted();
    const iconSize = Math.max(10, sizeToken.iconSize - 1);

    const upOpacity = state === "asc" ? 1 : state === "desc" ? 0.38 : 0.62;
    const downOpacity = state === "desc" ? 1 : state === "asc" ? 0.38 : 0.62;

    const upColor =
      state === "asc" ? colorToken.headerTextColor : colorToken.mutedTextColor;
    const downColor =
      state === "desc" ? colorToken.headerTextColor : colorToken.mutedTextColor;

    return (
      <span style={sortIconWrapStyle} aria-hidden>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            color: upColor,
            opacity: upOpacity,
          }}
        >
          <FiChevronUp size={iconSize} />
        </span>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            marginTop: "-0.24rem",
            color: downColor,
            opacity: downOpacity,
          }}
        >
          <FiChevronDown size={iconSize} />
        </span>
      </span>
    );
  }

  const headerGroups = table.getHeaderGroups();
  const showAdvancedFilterTrigger = filterable && filterableColumns.length > 0;
  const filterTriggerLabel = isFilterDialogOpen
    ? hideFiltersLabel
    : totalActiveAdvancedFilters > 0
      ? `${showFiltersLabel} (${totalActiveAdvancedFilters} active)`
      : showFiltersLabel;

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
                  <FiSearch size={sizeToken.iconSize} />
                </span>

                <Input
                  size={sizeToken.controlSize}
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

            {selectable && selectionCount > 0 ? (
              <p style={selectedCountStyle}>
                {selectedCountFormatter(selectionCount)}
              </p>
            ) : null}
          </div>

          <div style={toolbarRightStyle}>
            {showAdvancedFilterTrigger ? (
              <Button
                size={sizeToken.controlSize}
                variant={
                  isFilterDialogOpen || totalActiveAdvancedFilters > 0
                    ? "primary"
                    : "outline"
                }
                iconOnly
                tooltip={filterTriggerLabel}
                tooltipSide="top"
                tooltipSize="xs"
                aria-label={filterTriggerLabel}
                onClick={() => {
                  handleAdvancedFilterDialogOpen();
                }}
              >
                <FiFilter size={sizeToken.iconSize} />
              </Button>
            ) : null}

            {fullscreen ? (
              <Button
                size={sizeToken.controlSize}
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

                    onAction?.({
                      source: "fullscreen",
                      fullscreen: next,
                    });

                    return next;
                  });
                }}
              >
                {isFullscreenActive ? (
                  <FiMinimize2 size={sizeToken.iconSize} />
                ) : (
                  <FiMaximize2 size={sizeToken.iconSize} />
                )}
              </Button>
            ) : null}

            {columnVisibility &&
            showColumnToggle &&
            togglableColumns.length > 0 ? (
              <DropdownMenu size={sizeToken.controlSize}>
                <DropdownMenuTrigger>
                  <Tooltip label={columnsLabel} side="top" size="xs">
                    <span style={toolbarIconTriggerStyle}>
                      <FiColumns size={sizeToken.iconSize} />
                    </span>
                  </Tooltip>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  style={compactDropdownContentStyle}
                >
                  <DropdownMenuLabel>{toggleColumnsLabel}</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {togglableColumns.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(checked) => {
                        column.toggleVisibility(checked);
                      }}
                    >
                      {toHeaderLabel(column)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}

            {showRefresh ? (
              <Button
                size={sizeToken.controlSize}
                variant="outline"
                iconOnly
                tooltip={isRefreshing ? `${refreshingLabel}...` : refreshLabel}
                tooltipSide="top"
                tooltipSize="xs"
                aria-label={isRefreshing ? refreshingLabel : refreshLabel}
                disabled={loading || isRefreshing}
                onClick={(event) => {
                  onAction?.({
                    source: "refresh",
                    event,
                  });

                  void handleRefresh();
                }}
              >
                <FiRefreshCw size={sizeToken.iconSize} />
              </Button>
            ) : null}

            {canRenderExportControl ? (
              <DropdownMenu size={sizeToken.controlSize}>
                <DropdownMenuTrigger
                  disabled={loading || exportingFormat != null}
                >
                  <Tooltip
                    label={
                      exportingFormat == null
                        ? downloadLabel
                        : exportingLabelFormatter(exportingFormat)
                    }
                    side="top"
                    size="xs"
                    disabled={loading || exportingFormat != null}
                  >
                    <span style={toolbarIconTriggerStyle}>
                      <FiDownload size={sizeToken.iconSize} />
                    </span>
                  </Tooltip>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  style={compactDropdownContentStyle}
                >
                  <DropdownMenuLabel>{exportFormatLabel}</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {resolvedExportFormats.map((format) => (
                    <DropdownMenuItem
                      key={format}
                      onSelect={() => {
                        onAction?.({
                          source: "export",
                          exportFormat: format,
                        });

                        void handleExport(format);
                      }}
                    >
                      {format.toUpperCase()}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>
      ) : null}

      <div style={containerStyle}>
        <div style={tableViewportStyle}>
          <table
            style={tableStyle}
            aria-busy={loading || undefined}
            aria-rowcount={totalRowsCount}
          >
            <thead style={tableHeadStyle}>
              {headerGroups.map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = sortable && header.column.getCanSort();
                    const sortIcon = canSort
                      ? renderSortIcon(header.column)
                      : null;
                    const sortState = header.column.getIsSorted();
                    const sortAriaState =
                      canSort && sortState === "asc"
                        ? "ascending"
                        : canSort && sortState === "desc"
                          ? "descending"
                          : canSort
                            ? "none"
                            : undefined;
                    const columnLabel = toHeaderLabel(header.column);

                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        scope="col"
                        aria-sort={sortAriaState}
                        style={{
                          ...tableHeaderCellStyle,
                          paddingInlineEnd:
                            header.column.id === SPECIAL_ACTIONS_COLUMN_ID
                              ? actionsColumnRightPadding
                              : undefined,
                          width:
                            header.column.id === SPECIAL_SELECT_COLUMN_ID
                              ? "2.4rem"
                              : header.column.id === SPECIAL_ACTIONS_COLUMN_ID
                                ? "1%"
                                : undefined,
                        }}
                      >
                        {header.isPlaceholder ? null : canSort ? (
                          <button
                            type="button"
                            style={sortableHeaderButtonStyle}
                            onClick={() => {
                              header.column.toggleSorting();
                            }}
                            aria-label={
                              sortState === "asc"
                                ? `Sort ${columnLabel} descending`
                                : sortState === "desc"
                                  ? `Clear sorting for ${columnLabel}`
                                  : `Sort ${columnLabel} ascending`
                            }
                          >
                            <span style={sortableHeaderContentStyle}>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                              {sortIcon}
                            </span>
                          </button>
                        ) : (
                          <span style={sortableHeaderContentStyle}>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </span>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            <tbody>
              {loading ? (
                skeleton ? (
                  Array.from(
                    { length: Math.max(1, loadingRows) },
                    (_, rowIndex) => (
                      <tr key={`loading-skeleton-${rowIndex}`}>
                        {visibleColumns.map((column) => (
                          <td
                            key={`loading-skeleton-${rowIndex}-${column.id}`}
                            style={{
                              ...loadingRowStyle,
                              paddingInlineEnd:
                                column.id === SPECIAL_ACTIONS_COLUMN_ID
                                  ? actionsColumnRightPadding
                                  : undefined,
                            }}
                          >
                            <Skeleton
                              width="100%"
                              height={
                                size === "xs"
                                  ? "0.7rem"
                                  : size === "lg"
                                    ? "0.95rem"
                                    : "0.82rem"
                              }
                              radius="full"
                            />
                          </td>
                        ))}
                      </tr>
                    ),
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={Math.max(1, visibleColumns.length)}
                      style={emptyRowStyle}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <Spinner size={sizeToken.controlSize} />
                        {loadingText}
                      </span>
                    </td>
                  </tr>
                )
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={Math.max(1, visibleColumns.length)}
                    style={emptyRowStyle}
                  >
                    {emptyText}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => {
                  const isHovered = hoveredRowId === row.id;
                  const isRowSelected = row.getIsSelected();

                  return (
                    <tr
                      key={row.id}
                      aria-selected={selectable ? isRowSelected : undefined}
                      style={{
                        backgroundColor: isRowSelected
                          ? "color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 16%, transparent)"
                          : isHovered && hoverable
                            ? colorToken.hoverRowColor
                            : shouldStriped && row.index % 2 === 1
                              ? colorToken.stripedRowColor
                              : "transparent",
                        transition: "background-color 100ms ease",
                      }}
                      onMouseEnter={() => {
                        if (hoverable) {
                          setHoveredRowId(row.id);
                        }
                      }}
                      onMouseLeave={() => {
                        if (hoverable) {
                          setHoveredRowId((current) =>
                            current === row.id ? null : current,
                          );
                        }
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          style={{
                            ...tableBodyCellStyle,
                            paddingInlineEnd:
                              cell.column.id === SPECIAL_ACTIONS_COLUMN_ID
                                ? actionsColumnRightPadding
                                : undefined,
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAdvancedFilterTrigger ? (
        <Dialog
          open={isFilterDialogOpen}
          onOpenChange={handleAdvancedFilterDialogOpenChange}
          variant="outline"
          size="lg"
          closeOnEscape
          closeOnOverlayClick
        >
          <DialogContent
            scrollable
            maxContentHeight="min(86vh, 38rem)"
            style={{ width: "min(100%, 56rem)", maxWidth: "56rem" }}
          >
            <DialogHeader>
              <DialogTitle>{filterDialogTitle}</DialogTitle>
              <DialogDescription>{filterDialogDescription}</DialogDescription>
            </DialogHeader>

            <div style={filterDialogBodyStyle}>
              {canUseGlobalFilter ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.32rem",
                  }}
                >
                  <label
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      color: colorToken.textColor,
                    }}
                  >
                    {globalFilterLabel}
                  </label>
                  <Input
                    size={sizeToken.controlSize}
                    value={advancedFilterDraftSearch}
                    placeholder={globalFilterPlaceholder}
                    aria-label={globalFilterLabel}
                    onChange={(event) => {
                      setAdvancedFilterDraftSearch(event.currentTarget.value);
                    }}
                  />

                  <p style={filterDialogRuleHintStyle}>
                    Applies across all visible table columns.
                  </p>
                </div>
              ) : null}

              <div style={filterDialogTopRowStyle}>
                <strong
                  style={{
                    fontSize: "0.84rem",
                    color: colorToken.textColor,
                  }}
                >
                  Column rules
                </strong>

                <Button
                  size={sizeToken.controlSize}
                  variant="outline"
                  onClick={() => {
                    handleAdvancedFilterRuleAdd();
                  }}
                >
                  + {addFilterLabel}
                </Button>
              </div>

              <div style={filterDialogRulesWrapStyle}>
                {advancedFilterDraftRules.map((rule, index) => (
                  <div key={rule.id} style={filterDialogRuleRowStyle}>
                    <select
                      value={rule.columnId}
                      aria-label={`Filter column ${index + 1}`}
                      style={filterDialogSelectStyle}
                      onChange={(event) => {
                        handleAdvancedFilterRuleChange(rule.id, {
                          columnId: event.currentTarget.value,
                        });
                      }}
                    >
                      {filterableColumns.map((column) => (
                        <option key={column.id} value={column.id}>
                          {toHeaderLabel(column)}
                        </option>
                      ))}
                    </select>

                    <select
                      value={rule.operator}
                      aria-label={`Filter operator ${index + 1}`}
                      style={filterDialogSelectStyle}
                      onChange={(event) => {
                        handleAdvancedFilterRuleChange(rule.id, {
                          operator: event.currentTarget
                            .value as AdvancedFilterOperator,
                        });
                      }}
                    >
                      {advancedFilterOperatorOptions.map((operator) => (
                        <option key={operator.value} value={operator.value}>
                          {operator.label}
                        </option>
                      ))}
                    </select>

                    <Input
                      size={sizeToken.controlSize}
                      value={rule.value}
                      placeholder="Enter value"
                      aria-label={`Filter value ${index + 1}`}
                      onChange={(event) => {
                        handleAdvancedFilterRuleChange(rule.id, {
                          value: event.currentTarget.value,
                        });
                      }}
                    />

                    <Button
                      size={sizeToken.controlSize}
                      variant="ghost"
                      iconOnly
                      iconOnlyTone
                      tooltip="Reset this filter"
                      tooltipSide="top"
                      tooltipSize="xs"
                      aria-label={`Reset filter ${index + 1}`}
                      onAction={() => {
                        handleAdvancedFilterRuleReset(rule.id);
                      }}
                    >
                      <FiX size={sizeToken.iconSize} />
                    </Button>
                  </div>
                ))}

                {advancedFilterDraftRules.length === 0 ? (
                  <p style={filterDialogRuleHintStyle}>
                    Add a filter row to start applying per-column rules.
                  </p>
                ) : null}
              </div>
            </div>

            <DialogFooter style={filterDialogFooterStyle} sticky>
              <Button
                size={sizeToken.controlSize}
                variant="outline"
                onAction={() => {
                  clearAdvancedFilters();
                }}
              >
                {clearFiltersLabel}
              </Button>

              <Button
                size={sizeToken.controlSize}
                variant="primary"
                onAction={() => {
                  applyAdvancedFiltersFromDialog();
                }}
              >
                {applyFiltersLabel}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}

      {showPagination ? (
        <Pagination
          variant={paginationVariant}
          size={sizeToken.paginationSize}
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
          fontSize: sizeToken.headerFontSize,
          color: colorToken.mutedTextColor,
        }}
      >
        {`${totalRowsCount} total rows`}
      </p>
    </div>
  );
}
