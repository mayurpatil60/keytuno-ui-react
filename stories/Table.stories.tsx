import { useMemo, useState, type CSSProperties } from "react";

import type { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import type { Meta, StoryObj } from "@storybook/react";
import { FiEdit3, FiEye, FiTrash2 } from "../src/components/icons/feather";

import {
  AdaptiveCard,
  DataToolbar,
  Table,
  type AdaptiveCardAction,
  type AdaptiveCardFieldSchema,
  type AdvanceFilterColumn,
  type RowAction,
  type TableColumnDef,
  type TableProps,
} from "../src/index";

interface TradeRow {
  id: string;
  symbol: string;
  sector: string;
  status: "Open" | "Paused" | "Closed";
  owner: string;
  price: number;
  change: number;
  volume: number;
  updatedAt: string;
}

type ComposedView = "table" | "adaptive-card";
type NumericFilterOperator = "gt" | "gte" | "lt" | "lte" | "eq" | "neq";

interface ParsedNumericFilterCondition {
  operator: NumericFilterOperator;
  value: number;
}

const sectors = ["Banking", "IT", "Energy", "Pharma", "Auto"];
const owners = ["Mayur", "Anaya", "Vivaan", "Aditi", "Ishaan"];
const statuses: TradeRow["status"][] = ["Open", "Paused", "Closed"];

const tradeRows: TradeRow[] = Array.from({ length: 180 }, (_, index) => {
  const seed = index + 1;

  return {
    id: `TRD-${String(seed).padStart(4, "0")}`,
    symbol: `STK${String(100 + seed)}`,
    sector: sectors[index % sectors.length] ?? "Banking",
    status: statuses[index % statuses.length] ?? "Open",
    owner: owners[index % owners.length] ?? "Mayur",
    price: 120 + ((seed * 19) % 1450),
    change: ((seed % 2 === 0 ? 1 : -1) * ((seed * 13) % 110)) / 10,
    volume: 1400 + ((seed * 7027) % 98000),
    updatedAt: `2026-07-${String((seed % 28) + 1).padStart(2, "0")}`,
  };
});

const tableColumns: TableColumnDef<TradeRow>[] = [
  {
    accessorKey: "symbol",
    header: "Symbol",
  },
  {
    accessorKey: "sector",
    header: "Sector",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "owner",
    header: "Owner",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ getValue }) => {
      const value = Number(getValue() ?? 0);
      return `Rs ${value.toFixed(2)}`;
    },
  },
  {
    accessorKey: "change",
    header: "Change %",
    cell: ({ getValue }) => {
      const value = Number(getValue() ?? 0);
      const color =
        value > 0
          ? "var(--ktn-action-success-bg, #16a34a)"
          : value < 0
            ? "var(--ktn-action-danger-bg, #dc2626)"
            : "var(--ktn-text-secondary, var(--ktn-text-primary))";

      return (
        <span
          style={{ color }}
        >{`${value > 0 ? "+" : ""}${value.toFixed(2)}%`}</span>
      );
    },
  },
  {
    accessorKey: "volume",
    header: "Volume",
    cell: ({ getValue }) => Number(getValue() ?? 0).toLocaleString("en-IN"),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
  },
];

const tableRowActions: RowAction<TradeRow>[] = [
  {
    id: "view",
    label: "",
    icon: <FiEye size={13} />,
    iconOnly: true,
    iconOnlyTone: true,
    compact: true,
    tooltip: "View",
    onClick: () => {},
  },
  {
    id: "edit",
    label: "",
    icon: <FiEdit3 size={13} />,
    iconOnly: true,
    iconOnlyTone: true,
    compact: true,
    tooltip: "Edit",
    onClick: () => {},
  },
  {
    id: "delete",
    label: "",
    icon: <FiTrash2 size={13} />,
    iconOnly: true,
    iconOnlyTone: true,
    compact: true,
    tooltip: "Delete",
    variant: "destructive",
    onClick: () => {},
  },
];

