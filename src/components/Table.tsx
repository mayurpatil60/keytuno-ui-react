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
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { FiChevronDown, FiChevronUp } from "./icons/feather";

import { Button, type ButtonProps } from "./Button";
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
  | "sort"
  | "filter"
  | "selection"
  | "column-visibility"
  | "row-action";

export interface TableActionContext<TData extends object = object> {
  source: TableActionSource;
  sort?: SortingState;
  filters?: ColumnFiltersState;
  selectedRows?: TData[];
  visibleColumnIds?: string[];
  actionId?: string;
  row?: TData;
  rowIndex?: number;
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

  loading?: boolean;
  loadingRows?: number;
  loadingText?: ReactNode;
  skeleton?: boolean;

  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  rounded?: boolean;
  stickyHeader?: boolean;

  emptyText?: ReactNode;
}

type TableSizeTokens = {
  tableFontSize: string;
  headerFontSize: string;
  cellPadding: string;
  controlSize: "xs" | "sm" | "md" | "lg";
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
const DEFAULT_EMPTY_TEXT = "No records found.";

const sizeTokens: Record<TableSize, TableSizeTokens> = {
  xs: {
    tableFontSize: "0.75rem",
    headerFontSize: "0.7rem",
    cellPadding: "0.38rem 0.45rem",
    controlSize: "xs",
    iconSize: 12,
  },
  sm: {
    tableFontSize: "0.8125rem",
    headerFontSize: "0.74rem",
    cellPadding: "0.45rem 0.55rem",
    controlSize: "sm",
    iconSize: 13,
  },
  md: {
    tableFontSize: "0.875rem",
    headerFontSize: "0.78rem",
    cellPadding: "0.55rem 0.65rem",
    controlSize: "md",
    iconSize: 14,
  },
  lg: {
    tableFontSize: "0.9375rem",
    headerFontSize: "0.84rem",
    cellPadding: "0.65rem 0.8rem",
    controlSize: "lg",
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

function toCompactTableSize(size: TableSize): TableSize {
  if (size === "lg") {
    return "md";
  }

  if (size === "md") {
    return "sm";
  }

  if (size === "sm") {
    return "xs";
  }

  return "xs";
}

function resolveColumnId<TData extends object>(
  column: TableColumnDef<TData>,
  index: number,
): string {
  const columnCandidate = column as {
    id?: unknown;
    accessorKey?: unknown;
  };

  if (
    typeof columnCandidate.id === "string" &&
    columnCandidate.id.trim() !== ""
  ) {
    return columnCandidate.id;
  }

  if (
    typeof columnCandidate.accessorKey === "string" &&
    columnCandidate.accessorKey.trim() !== ""
  ) {
    return columnCandidate.accessorKey;
  }

  return `col_${index}`;
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
      return { operator: "gt", value: numericValue };
    }

    if (operatorToken === ">=") {
      return { operator: "gte", value: numericValue };
    }

    if (operatorToken === "<") {
      return { operator: "lt", value: numericValue };
    }

    if (operatorToken === "<=") {
      return { operator: "lte", value: numericValue };
    }

    if (operatorToken === "!=") {
      return { operator: "neq", value: numericValue };
    }

    return { operator: "eq", value: numericValue };
  }

  const bareNumberMatch = normalizedTerm.match(/^-?(?:\d+(?:\.\d+)?|\.\d+)$/);

  if (bareNumberMatch == null) {
    return null;
  }

  const numericValue = Number.parseFloat(normalizedTerm);

  if (Number.isNaN(numericValue) || !Number.isFinite(numericValue)) {
    return null;
  }

  return { operator: "eq", value: numericValue };
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

function matchesStringCondition(value: string, term: string): boolean {
  const normalizedValue = value.toLowerCase();
  const normalizedTerm = term.trim();

  if (normalizedTerm === "") {
    return true;
  }

  if (normalizedTerm.startsWith("!=")) {
    const expected = normalizedTerm.slice(2).trim().toLowerCase();
    return expected === "" ? true : normalizedValue !== expected;
  }

  if (normalizedTerm.startsWith("=")) {
    const expected = normalizedTerm.slice(1).trim().toLowerCase();
    return expected === "" ? true : normalizedValue === expected;
  }

  if (normalizedTerm.startsWith("^")) {
    const expected = normalizedTerm.slice(1).trim().toLowerCase();
    return expected === "" ? true : normalizedValue.startsWith(expected);
  }

  if (normalizedTerm.endsWith("$")) {
    const expected = normalizedTerm.slice(0, -1).trim().toLowerCase();
    return expected === "" ? true : normalizedValue.endsWith(expected);
  }

  if (normalizedTerm.startsWith("~")) {
    const expected = normalizedTerm.slice(1).trim().toLowerCase();
    return expected === "" ? true : normalizedValue.includes(expected);
  }

  return normalizedValue.includes(normalizedTerm.toLowerCase());
}

function matchesAdvancedColumnFilter(
  rowValue: unknown,
  filterValue: unknown,
): boolean {
  const terms = splitColumnFilterTerms(filterValue);

  if (terms.length === 0) {
    return true;
  }

  const stringValue = String(rowValue ?? "");
  const numericValue = Number.parseFloat(stringValue);
  const hasNumericValue = Number.isFinite(numericValue);

  return terms.some((term) => {
    const parsedNumeric = parseNumericFilterCondition(term);

    if (parsedNumeric != null) {
      if (!hasNumericValue) {
        return false;
      }

      return matchesNumericCondition(numericValue, parsedNumeric);
    }

    return matchesStringCondition(stringValue, term);
  });
}

function toHeaderLabel<TData extends object>(
  column: Column<TData, unknown>,
): string {
  const headerCandidate = column.columnDef.header;

  if (typeof headerCandidate === "string" && headerCandidate.trim() !== "") {
    return headerCandidate;
  }

  if (column.id.trim() !== "") {
    return column.id
      .replaceAll(/[._-]+/g, " ")
      .replaceAll(/\s+/g, " ")
      .trim()
      .replaceAll(/\b\w/g, (char) => char.toUpperCase());
  }

  return "Column";
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
  selectable = false,
  multiSelect = true,
  selectAllRowsAriaLabel = "Select all rows",
  selectRowAriaLabelFormatter = (rowNumber: number) =>
    `Select row ${rowNumber}`,
  selectedCountFormatter = (count: number) => `${count} selected`,
  onSelectionChange,
  onAction,
  rowActions,
  columnVisibility = false,
  defaultHiddenColumns,
  loading = false,
  loadingRows = 6,
  loadingText = "Loading table...",
  skeleton = true,
  striped,
  hoverable = true,
  bordered = true,
  rounded = true,
  stickyHeader = false,
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
  const hasRowActions = rowActions != null && rowActions.length > 0;

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
  const [rowSelectionState, setRowSelectionState] = useState<RowSelectionState>(
    {},
  );
  const [visibilityState, setVisibilityState] = useState<VisibilityState>(
    initialVisibilityState,
  );
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

  useEffect(() => {
    setVisibilityState(initialVisibilityState);
  }, [initialVisibilityState]);

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
            checked={table.getIsAllRowsSelected()}
            ref={(element) => {
              if (element != null) {
                element.indeterminate =
                  table.getIsSomeRowsSelected() &&
                  !table.getIsAllRowsSelected();
              }
            }}
            onChange={(event) => {
              table.toggleAllRowsSelected(event.currentTarget.checked);

              onAction?.({
                source: "selection",
                actionId: event.currentTarget.checked
                  ? "select-all"
                  : "clear-selection",
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
  }, [
    multiSelect,
    onAction,
    selectAllRowsAriaLabel,
    selectRowAriaLabelFormatter,
    selectable,
  ]);

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

  const table = useReactTable<TData>({
    data,
    columns: tableColumns,
    state: {
      sorting: sortingState,
      columnFilters: columnFilterState,
      rowSelection: rowSelectionState,
      columnVisibility: visibilityState,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSorting: sortable,
    enableSortingRemoval: true,
    enableRowSelection: selectable,
    enableMultiRowSelection: multiSelect,
    onSortingChange: (updater) => {
      setSortingState((current) => {
        const next = typeof updater === "function" ? updater(current) : updater;
        onAction?.({
          source: "sort",
          sort: next,
        });

        return next;
      });
    },
    onColumnFiltersChange: (updater) => {
      setColumnFilterState((current) => {
        const next = typeof updater === "function" ? updater(current) : updater;
        onAction?.({
          source: "filter",
          filters: next,
        });

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
  const totalRowsCount = filteredRowCount;

  const rootStyle: CSSProperties = {
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0.45rem",
    boxSizing: "border-box",
    fontSize: sizeToken.tableFontSize,
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
  };

  const tableViewportStyle: CSSProperties = {
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    overflow: "auto",
    backgroundColor: colorToken.rootBackgroundColor,
    maxHeight: stickyHeader ? "34rem" : undefined,
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
                                resolvedSize === "xs"
                                  ? "0.7rem"
                                  : resolvedSize === "lg"
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

      {selectable && selectionCount > 0 ? (
        <p
          style={{
            margin: 0,
            fontSize: sizeToken.headerFontSize,
            color: colorToken.mutedTextColor,
          }}
        >
          {selectedCountFormatter(selectionCount)}
        </p>
      ) : null}
    </div>
  );
}
