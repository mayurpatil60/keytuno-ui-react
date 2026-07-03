import { useMemo, useState, type CSSProperties } from "react";

import type { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import type { Meta, StoryObj } from "@storybook/react";
import { FiEdit3, FiEye } from "../src/components/icons/feather";

import {
  AdaptiveCard,
  DataToolbar,
  Table,
  type AdaptiveCardAction,
  type AdaptiveCardFieldSchema,
  type AdvanceFilterColumn,
  type DataToolbarProps,
  type TableColumnDef,
} from "../src/index";

interface DemoRow {
  id: string;
  name: string;
  category: "Equity" | "Debt" | "Commodity";
  status: "Open" | "Review" | "Closed";
  owner: string;
  amount: number;
  updatedAt: string;
}

type ViewMode = "table" | "adaptive-card";

const categories: DemoRow["category"][] = ["Equity", "Debt", "Commodity"];
const statuses: DemoRow["status"][] = ["Open", "Review", "Closed"];
const owners = ["Mayur", "Anaya", "Vivaan", "Aditi", "Ishaan"];

const demoRows: DemoRow[] = Array.from({ length: 90 }, (_, index) => {
  const seed = index + 1;

  return {
    id: `ROW-${String(seed).padStart(4, "0")}`,
    name: `Portfolio ${seed}`,
    category: categories[index % categories.length] ?? "Equity",
    status: statuses[index % statuses.length] ?? "Open",
    owner: owners[index % owners.length] ?? "Mayur",
    amount: 15000 + ((seed * 919) % 240000),
    updatedAt: `2026-07-${String((seed % 28) + 1).padStart(2, "0")}`,
  };
});

const tableColumns: TableColumnDef<DemoRow>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "owner", header: "Owner" },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => Number(getValue() ?? 0).toLocaleString("en-IN"),
  },
  { accessorKey: "updatedAt", header: "Updated" },
];

const adaptiveSchema: AdaptiveCardFieldSchema<DemoRow>[] = [
  { key: "name", label: "Name", priority: 0 },
  {
    key: "status",
    label: "Status",
    type: "status",
    align: "right",
    priority: 1,
  },
  { key: "category", label: "Category", priority: 2 },
  { key: "owner", label: "Owner", priority: 3 },
  {
    key: "amount",
    label: "Amount",
    type: "currency",
    currency: "INR",
    align: "right",
    maximumFractionDigits: 0,
    priority: 4,
  },
  {
    key: "updatedAt",
    label: "Updated",
    type: "date",
    dateOptions: { year: "numeric", month: "short", day: "numeric" },
    priority: 5,
  },
];

const adaptiveActions: AdaptiveCardAction<DemoRow>[] = [
  { id: "view", label: "View", icon: <FiEye size={13} /> },
  {
    id: "edit",
    label: "Edit",
    icon: <FiEdit3 size={13} />,
    variant: "outline",
  },
];