const adaptiveSchema: AdaptiveCardFieldSchema<TradeRow>[] = [
  { key: "symbol", label: "Symbol", priority: 0 },
  {
    key: "status",
    label: "Status",
    type: "status",
    align: "right",
    priority: 1,
  },
  { key: "sector", label: "Sector", priority: 2 },
  { key: "owner", label: "Owner", priority: 3 },
  {
    key: "price",
    label: "Price",
    type: "currency",
    currency: "INR",
    align: "right",
    maximumFractionDigits: 2,
    priority: 4,
  },
  {
    key: "change",
    label: "Change",
    type: "percent",
    align: "right",
    maximumFractionDigits: 2,
    priority: 5,
  },
  {
    key: "volume",
    label: "Volume",
    type: "number",
    align: "right",
    priority: 6,
  },
  {
    key: "updatedAt",
    label: "Updated",
    type: "date",
    dateOptions: { year: "numeric", month: "short", day: "numeric" },
    priority: 7,
  },
];

const adaptiveActions: AdaptiveCardAction<TradeRow>[] = [
  { id: "view", label: "View", icon: <FiEye size={13} /> },
  {
    id: "edit",
    label: "Edit",
    icon: <FiEdit3 size={13} />,
    variant: "outline",
  },
  {
    id: "delete",
    label: "Delete",
    icon: <FiTrash2 size={13} />,
    variant: "destructive",
  },
];

const toolbarColumns: AdvanceFilterColumn[] = [
  { id: "symbol", label: "Symbol", canFilter: true, canSort: true },
  { id: "sector", label: "Sector", canFilter: true, canSort: true },
  { id: "status", label: "Status", canFilter: true, canSort: true },
  { id: "owner", label: "Owner", canFilter: true, canSort: true },
  { id: "price", label: "Price", canFilter: true, canSort: true },
  { id: "change", label: "Change", canFilter: true, canSort: true },
  { id: "volume", label: "Volume", canFilter: true, canSort: true },
  { id: "updatedAt", label: "Updated", canFilter: true, canSort: true },
];

const shellStyle: CSSProperties = {
  width: "100%",
  maxWidth: "1200px",
  minWidth: 0,
  marginInline: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "0.85rem",
  boxSizing: "border-box",
};

function toFullscreenSurfaceStyle(enabled: boolean): CSSProperties {
  if (!enabled) {
    return shellStyle;
  }

  return {
    ...shellStyle,
    position: "fixed",
    inset: "0.75rem",
    zIndex: 250,
    padding: "0.8rem",
    borderRadius: "0.75rem",
    backgroundColor: "var(--ktn-bg-surface, #ffffff)",
    boxShadow: "0 26px 52px rgba(15, 23, 42, 0.26)",
  };
}

