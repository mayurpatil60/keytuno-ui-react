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
  type AdaptiveCardProps,
  type AdvanceFilterColumn,
  type TableColumnDef,
} from "../src/index";

interface PortfolioRow {
  id: string;
  symbol: string;
  desk: string;
  owner: string;
  status: "Open" | "Review" | "Closed";
  price: number;
  change: number;
  exposure: number;
  updatedAt: string;
}

type ViewMode = "adaptive-card" | "table";
type NumericFilterOperator = "gt" | "gte" | "lt" | "lte" | "eq" | "neq";

interface ParsedNumericFilterCondition {
  operator: NumericFilterOperator;
  value: number;
}

const desks = ["Derivatives", "Cash", "Arbitrage", "Commodities"];
const owners = ["Mayur", "Anaya", "Vivaan", "Aditi", "Ishaan"];
const statuses: PortfolioRow["status"][] = ["Open", "Review", "Closed"];

const portfolioRows: PortfolioRow[] = Array.from(
  { length: 220 },
  (_, index) => {
    const seed = index + 1;

    return {
      id: `ADP-${String(seed).padStart(4, "0")}`,
      symbol: `STK${String(100 + seed)}`,
      desk: desks[index % desks.length] ?? "Derivatives",
      owner: owners[index % owners.length] ?? "Mayur",
      status: statuses[index % statuses.length] ?? "Open",
      price: 130 + ((seed * 23) % 1620),
      change: ((seed % 2 === 0 ? 1 : -1) * ((seed * 11) % 130)) / 10,
      exposure: 75000 + ((seed * 8191) % 850000),
      updatedAt: `2026-07-${String((seed % 28) + 1).padStart(2, "0")}`,
    };
  },
);

const adaptiveSchema: AdaptiveCardFieldSchema<PortfolioRow>[] = [
  { key: "symbol", label: "Symbol", priority: 0 },
  {
    key: "status",
    label: "Status",
    type: "status",
    align: "right",
    priority: 1,
  },
  { key: "desk", label: "Desk", priority: 2 },
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
    key: "exposure",
    label: "Exposure",
    type: "currency",
    currency: "INR",
    align: "right",
    maximumFractionDigits: 0,
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

const adaptiveActions: AdaptiveCardAction<PortfolioRow>[] = [
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

const tableColumns: TableColumnDef<PortfolioRow>[] = [
  { accessorKey: "symbol", header: "Symbol" },
  { accessorKey: "desk", header: "Desk" },
  { accessorKey: "owner", header: "Owner" },
  { accessorKey: "status", header: "Status" },
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
    accessorKey: "exposure",
    header: "Exposure",
    cell: ({ getValue }) => {
      const value = Number(getValue() ?? 0);
      return value.toLocaleString("en-IN");
    },
  },
  { accessorKey: "updatedAt", header: "Updated" },
];

const toolbarColumns: AdvanceFilterColumn[] = [
  { id: "symbol", label: "Symbol", canFilter: true, canSort: true },
  { id: "desk", label: "Desk", canFilter: true, canSort: true },
  { id: "owner", label: "Owner", canFilter: true, canSort: true },
  { id: "status", label: "Status", canFilter: true, canSort: true },
  { id: "price", label: "Price", canFilter: true, canSort: true },
  { id: "change", label: "Change", canFilter: true, canSort: true },
  { id: "exposure", label: "Exposure", canFilter: true, canSort: true },
  { id: "updatedAt", label: "Updated", canFilter: true, canSort: true },
];

const shellStyle: CSSProperties = {
  width: "100%",
  maxWidth: "1200px",
  minWidth: 0,
  marginInline: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "0.9rem",
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
  rows: PortfolioRow[],
  filters: ColumnFiltersState,
  globalSearch: string,
): PortfolioRow[] {
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
      const rowValue = row[filter.id as keyof PortfolioRow];
      return matchesAdvancedFilter(rowValue, filter.value);
    });
  });
}