const toolbarColumns: AdvanceFilterColumn[] = [
  { id: "name", label: "Name", canFilter: true, canSort: true },
  { id: "category", label: "Category", canFilter: true, canSort: true },
  { id: "status", label: "Status", canFilter: true, canSort: true },
  { id: "owner", label: "Owner", canFilter: true, canSort: true },
  { id: "amount", label: "Amount", canFilter: true, canSort: true },
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

function applySearch(rows: DemoRow[], search: string): DemoRow[] {
  const normalizedSearch = search.trim().toLowerCase();

  if (normalizedSearch === "") {
    return rows;
  }

  return rows.filter((row) => {
    const searchableText = Object.values(row)
      .map((value) => String(value).toLowerCase())
      .join(" ");

    return searchableText.includes(normalizedSearch);
  });
}

function applyColumnFilters(
  rows: DemoRow[],
  filters: ColumnFiltersState,
): DemoRow[] {
  if (filters.length === 0) {
    return rows;
  }

  return rows.filter((row) => {
    return filters.every((filter) => {
      const rowValue = String(
        row[filter.id as keyof DemoRow] ?? "",
      ).toLowerCase();
      const filterText = String(filter.value ?? "")
        .toLowerCase()
        .replaceAll(/[~^$=><!]/g, "")
        .trim();

      if (filterText === "") {
        return true;
      }

      return rowValue.includes(filterText);
    });
  });
}

function applySorting(rows: DemoRow[], sorting: SortingState): DemoRow[] {
  if (sorting.length === 0) {
    return rows;
  }

  const [first] = sorting;

  if (first == null) {
    return rows;
  }

  return [...rows].sort((leftRow, rightRow) => {
    const left = leftRow[first.id as keyof DemoRow];
    const right = rightRow[first.id as keyof DemoRow];

    if (typeof left === "number" && typeof right === "number") {
      return first.desc ? right - left : left - right;
    }

    const leftText = String(left ?? "").toLowerCase();
    const rightText = String(right ?? "").toLowerCase();

    if (leftText === rightText) {
      return 0;
    }

    return first.desc
      ? leftText < rightText
        ? 1
        : -1
      : leftText < rightText
        ? -1
        : 1;
  });
}

const meta: Meta<DataToolbarProps> = {
  title: "Data/DataToolbar",
  component: DataToolbar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<DataToolbarProps>;

export const Basic: Story = {
  render: () => {
    const [searchValue, setSearchValue] = useState("");
    const [fullscreen, setFullscreen] = useState(false);

    return (
      <div style={shellStyle}>
        <DataToolbar
          showSearch
          searchValue={searchValue}
          searchPlaceholder="Search"
          searchAriaLabel="Search records"
          onSearchChange={setSearchValue}
          showAdvanceFilter
          advanceFilterColumns={toolbarColumns}
          advanceFilterColumnFilters={[]}
          advanceFilterSorting={[]}
          advanceFilterGlobalSearch={searchValue}
          onAdvanceFilterApply={() => {}}
          showSwitch
          switchMode="adaptive-card"
          switchLabel="Cards"
          onSwitch={() => {}}
          showRefresh
          refreshLabel="Refresh"
          refreshingLabel="Refreshing"
          onRefresh={async () => {
            await new Promise((resolve) => {
              setTimeout(resolve, 120);
            });
          }}
          showFullscreen
          fullscreen={fullscreen}
          fullscreenLabel="Fullscreen"
          exitFullscreenLabel="Exit"
          onFullscreenChange={setFullscreen}
        />
      </div>
    );
  },
};

export const ToolbarComposition: Story = {
  name: "Toolbar Composition",
  render: () => {
    const [viewMode, setViewMode] = useState<ViewMode>("table");
    const [searchValue, setSearchValue] = useState("");
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [fullscreen, setFullscreen] = useState(false);

    const rows = useMemo(() => {
      const searchedRows = applySearch(demoRows, searchValue);
      const filteredRows = applyColumnFilters(searchedRows, columnFilters);
      return applySorting(filteredRows, sorting);
    }, [columnFilters, searchValue, sorting]);

    return (
      <div style={shellStyle}>
        <DataToolbar
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
          onAdvanceFilterApply={(result) => {
            setColumnFilters(result.columnFilters);
            setSorting(result.sorting);
            setSearchValue(result.globalSearch);
          }}
          showSwitch
          switchMode={viewMode === "table" ? "adaptive-card" : "table"}
          switchLabel={viewMode === "table" ? "Cards" : "Table"}
          onSwitch={() => {
            setViewMode((current) =>
              current === "table" ? "adaptive-card" : "table",
            );
          }}
          showRefresh
          refreshLabel="Refresh"
          refreshingLabel="Refreshing"
          onRefresh={async () => {
            await new Promise((resolve) => {
              setTimeout(resolve, 120);
            });
          }}
          showFullscreen
          fullscreen={fullscreen}
          fullscreenLabel="Fullscreen"
          exitFullscreenLabel="Exit"
          onFullscreenChange={setFullscreen}
        />

        {viewMode === "table" ? (
          <Table
            data={rows}
            columns={tableColumns}
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
        ) : (
          <AdaptiveCard<DemoRow>
            data={rows}
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
  },
};

const playgroundArgTypes = {
  size: {
    control: "select",
    options: ["xs", "sm", "md", "lg"],
  },
  showSearch: { control: "boolean" },
  searchPlaceholder: { control: "text" },
  searchAriaLabel: { control: "text" },
  showAdvanceFilter: { control: "boolean" },
  advanceFilterOpenLabel: { control: "text" },
  advanceFilterCloseLabel: { control: "text" },
  advanceFilterTitle: { control: "text" },
  advanceFilterDescription: { control: "text" },
  showSwitch: { control: "boolean" },
  switchMode: {
    control: "select",
    options: ["table", "adaptive-card", "custom"],
  },
  switchLabel: { control: "text" },
  showRefresh: { control: "boolean" },
  refreshLabel: { control: "text" },
  refreshingLabel: { control: "text" },
  showFullscreen: { control: "boolean" },
  fullscreenLabel: { control: "text" },
  exitFullscreenLabel: { control: "text" },
  onAction: { action: "toolbar-action" },
  onSearchChange: { action: "search-change" },
  onAdvanceFilterOpenChange: { action: "filter-open-change" },
  onAdvanceFilterApply: { action: "filter-apply" },
  onSwitch: { action: "switch" },
  onRefresh: { action: "refresh" },
  onFullscreenChange: { action: "fullscreen-change" },
  advanceFilterColumns: { table: { disable: true } },
  advanceFilterColumnFilters: { table: { disable: true } },
  advanceFilterSorting: { table: { disable: true } },
  advanceFilterGlobalSearch: { table: { disable: true } },
  searchValue: { table: { disable: true } },
  fullscreen: { table: { disable: true } },
} satisfies NonNullable<Story["argTypes"]>;

export const DataToolbarPlayground: Story = {
  name: "DataToolbar Playground",
  args: {
    size: "sm",
    showSearch: true,
    searchPlaceholder: "Search",
    searchAriaLabel: "Search records",
    showAdvanceFilter: true,
    advanceFilterOpenLabel: "Filter",
    advanceFilterCloseLabel: "Close",
    advanceFilterTitle: "Advance Filter",
    advanceFilterDescription: "Configure filters and sorting",
    showSwitch: true,
    switchMode: "adaptive-card",
    switchLabel: "Cards",
    showRefresh: true,
    refreshLabel: "Refresh",
    refreshingLabel: "Refreshing",
    showFullscreen: true,
    fullscreenLabel: "Fullscreen",
    exitFullscreenLabel: "Exit",
  },
  argTypes: playgroundArgTypes,
  render: (args) => {
    const [searchValue, setSearchValue] = useState("");
    const [fullscreen, setFullscreen] = useState(false);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);

    return (
      <div style={shellStyle}>
        <DataToolbar
          {...args}
          searchValue={searchValue}
          fullscreen={fullscreen}
          advanceFilterColumns={toolbarColumns}
          advanceFilterColumnFilters={columnFilters}
          advanceFilterSorting={sorting}
          advanceFilterGlobalSearch={searchValue}
          onSearchChange={(value) => {
            setSearchValue(value);
            args.onSearchChange?.(value);
          }}
          onAdvanceFilterApply={(result, reason) => {
            setColumnFilters(result.columnFilters);
            setSorting(result.sorting);
            setSearchValue(result.globalSearch);
            args.onAdvanceFilterApply?.(result, reason);
          }}
          onFullscreenChange={(nextValue) => {
            setFullscreen(nextValue);
            args.onFullscreenChange?.(nextValue);
          }}
        />
      </div>
    );
  },
};