function splitFilterTerms(filterValue: unknown): string[] {
  if (typeof filterValue !== "string") {
    return [];
  }

  return filterValue
    .split(",")
    .map((term) => term.trim())
    .filter((term) => term !== "");
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

function parseNumericFilterCondition(
  term: string,
): ParsedNumericFilterCondition | null {
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

    if (!Number.isFinite(numericValue)) {
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

  if (!/^-?(?:\d+(?:\.\d+)?|\.\d+)$/.test(normalizedTerm)) {
    return null;
  }

  const numericValue = Number.parseFloat(normalizedTerm);

  if (!Number.isFinite(numericValue)) {
    return null;
  }

  return { operator: "eq", value: numericValue };
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

function matchesNumericCondition(
  value: number,
  condition: ParsedNumericFilterCondition,
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

function matchesAdvancedFilter(
  rowValue: unknown,
  filterValue: unknown,
): boolean {
  const terms = splitFilterTerms(filterValue);

  if (terms.length === 0) {
    return true;
  }

  const numericValue = toFiniteNumber(rowValue);
  const stringValue = String(rowValue ?? "");

  return terms.some((term) => {
    const numericCondition = parseNumericFilterCondition(term);

    if (numericCondition != null) {
      if (numericValue == null) {
        return false;
      }

      return matchesNumericCondition(numericValue, numericCondition);
    }

    return matchesStringCondition(stringValue, term);
  });
}

function applyAdvancedFilters(
  rows: TradeRow[],
  filters: ColumnFiltersState,
  globalSearch: string,
): TradeRow[] {
  const normalizedSearch = globalSearch.trim().toLowerCase();

  return rows.filter((row) => {
    if (normalizedSearch !== "") {
      const searchableText = Object.values(row)
        .map((value) => String(value).toLowerCase())
        .join(" ");

      if (!searchableText.includes(normalizedSearch)) {
        return false;
      }
    }

    return filters.every((filter) => {
      const rowValue = row[filter.id as keyof TradeRow];
      return matchesAdvancedFilter(rowValue, filter.value);
    });
  });
}

function applySorting(rows: TradeRow[], sorting: SortingState): TradeRow[] {
  if (sorting.length === 0) {
    return rows;
  }

  const [firstSort] = sorting;

  if (firstSort == null) {
    return rows;
  }

  return [...rows].sort((leftRow, rightRow) => {
    const left = leftRow[firstSort.id as keyof TradeRow];
    const right = rightRow[firstSort.id as keyof TradeRow];

    if (typeof left === "number" && typeof right === "number") {
      return firstSort.desc ? right - left : left - right;
    }

    const leftText = String(left ?? "").toLowerCase();
    const rightText = String(right ?? "").toLowerCase();

    if (leftText === rightText) {
      return 0;
    }

    return firstSort.desc
      ? leftText < rightText
        ? 1
        : -1
      : leftText < rightText
        ? -1
        : 1;
  });
}

const meta: Meta<TableProps<TradeRow>> = {
  title: "Data/Table",
  component: Table as unknown as Meta<TableProps<TradeRow>>["component"],
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<TableProps<TradeRow>>;

export const Basic: Story = {
  render: () => (
    <div style={shellStyle}>
      <Table
        data={tradeRows.slice(0, 24)}
        columns={tableColumns}
        rowActions={tableRowActions}
        variant="basic"
        size="md"
        sortable
        filterable
        searchable
        showToolbar={false}
        showPagination
        hoverable
        bordered
        rounded
      />
    </div>
  ),
};

function ToolbarComposedView(args: Partial<TableProps<TradeRow>>): JSX.Element {
  const [view, setView] = useState<ComposedView>("table");
  const [searchValue, setSearchValue] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [fullscreen, setFullscreen] = useState(false);

  const filteredRows = useMemo(
    () => applyAdvancedFilters(tradeRows, columnFilters, searchValue),
    [columnFilters, searchValue],
  );
  const resolvedRows = useMemo(
    () => applySorting(filteredRows, sorting),
    [filteredRows, sorting],
  );

  const switchMode: DataToolbarSwitchMode =
    view === "table" ? "adaptive-card" : "table";

  return (
    <div style={toFullscreenSurfaceStyle(fullscreen)}>
      <DataToolbar
        size="sm"
        showSearch
        searchValue={searchValue}
        searchPlaceholder="Search"
        searchAriaLabel="Search records"
        onSearchChange={setSearchValue}
        showAdvanceFilter
        advanceFilterColumns={toolbarColumns}
        advanceFilterColumnFilters={columnFilters}
        advanceFilterSorting={sorting}
        advanceFilterGlobalSearch={searchValue}
        advanceFilterCanUseGlobalFilter
        advanceFilterEnableSorting
        advanceFilterOpenLabel="Filter"
        advanceFilterCloseLabel="Close"
        advanceFilterTitle="Advance Filter"
        advanceFilterDescription="Configure filters and sorting"
        onAdvanceFilterApply={(result) => {
          setColumnFilters(result.columnFilters);
          setSorting(result.sorting);
          setSearchValue(result.globalSearch);
        }}
        showSwitch
        switchMode={switchMode}
        switchLabel={view === "table" ? "Cards" : "Table"}
        onSwitch={() => {
          setView((current) =>
            current === "table" ? "adaptive-card" : "table",
          );
        }}
        showRefresh
        refreshLabel="Refresh"
        refreshingLabel="Refreshing"
        onRefresh={async () => {
          await new Promise((resolve) => {
            setTimeout(resolve, 180);
          });
        }}
        showFullscreen
        fullscreen={fullscreen}
        fullscreenLabel="Fullscreen"
        exitFullscreenLabel="Exit"
        onFullscreenChange={setFullscreen}
      />

      {view === "table" ? (
        <Table
          data={resolvedRows}
          columns={tableColumns}
          rowActions={tableRowActions}
          variant={args.variant ?? "striped"}
          size={args.size ?? "sm"}
          compact={args.compact ?? true}
          hoverable={args.hoverable ?? true}
          bordered={args.bordered ?? true}
          rounded={args.rounded ?? true}
          showToolbar={false}
          sortable={false}
          filterable={false}
          searchable={false}
          showPagination
          paginationVariant={args.paginationVariant ?? "advance"}
          paginationDefaultPageSize={args.paginationDefaultPageSize ?? 10}
          paginationPageSizeOptions={
            args.paginationPageSizeOptions ?? [10, 20, 50]
          }
          paginationMaxVisiblePages={args.paginationMaxVisiblePages ?? 5}
          paginationShowPageSizeSelector={
            args.paginationShowPageSizeSelector ?? true
          }
          paginationShowSummary={args.paginationShowSummary ?? true}
          paginationShowShowingPage={args.paginationShowShowingPage ?? true}
          paginationResetPageOnPageSizeChange={
            args.paginationResetPageOnPageSizeChange ?? true
          }
        />
      ) : (
        <AdaptiveCard<TradeRow>
          data={resolvedRows}
          rowKey="id"
          schema={adaptiveSchema}
          actions={adaptiveActions}
          variant="default"
          size="sm"
          columns={{ mobile: 1, tablet: 1, web: 1 }}
          insideColumns={2}
          showToolbar={false}
          searchable={false}
          showPagination
          paginationVariant="advance"
          paginationDefaultPageSize={10}
          paginationPageSizeOptions={[10, 20, 50]}
          paginationMaxVisiblePages={5}
          paginationShowPageSizeSelector
          paginationShowSummary
          paginationShowShowingPage
          paginationResetPageOnPageSizeChange
          virtualized={false}
        />
      )}
    </div>
  );
}

export const ToolbarComposedSwitch: Story = {
  name: "Toolbar Composed Switch",
  args: {
    variant: "striped",
    size: "sm",
    compact: true,
    hoverable: true,
    bordered: true,
    rounded: true,
    paginationVariant: "advance",
    paginationDefaultPageSize: 10,
    paginationPageSizeOptions: [10, 20, 50],
    paginationMaxVisiblePages: 5,
    paginationShowPageSizeSelector: true,
    paginationShowSummary: true,
    paginationShowShowingPage: true,
    paginationResetPageOnPageSizeChange: true,
  },
  render: (args) => <ToolbarComposedView {...args} />,
};

const playgroundArgTypes = {
  variant: {
    control: "select",
    options: ["basic", "outline", "ghost", "filled", "minimal", "striped"],
  },
  size: {
    control: "select",
    options: ["xs", "sm", "md", "lg"],
  },
  compact: { control: "boolean" },
  hoverable: { control: "boolean" },
  bordered: { control: "boolean" },
  rounded: { control: "boolean" },
  paginationVariant: {
    control: "select",
    options: ["basic", "advance", "compact"],
  },
  paginationDefaultPageSize: {
    control: { type: "number", min: 1, max: 100, step: 1 },
  },
  paginationPageSizeOptions: { control: "object" },
  paginationMaxVisiblePages: {
    control: { type: "number", min: 3, max: 15, step: 1 },
  },
  paginationShowPageSizeSelector: { control: "boolean" },
  paginationShowSummary: { control: "boolean" },
  paginationShowShowingPage: { control: "boolean" },
  paginationResetPageOnPageSizeChange: { control: "boolean" },
  onAction: { action: "table-action" },
  data: { table: { disable: true } },
  columns: { table: { disable: true } },
  rowActions: { table: { disable: true } },
  showToolbar: { table: { disable: true } },
  searchable: { table: { disable: true } },
  filterable: { table: { disable: true } },
  sortable: { table: { disable: true } },
} satisfies NonNullable<Story["argTypes"]>;

export const TablePlayground: Story = {
  name: "Table Playground",
  args: {
    variant: "basic",
    size: "md",
    compact: false,
    hoverable: true,
    bordered: true,
    rounded: true,
    paginationVariant: "advance",
    paginationDefaultPageSize: 10,
    paginationPageSizeOptions: [10, 20, 50],
    paginationMaxVisiblePages: 5,
    paginationShowPageSizeSelector: true,
    paginationShowSummary: true,
    paginationShowShowingPage: true,
    paginationResetPageOnPageSizeChange: true,
  },
  argTypes: playgroundArgTypes,
  render: (args) => <ToolbarComposedView {...args} />,
};

