import { useMemo, useState, type CSSProperties } from "react";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import type { Meta, StoryObj } from "@storybook/react";
import { FiEdit3, FiEye, FiTrash2 } from "../src/components/icons/feather";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  Table,
  type RowAction,
  type TableColumnDef,
  type TableProps,
} from "../src/index";

interface TradeRow {
  id: string;
  symbol: string;
  sector: string;
  price: number;
  change: number;
  volume: number;
  status: "Open" | "Paused" | "Closed";
  trader: string;
  updatedAt: string;
}

type TableSortState = Parameters<
  NonNullable<TableProps<TradeRow>["onSortChange"]>
>[0];
type TableFilterState = Parameters<
  NonNullable<TableProps<TradeRow>["onFilterChange"]>
>[0];

type NumericFilterOperator = "gt" | "gte" | "lt" | "lte" | "eq" | "neq";

type ParsedNumericFilterCondition = {
  operator: NumericFilterOperator;
  value: number;
};

const sectors = ["Banking", "IT", "Energy", "Pharma", "Auto"];
const statuses: TradeRow["status"][] = ["Open", "Paused", "Closed"];
const traders = ["Mayur", "Anaya", "Vivaan", "Aditi", "Ishaan"];

const mockRows: TradeRow[] = Array.from({ length: 96 }, (_, index) => {
  const seed = index + 1;
  const sector = sectors[index % sectors.length] ?? "Banking";
  const price = 120 + ((seed * 17) % 1430);
  const signedChange = ((seed % 2 === 0 ? 1 : -1) * ((seed * 11) % 145)) / 10;

  return {
    id: `TRADE-${String(seed).padStart(4, "0")}`,
    symbol: `STK${String(100 + seed)}`,
    sector,
    price,
    change: signedChange,
    volume: 1200 + ((seed * 7531) % 89000),
    status: statuses[index % statuses.length] ?? "Open",
    trader: traders[index % traders.length] ?? "Mayur",
    updatedAt: `2026-06-${String((seed % 28) + 1).padStart(2, "0")}`,
  };
});

const baseColumns: TableColumnDef<TradeRow>[] = [
  {
    accessorKey: "symbol",
    header: "Symbol",
  },
  {
    accessorKey: "sector",
    header: "Sector",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ getValue }) => {
      const value = Number(getValue() ?? 0);
      return `₹${value.toFixed(2)}`;
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
    cell: ({ getValue }) => {
      const value = Number(getValue() ?? 0);
      return value.toLocaleString("en-IN");
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "trader",
    header: "Trader",
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
    variant: "secondary",
    compact: true,
    iconOnly: true,
    iconOnlyTone: true,
    tooltip: "View",
    onClick: () => {},
  },
  {
    id: "edit",
    label: "",
    icon: <FiEdit3 size={13} />,
    variant: "primary",
    compact: true,
    iconOnly: true,
    iconOnlyTone: true,
    tooltip: "Edit",
    onClick: () => {},
  },
  {
    id: "remove",
    label: "",
    icon: <FiTrash2 size={13} />,
    variant: "destructive",
    compact: true,
    iconOnly: true,
    iconOnlyTone: true,
    tooltip: "Delete",
    onClick: () => {},
  },
];

const stackStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  width: "100%",
  maxWidth: "1200px",
  minWidth: 0,
  marginInline: "auto",
  paddingInline: "clamp(0.75rem, 2.5vw, 1.5rem)",
  boxSizing: "border-box",
};

const frameStyle: CSSProperties = {
  width: "100%",
  maxWidth: "1200px",
  minWidth: 0,
  marginInline: "auto",
  boxSizing: "border-box",
};

const tableFrameStyle: CSSProperties = {
  width: "100%",
};

const cardTableShellStyle: CSSProperties = {
  width: "100%",
  maxWidth: "1200px",
  minWidth: 0,
  marginInline: "auto",
  boxSizing: "border-box",
};

const cardTableContentStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
  padding: "0.65rem",
  boxSizing: "border-box",
};

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

  if (normalizedTerm.startsWith("~")) {
    const expected = normalizedTerm.slice(1).trim().toLowerCase();
    return expected === "" ? true : normalizedValue.includes(expected);
  }

  if (normalizedTerm.endsWith("$")) {
    const expected = normalizedTerm.slice(0, -1).trim().toLowerCase();
    return expected === "" ? true : normalizedValue.endsWith(expected);
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

function matchesAdvancedColumnFilter(
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

function applyServerFilters(
  rows: TradeRow[],
  filters: TableFilterState,
): TradeRow[] {
  const globalSearch = String(
    filters.find((filter) => filter.id === "__global")?.value ?? "",
  )
    .trim()
    .toLowerCase();

  const scopedFilters = filters.filter((filter) => filter.id !== "__global");

  return rows.filter((row) => {
    if (globalSearch !== "") {
      const searchableText = Object.values(row)
        .map((value) => String(value).toLowerCase())
        .join(" ");

      if (!searchableText.includes(globalSearch)) {
        return false;
      }
    }

    return scopedFilters.every((filter) => {
      const rowValue = row[filter.id as keyof TradeRow];
      return matchesAdvancedColumnFilter(rowValue, filter.value);
    });
  });
}

function applyServerSorting(
  rows: TradeRow[],
  sorting: TableSortState,
): TradeRow[] {
  if (sorting.length === 0) {
    return rows;
  }

  const [{ id, desc }] = sorting;

  return [...rows].sort((leftRow, rightRow) => {
    const left = leftRow[id as keyof TradeRow];
    const right = rightRow[id as keyof TradeRow];

    if (typeof left === "number" && typeof right === "number") {
      return desc ? right - left : left - right;
    }

    const leftText = String(left ?? "").toLowerCase();
    const rightText = String(right ?? "").toLowerCase();

    if (leftText === rightText) {
      return 0;
    }

    return desc
      ? leftText < rightText
        ? 1
        : -1
      : leftText < rightText
        ? -1
        : 1;
  });
}

function paginateRows(
  rows: TradeRow[],
  page: number,
  pageSize: number,
): TradeRow[] {
  const safePageSize = Math.max(1, pageSize);
  const safePage = Math.max(1, page);

  const startIndex = (safePage - 1) * safePageSize;
  const endIndex = startIndex + safePageSize;

  return rows.slice(startIndex, endIndex);
}

function SelectionDemo(): JSX.Element {
  const [selectedRows, setSelectedRows] = useState<TradeRow[]>([]);

  return (
    <div style={stackStyle}>
      <Field style={frameStyle}>
        <FieldLabel>Selectable + MultiSelect + Row Actions</FieldLabel>

        <FieldContent>
          <Table
            data={mockRows.slice(0, 24)}
            columns={baseColumns}
            variant="outline"
            size="sm"
            selectable
            multiSelect
            onSelectionChange={setSelectedRows}
            rowActions={tableRowActions}
            sortable
            filterable
            columnFilters={["symbol", "sector", "status", "trader"]}
            searchable
            searchPlaceholder="Search selected-grid..."
            showToolbar
            columnVisibility
            defaultHiddenColumns={["updatedAt"]}
          />

          <FieldDescription>{`Selected Rows: ${selectedRows.length}`}</FieldDescription>
        </FieldContent>
      </Field>
    </div>
  );
}

function ServerSideTableInner(): JSX.Element {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sorting, setSorting] = useState<TableSortState>([]);
  const [filters, setFilters] = useState<TableFilterState>([]);
  const [refreshToken, setRefreshToken] = useState(0);

  const query = useQuery({
    queryKey: ["table-server", page, pageSize, sorting, filters, refreshToken],
    queryFn: async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 220);
      });

      const filteredRows = applyServerFilters(mockRows, filters);
      const sortedRows = applyServerSorting(filteredRows, sorting);
      const pagedRows = paginateRows(sortedRows, page, pageSize);

      return {
        rows: pagedRows,
        totalRows: sortedRows.length,
      };
    },
    placeholderData: (previousData) => previousData,
    staleTime: 25_000,
  });

  return (
    <Table
      data={query.data?.rows ?? []}
      columns={baseColumns}
      variant="filled"
      size="md"
      sortable
      filterable
      columnFilters={["symbol", "sector", "status", "trader"]}
      globalFilter
      searchable
      searchPlaceholder="Server search (TanStack Query)..."
      serverSide
      totalRows={query.data?.totalRows ?? mockRows.length}
      pageIndex={page}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
      onSortChange={setSorting}
      onFilterChange={setFilters}
      loading={query.isPending || query.isFetching}
      showRefresh
      onRefresh={() => {
        setRefreshToken((current) => current + 1);
      }}
      showToolbar
      columnVisibility
      defaultHiddenColumns={["updatedAt"]}
    />
  );
}

function ServerSideQueryDemo(): JSX.Element {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <ServerSideTableInner />
    </QueryClientProvider>
  );
}

const DEFAULT_PAGE_SIZE = 10;

