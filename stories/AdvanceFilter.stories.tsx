import { useState, type CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react";

import {
  AdvanceFilter,
  type AdvanceFilterActionContext,
  type AdvanceFilterColumn,
  type AdvanceFilterProps,
  type AdvanceFilterResult,
} from "../src/index";

const filterColumns: AdvanceFilterColumn[] = [
  { id: "symbol", label: "Symbol" },
  { id: "desk", label: "Desk" },
  { id: "owner", label: "Owner" },
  { id: "status", label: "Status" },
  { id: "price", label: "Price" },
  { id: "volume", label: "Volume" },
  { id: "updatedAt", label: "Updated" },
];

const stackStyle: CSSProperties = {
  width: "min(1120px, 96vw)",
  minWidth: 0,
  marginInline: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const panelStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
  padding: "0.7rem",
  borderRadius: "0.75rem",
  border: "1px dashed var(--ktn-border-muted, #cbd5e1)",
  backgroundColor: "var(--ktn-bg-muted, rgba(15, 23, 42, 0.03))",
  display: "flex",
  flexDirection: "column",
  gap: "0.42rem",
  boxSizing: "border-box",
};

const meta: Meta<typeof AdvanceFilter> = {
  title: "Data/AdvanceFilter",
  component: AdvanceFilter,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

type TradeFilterSortState = {
  columnFilters: AdvanceFilterResult["columnFilters"];
  sorting: AdvanceFilterResult["sorting"];
  globalSearch: string;
};

function BasicAdvanceFilterDemo(
  args: Partial<AdvanceFilterProps>,
): JSX.Element {
  const [state, setState] = useState<TradeFilterSortState>({
    columnFilters: [],
    sorting: [],
    globalSearch: "",
  });

  return (
    <div style={stackStyle}>
      <div style={panelStyle}>
        <AdvanceFilter
          columns={filterColumns}
          columnFilters={state.columnFilters}
          sorting={state.sorting}
          globalSearch={state.globalSearch}
          {...args}
          onApply={(result, reason) => {
            setState({
              columnFilters: result.columnFilters,
              sorting: result.sorting,
              globalSearch: result.globalSearch,
            });
            args.onApply?.(result, reason);
          }}
          onAction={args.onAction}
        />
      </div>
    </div>
  );
}

export const Basic: Story = {
  render: () => (
    <BasicAdvanceFilterDemo
      canUseGlobalFilter
      enableSorting
      controlSize="sm"
      side="right"
      title="Advance Filter"
      description="Filter columns with multiple rules and operators"
      triggerOpenLabel="Advance Filter"
      triggerCloseLabel="Close Advance Filter"
    />
  ),
};

export const ActionsAndAccessibility: Story = {
  name: "Actions and Accessibility",
  args: {
    onApply: undefined,
    onAction: undefined,
  },
  argTypes: {
    onApply: {
      action: "apply",
      description:
        "Fires on apply, clear filters, and reset sorting with normalized filter/sort payload.",
    },
    onAction: {
      action: "action",
      description:
        "Fires for open state, add/reset rule events, and footer actions.",
    },
  },
  render: (args) => {
    const onAction = args.onAction;

    const handleAction =
      onAction == null
        ? undefined
        : (context: AdvanceFilterActionContext) => {
            onAction(context);
          };

    return (
      <BasicAdvanceFilterDemo
        canUseGlobalFilter
        enableSorting
        triggerOpenLabel="Open trade advance filters"
        triggerCloseLabel="Close trade advance filters"
        triggerAriaLabel="Open trade advance filters"
        title="Advance Filter"
        description="Filter columns with multiple rules and operators"
        onApply={args.onApply}
        onAction={handleAction}
      />
    );
  },
};

const playgroundArgTypes = {
  side: {
    control: "select",
    options: ["left", "right", "top", "bottom"],
  },
  controlSize: {
    control: "select",
    options: ["xs", "sm", "md", "lg"],
  },
  showTrigger: {
    control: "boolean",
  },
  triggerDisabled: {
    control: "boolean",
  },
  triggerOpenLabel: {
    control: "text",
  },
  triggerCloseLabel: {
    control: "text",
  },
  triggerAriaLabel: {
    control: "text",
  },
  activeFilterCount: {
    control: { type: "number", min: 0, max: 20, step: 1 },
  },
  canUseGlobalFilter: {
    control: "boolean",
  },
  enableSorting: {
    control: "boolean",
  },
  title: {
    control: "text",
  },
  description: {
    control: "text",
  },
  filtersSectionLabel: {
    control: "text",
  },
  sortSectionLabel: {
    control: "text",
  },
  addFilterLabel: {
    control: "text",
  },
  addSortLabel: {
    control: "text",
  },
  clearFiltersLabel: {
    control: "text",
  },
  resetSortingLabel: {
    control: "text",
  },
  applyFiltersLabel: {
    control: "text",
  },
  globalFilterLabel: {
    control: "text",
  },
  globalFilterPlaceholder: {
    control: "text",
  },
  ruleValuePlaceholder: {
    control: "text",
  },
  columns: {
    table: { disable: true },
  },
  open: {
    table: { disable: true },
  },
  defaultOpen: {
    table: { disable: true },
  },
  columnFilters: {
    table: { disable: true },
  },
  sorting: {
    table: { disable: true },
  },
  globalSearch: {
    table: { disable: true },
  },
  onOpenChange: {
    table: { disable: true },
  },
  onApply: {
    action: "apply",
  },
  onAction: {
    action: "action",
  },
} satisfies NonNullable<Story["argTypes"]>;

export const AdvanceFilterPlayground: Story = {
  name: "Advance Filter Playground",
  args: {
    side: "right",
    controlSize: "sm",
    showTrigger: true,
    triggerDisabled: false,
    triggerOpenLabel: "Advance Filter",
    triggerCloseLabel: "Close Advance Filter",
    triggerAriaLabel: "Open advance filter sheet",
    canUseGlobalFilter: true,
    enableSorting: true,
    title: "Advance Filter",
    description: "Filter columns with multiple rules and operators",
    filtersSectionLabel: "Filter rules",
    sortSectionLabel: "Sort rules",
    addFilterLabel: "Add filter",
    addSortLabel: "Add sort",
    clearFiltersLabel: "Clear filters",
    resetSortingLabel: "Reset sorting",
    applyFiltersLabel: "Apply filters",
    globalFilterLabel: "Global search",
    globalFilterPlaceholder: "Search all columns",
    ruleValuePlaceholder: "Enter value",
  },
  argTypes: playgroundArgTypes,
  render: (args) => <BasicAdvanceFilterDemo {...args} />,
};
