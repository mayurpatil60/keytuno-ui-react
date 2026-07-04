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
import { FiChevronDown, FiChevronUp } from "./icons/feather";

import { Button, type ButtonProps } from "./Button";
import {
  type AdvanceFilterColumn,
  type AdvanceFilterResult,
} from "./AdvanceFilter";
import { DataToolbar } from "./DataToolbar";
import {
  Pagination,
  type PaginationActionContext,
  type PaginationProps,
  type PaginationSize,
} from "./Pagination";
import { Scrollbar } from "./Scrollbar";
import { Skeleton } from "./Skeleton";
import { Spinner } from "./Spinner";

export type TableVariant =
  | "basic"
  | "outline"
  | "ghost"
  | "filled"
  | "minimal"
  | "striped";
export type TableSize = "xs" | "sm" | "md" | "lg";
export type TableActionSource =
  | "search"
  | "sort"
  | "sort-reset"
  | "filter"
  | "selection"
  | "column-visibility"
  | "column-filters-toggle"
  | "column-filters-apply"
  | "column-filters-clear"
  | "refresh"
  | "view-switch"
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
  fullscreen?: boolean;
  showColumnFilters?: boolean;
  event?: unknown;
}

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
  showViewSwitch?: boolean;
  switchToCardViewLabel?: string;
  onSwitchToCardView?: () => void;
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
  refreshLabel?: string;
  refreshingLabel?: string;
  fullscreenLabel?: string;
  resetScreenLabel?: string;
  showRefresh?: boolean;
  onRefresh?: () => void | Promise<void>;

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
const DEFAULT_PAGE_SIZE = 12;
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
  showViewSwitch = false,
  switchToCardViewLabel = "Cards",
  onSwitchToCardView,
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
  refreshLabel = "Refresh",
  refreshingLabel = "Refreshing",
  fullscreenLabel = "Fullscreen",
  resetScreenLabel = "Reset",
  showRefresh = false,
  onRefresh,
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
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [isAdvanceFilterOpen, setIsAdvanceFilterOpen] = useState(false);
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

  const advanceFilterColumns = useMemo<AdvanceFilterColumn[]>(() => {
    return table
      .getAllLeafColumns()
      .filter(
        (column) =>
          column.id !== SPECIAL_SELECT_COLUMN_ID &&
          column.id !== SPECIAL_ACTIONS_COLUMN_ID,
      )
      .map((column) => {
        const canFilterColumn =
          filterable &&
          (columnFilters == null ||
            columnFilters.length === 0 ||
            filterableColumnSet.has(column.id));

        return {
          id: column.id,
          label: toHeaderLabel(column),
          canFilter: canFilterColumn && column.getCanFilter(),
          canSort: sortable && column.getCanSort(),
        };
      });
  }, [columnFilters, filterable, filterableColumnSet, sortable, table]);

  function handleAdvanceFilterOpenChange(nextOpen: boolean): void {
    setIsAdvanceFilterOpen(nextOpen);

    onAction?.({
      source: "column-filters-toggle",
      showColumnFilters: nextOpen,
    });
  }

  function handleAdvanceFilterApply(
    result: AdvanceFilterResult,
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

  const canShowViewSwitch = showViewSwitch && onSwitchToCardView != null;

  const canShowToolbar =
    showToolbar &&
    (showAdvancedFilterTrigger ||
      showSearchInput ||
      showRefresh ||
      canShowViewSwitch ||
      fullscreen);

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
    paddingInline: 0,
    paddingBlock: 0,
    minWidth: 0,
    height: "auto",
    border: "none",
    borderWidth: 0,
    background: "transparent",
    backgroundColor: "transparent",
    color: "inherit",
    font: "inherit",
    fontWeight: "inherit",
    lineHeight: "inherit",
    borderRadius: 0,
    boxShadow: "none",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 0,
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

  return (
    <div
      className={`${baseClasses} ${className}`.trim()}
      style={rootStyle}
      {...props}
    >
      {canShowToolbar ? (
        <DataToolbar
          size={sizeToken.controlSize}
          showSearch={showSearchInput}
          searchValue={globalSearch}
          searchPlaceholder={searchPlaceholder}
          searchAriaLabel={searchAriaLabel}
          onSearchChange={(nextSearch) => {
            table.setGlobalFilter(nextSearch);
          }}
          showAdvanceFilter={showAdvancedFilterTrigger}
          advanceFilterColumns={advanceFilterColumns}
          advanceFilterColumnFilters={columnFilterState}
          advanceFilterSorting={sortingState}
          advanceFilterGlobalSearch={globalSearch}
          advanceFilterCanUseGlobalFilter={canUseGlobalFilter}
          advanceFilterEnableSorting={sortable}
          advanceFilterOpen={isAdvanceFilterOpen}
          onAdvanceFilterOpenChange={handleAdvanceFilterOpenChange}
          onAdvanceFilterApply={handleAdvanceFilterApply}
          advanceFilterOpenLabel={showFiltersLabel}
          advanceFilterCloseLabel={hideFiltersLabel}
          advanceFilterActiveCount={totalActiveAdvancedFilters}
          advanceFilterTitle={filterDialogTitle}
          advanceFilterDescription={filterDialogDescription}
          addFilterLabel={addFilterLabel}
          addSortLabel={addSortLabel}
          clearFiltersLabel={clearFiltersLabel}
          resetSortingLabel={resetSortingLabel}
          applyFiltersLabel={applyFiltersLabel}
          globalFilterLabel={globalFilterLabel}
          globalFilterPlaceholder={globalFilterPlaceholder}
          showSwitch={canShowViewSwitch}
          switchMode="adaptive-card"
          switchLabel={switchToCardViewLabel}
          onSwitch={() => {
            onAction?.({
              source: "view-switch",
              actionId: "adaptive-card",
            });

            onSwitchToCardView?.();
          }}
          showRefresh={showRefresh}
          refreshing={loading || isRefreshing}
          refreshLabel={refreshLabel}
          refreshingLabel={refreshingLabel}
          onRefresh={() => {
            onAction?.({
              source: "refresh",
            });

            return handleRefresh();
          }}
          showFullscreen={fullscreen}
          fullscreen={isFullscreenActive}
          fullscreenLabel={fullscreenLabel}
          exitFullscreenLabel={resetScreenLabel}
          onFullscreenChange={(nextFullscreen) => {
            setIsFullscreenActive(nextFullscreen);

            onAction?.({
              source: "fullscreen",
              fullscreen: nextFullscreen,
            });
          }}
        />
      ) : null}

      <div style={containerStyle}>
        <Scrollbar
          axis="both"
          style={tableViewportStyle}
          aria-label="Table viewport"
        >
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
                          <Button
                            size={sizeToken.controlSize}
                            variant="ghost"
                            compact
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
                          </Button>
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
        </Scrollbar>
      </div>

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