export const Basic: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Basic</h3>

      <Field style={frameStyle}>
        <FieldLabel>Basic Table</FieldLabel>

        <FieldContent>
          <Table
            data={mockRows.slice(0, 20)}
            columns={baseColumns}
            variant="basic"
            size="md"
            sortable
            filterable
            columnFilters={["symbol", "sector", "status"]}
            searchable
            searchPlaceholder="Search symbol, sector, status..."
            hoverable
            bordered
            rounded
            showToolbar
            columnVisibility
            defaultHiddenColumns={["updatedAt"]}
          />

          <FieldDescription>
            Basic variant with sorting, filtering, search, pagination, and
            column visibility state.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Variants</h3>

      {(
        ["basic", "outline", "ghost", "filled", "minimal", "striped"] as const
      ).map((variant) => (
        <Field key={variant} style={frameStyle}>
          <FieldLabel>{variant.toUpperCase()}</FieldLabel>

          <FieldContent>
            <Table
              data={mockRows.slice(0, 10)}
              columns={baseColumns.slice(0, 6)}
              variant={variant}
              size="sm"
              sortable
              hoverable
              bordered={variant !== "ghost"}
              showToolbar={false}
            />
          </FieldContent>
        </Field>
      ))}
    </div>
  ),
};

export const SelectionAndActions: Story = {
  name: "Selection + Row Actions",
  render: () => <SelectionDemo />,
};

export const LoadingSkeleton: Story = {
  name: "Loading + Skeleton",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Loading + Skeleton</h3>

      <Field style={frameStyle}>
        <FieldLabel>Skeleton Loader</FieldLabel>

        <FieldContent>
          <Table
            data={[]}
            columns={baseColumns}
            variant="outline"
            size="md"
            loading
            loadingRows={8}
            skeleton
            showToolbar
            showRefresh
          />
        </FieldContent>
      </Field>

      <Field style={frameStyle}>
        <FieldLabel>Spinner Loader</FieldLabel>

        <FieldContent>
          <Table
            data={[]}
            columns={baseColumns}
            variant="minimal"
            size="md"
            loading
            skeleton={false}
            showToolbar
          />
        </FieldContent>
      </Field>
    </div>
  ),
};