function applySorting(
  rows: PortfolioRow[],
  sorting: SortingState,
): PortfolioRow[] {
  if (sorting.length === 0) {
    return rows;
  }

  const [firstSort] = sorting;

  if (firstSort == null) {
    return rows;
  }

  return [...rows].sort((leftRow, rightRow) => {
    const left = leftRow[firstSort.id as keyof PortfolioRow];
    const right = rightRow[firstSort.id as keyof PortfolioRow];

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

const meta: Meta<AdaptiveCardProps<PortfolioRow>> = {
  title: "Data/AdaptiveCard",
  component: AdaptiveCard as unknown as Meta<
    AdaptiveCardProps<PortfolioRow>
  >["component"],
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<AdaptiveCardProps<PortfolioRow>>;

export const Basic: Story = {
  render: () => (
    <div style={shellStyle}>
      <AdaptiveCard<PortfolioRow>
        data={portfolioRows.slice(0, 16)}
        rowKey="id"
        schema={adaptiveSchema}
        actions={adaptiveActions}
        variant="default"
        size="sm"
        columns={{ mobile: 1, tablet: 1, web: 1 }}
        insideColumns={2}
        showToolbar={false}
        showPagination
      />
    </div>
  ),
};

function ToolbarAdaptiveLayout(
  args: Partial<AdaptiveCardProps<PortfolioRow>>,
): JSX.Element {
  const [view, setView] = useState<ViewMode>("adaptive-card");
  const [searchValue, setSearchValue] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [fullscreen, setFullscreen] = useState(false);

  const filteredRows = useMemo(
    () => applyAdvancedFilters(portfolioRows, columnFilters, searchValue),
    [columnFilters, searchValue],
  );
  const resolvedRows = useMemo(
    () => applySorting(filteredRows, sorting),
    [filteredRows, sorting],
  );

  const switchMode = view === "adaptive-card" ? "table" : "adaptive-card";

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
        switchLabel={view === "adaptive-card" ? "Table" : "Cards"}
        onSwitch={() => {
          setView((current) =>
            current === "adaptive-card" ? "table" : "adaptive-card",
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

      {view === "adaptive-card" ? (
        <AdaptiveCard<PortfolioRow>
          data={resolvedRows}
          rowKey="id"
          schema={adaptiveSchema}
          actions={adaptiveActions}
          variant={args.variant ?? "default"}
          size={args.size ?? "sm"}
          insideColumns={args.insideColumns ?? 2}
          columns={args.columns ?? { mobile: 1, tablet: 1, web: 1 }}
          showToolbar={false}
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
          virtualized={false}
        />
      ) : (
        <Table
          data={resolvedRows}
          columns={tableColumns}
          variant="striped"
          size="sm"
          compact
          showToolbar={false}
          sortable={false}
          filterable={false}
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
        />
      )}
    </div>
  );
}

export const ToolbarComposedLayout: Story = {
  name: "Toolbar Composed Layout",
  args: {
    variant: "default",
    size: "sm",
    insideColumns: 2,
    columns: { mobile: 1, tablet: 1, web: 1 },
    paginationVariant: "advance",
    paginationDefaultPageSize: 10,
    paginationPageSizeOptions: [10, 20, 50],
    paginationMaxVisiblePages: 5,
    paginationShowPageSizeSelector: true,
    paginationShowSummary: true,
    paginationShowShowingPage: true,
    paginationResetPageOnPageSizeChange: true,
  },
  render: (args) => <ToolbarAdaptiveLayout {...args} />,
};

export const VirtualizedOneColumn: Story = {
  render: () => (
    <div style={shellStyle}>
      <AdaptiveCard<PortfolioRow>
        data={portfolioRows}
        rowKey="id"
        schema={adaptiveSchema}
        actions={adaptiveActions}
        variant="compact"
        size="sm"
        insideColumns={2}
        columns={1}
        virtualized
        virtualizedMaxHeight="38rem"
        virtualizedEstimateSize={240}
        virtualizedOverscan={8}
        showToolbar={false}
        showPagination={false}
      />
    </div>
  ),
};

const playgroundArgTypes = {
  variant: {
    control: "select",
    options: ["default", "compact", "ghost"],
  },
  size: {
    control: "select",
    options: ["xs", "sm", "md", "lg"],
  },
  insideColumns: {
    control: "inline-radio",
    options: [1, 2, 3],
  },
  columns: { control: "object" },
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
  onAction: { action: "adaptive-action" },
  data: { table: { disable: true } },
  schema: { table: { disable: true } },
  actions: { table: { disable: true } },
  showToolbar: { table: { disable: true } },
  searchable: { table: { disable: true } },
  virtualized: { table: { disable: true } },
} satisfies NonNullable<Story["argTypes"]>;

export const AdaptiveCardPlayground: Story = {
  name: "AdaptiveCard Playground",
  args: {
    variant: "default",
    size: "sm",
    insideColumns: 2,
    columns: { mobile: 1, tablet: 1, web: 1 },
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
  render: (args) => <ToolbarAdaptiveLayout {...args} />,
};