export const StickyHeaderFullscreen: Story = {
  name: "Sticky Header + Fullscreen",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Sticky Header + Fullscreen</h3>

      <Field style={frameStyle}>
        <FieldLabel>Large Dataset</FieldLabel>

        <FieldContent>
          <Table
            data={mockRows}
            columns={baseColumns}
            variant="striped"
            size="sm"
            sortable
            filterable
            columnFilters={["symbol", "sector", "trader"]}
            searchable
            stickyHeader
            fullscreen
            showToolbar
            columnVisibility
            defaultHiddenColumns={["updatedAt"]}
          />

          <FieldDescription>
            Uses sticky header and fullscreen mode for larger datasets.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const ServerSideTanstackQuery: Story = {
  name: "Server-Side (TanStack Query)",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Server-Side (TanStack Query)</h3>

      <Field style={frameStyle}>
        <FieldLabel>Manual pagination/sort/filter with query</FieldLabel>

        <FieldContent>
          <ServerSideQueryDemo />

          <FieldDescription>
            Server-side mode with TanStack Query for data fetching and TanStack
            Table for table state.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

const tableInteractiveDefaultArgs: Story["args"] = {
  variant: "striped",
  compact: true,
  size: "md",
  sortable: true,
  filterable: true,
  searchable: true,
  selectable: true,
  multiSelect: true,
  columnVisibility: true,
  showToolbar: true,
  showRefresh: true,
  showPagination: true,
  paginationVariant: "advance",
  paginationDefaultPageSize: 10,
  paginationPageSizeOptions: [10, 20, 50, 100],
  paginationMaxVisiblePages: 5,
  paginationShowPageSizeSelector: true,
  paginationShowSummary: true,
  paginationShowShowingPage: true,
  paginationResetPageOnPageSizeChange: true,
  loading: false,
  loadingRows: 6,
  skeleton: true,
  hoverable: true,
  bordered: true,
  rounded: true,
  stickyHeader: true,
  fullscreen: true,
  serverSide: false,
  globalFilter: true,
  showFiltersLabel: "Filters",
  hideFiltersLabel: "Close",
  switchToCardViewLabel: "Cards",
  refreshLabel: "Refresh",
  refreshingLabel: "Refreshing",
  fullscreenLabel: "Fullscreen",
  resetScreenLabel: "Reset",
  columnFilters: ["symbol", "sector", "status", "price"],
  defaultHiddenColumns: ["updatedAt"],
};

const tableInteractiveArgTypes = {
  variant: {
    control: "select",
    options: ["basic", "outline", "ghost", "filled", "minimal", "striped"],
  },
  size: {
    control: "select",
    options: ["xs", "sm", "md", "lg"],
  },
  compact: { control: "boolean" },
  sortable: { control: "boolean" },
  filterable: { control: "boolean" },
  searchable: { control: "boolean" },
  globalFilter: { control: "boolean" },
  selectable: { control: "boolean" },
  multiSelect: { control: "boolean" },
  columnVisibility: { control: "boolean" },
  showToolbar: { control: "boolean" },
  showRefresh: { control: "boolean" },
  showPagination: { control: "boolean" },
  paginationVariant: {
    control: "select",
    options: ["basic", "advance", "compact"],
  },
  paginationDefaultPageSize: {
    control: { type: "number", min: 1, max: 200, step: 1 },
  },
  paginationPageSizeOptions: { control: "object" },
  paginationMaxVisiblePages: {
    control: { type: "number", min: 3, max: 15, step: 1 },
  },
  paginationShowPageSizeSelector: { control: "boolean" },
  paginationShowSummary: { control: "boolean" },
  paginationShowShowingPage: { control: "boolean" },
  paginationResetPageOnPageSizeChange: { control: "boolean" },
  loading: { control: "boolean" },
  loadingRows: { control: { type: "number", min: 1, max: 20, step: 1 } },
  skeleton: { control: "boolean" },
  hoverable: { control: "boolean" },
  bordered: { control: "boolean" },
  rounded: { control: "boolean" },
  stickyHeader: { control: "boolean" },
  fullscreen: { control: "boolean" },
  onAction: { action: "action" },
  onPageChange: { action: "page-change" },
  onPageSizeChange: { action: "page-size-change" },
  onSortChange: { action: "sort-change" },
  onFilterChange: { action: "filter-change" },
  onSelectionChange: { action: "selection-change" },
  onRefresh: { action: "refresh" },
  serverSide: { table: { disable: true } },
  totalRows: { table: { disable: true } },
  pageIndex: { table: { disable: true } },
  rowActions: { table: { disable: true } },
  data: { table: { disable: true } },
  columns: { table: { disable: true } },
  rowKey: { table: { disable: true } },
  style: { table: { disable: true } },
  className: { table: { disable: true } },
} satisfies NonNullable<Story["argTypes"]>;

export const CardTableFullWidthPlaybook: Story = {
  name: "Card + Table Full Width Playbook",
  args: {
    ...tableInteractiveDefaultArgs,
    compact: true,
    size: "sm",
    stickyHeader: false,
    fullscreen: false,
    rounded: false,
    filterDialogTitle: "Advanced filters",
    filterDialogDescription:
      "Use one modal to build global and per-column rules with starts-with, ends-with, equals, and numeric operators.",
    addFilterLabel: "Add rule",
    clearFiltersLabel: "Clear filters",
    applyFiltersLabel: "Apply filters",
  },
  argTypes: tableInteractiveArgTypes,
  render: (args) => {
    const {
      data: _data,
      columns: _columns,
      rowActions: _rowActions,
      ...restArgs
    } = args;

    return (
      <div style={stackStyle}>
        <div style={cardTableShellStyle}>
          <Card size="sm" spacing="sm" style={{ width: "100%" }}>
            <CardHeader>
              <CardTitle>Trade Monitor</CardTitle>
              <CardDescription>
                Table uses exact card content width, compact spacing, responsive
                wrapping, and dialog-driven advanced filters.
              </CardDescription>
            </CardHeader>

            <CardContent style={cardTableContentStyle}>
              <Table
                key={`card-playbook-${JSON.stringify(restArgs)}`}
                {...restArgs}
                data={mockRows}
                columns={baseColumns}
                rowActions={tableRowActions}
                onRefresh={args.onRefresh ?? (() => {})}
                style={{ width: "100%", maxWidth: "100%" }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  },
};

export const TablePlayground: Story = {
  name: "Table Playground",
  args: tableInteractiveDefaultArgs,
  argTypes: tableInteractiveArgTypes,
  render: (args) => {
    const {
      data: _data,
      columns: _columns,
      rowActions: _rowActions,
      ...restArgs
    } = args;

    return (
      <div style={stackStyle}>
        <Field style={frameStyle}>
          <FieldLabel>Interactive Playground</FieldLabel>

          <FieldContent>
            <Table
              key={JSON.stringify(restArgs)}
              {...restArgs}
              data={mockRows}
              columns={baseColumns}
              rowActions={tableRowActions}
              onRefresh={args.onRefresh ?? (() => {})}
            />

            <FieldDescription>
              Validate each prop quickly using controls.
            </FieldDescription>
          </FieldContent>
        </Field>
      </div>
    );
  },
};
