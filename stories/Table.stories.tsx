import { type CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { FiEdit3, FiEye, FiTrash2 } from "../src/components/icons/feather";

import {
  Table,
  type RowAction,
  type TableColumnDef,
  type TableProps,
} from "../src/index";

interface TradeRow {
  id: string;
  symbol: string;
  detailsUrl: string;
  sector: string;
  status: "Open" | "Paused" | "Closed";
  owner: string;
  price: number;
  change: number;
  volume: number;
  updatedAt: string;
}

type TableStoryArgs = Partial<TableProps<TradeRow>>;

const sectors = ["Banking", "IT", "Energy", "Pharma", "Auto"];
const owners = ["Mayur", "Anaya", "Vivaan", "Aditi", "Ishaan"];
const statuses: TradeRow["status"][] = ["Open", "Paused", "Closed"];

const tradeRows: TradeRow[] = Array.from({ length: 180 }, (_, index) => {
  const seed = index + 1;

  return {
    id: `TRD-${String(seed).padStart(4, "0")}`,
    symbol: `STK${String(100 + seed)}`,
    detailsUrl: `https://keytuno.app/trades/${seed}`,
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
    cell: ({ getValue, row }) => {
      const symbol = String(getValue() ?? "");

      return (
        <a
          href={row.original.detailsUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            color: "var(--ktn-action-primary-bg, #2563eb)",
            textDecoration: "none",
          }}
        >
          {symbol}
        </a>
      );
    },
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

const meta: Meta<TableStoryArgs> = {
  title: "Data/Table",
  component: Table as unknown as Meta<TableStoryArgs>["component"],
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<TableStoryArgs>;

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
        hoverable
        bordered
        rounded
      />
    </div>
  ),
};

export const SelectableStickyHeader: Story = {
  name: "Selectable Sticky Header",
  render: () => (
    <div style={shellStyle}>
      <Table
        data={tradeRows.slice(0, 90)}
        columns={tableColumns}
        rowActions={tableRowActions}
        variant="striped"
        size="sm"
        compact
        selectable
        stickyHeader
        hoverable
      />
    </div>
  ),
};

export const ActionableRowClickablePlaybook: Story = {
  name: "Actionable Row Clickable Playbook",
  argTypes: {
    onAction: { action: "table-action" },
  },
  render: (args) => (
    <div style={shellStyle}>
      <p
        style={{
          margin: 0,
          fontSize: "0.78rem",
          color: "var(--ktn-text-secondary, #64748b)",
        }}
      >
        Click a row to emit row-click. Link and action buttons remain
        independently interactive. Hover tone is transient only.
      </p>

      <Table
        data={tradeRows.slice(0, 20)}
        columns={tableColumns}
        rowActions={tableRowActions}
        rowClickable
        variant="basic"
        size="sm"
        sortable
        hoverable
        onAction={args.onAction}
      />
    </div>
  ),
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
  stickyHeader: { control: "boolean" },
  sortable: { control: "boolean" },
  filterable: { control: "boolean" },
  rowClickable: { control: "boolean" },
  selectable: { control: "boolean" },
  multiSelect: { control: "boolean" },
  columnVisibility: { control: "boolean" },
  loading: { control: "boolean" },
  skeleton: { control: "boolean" },
  onAction: { action: "table-action" },
  data: { table: { disable: true } },
  columns: { table: { disable: true } },
  rowActions: { table: { disable: true } },
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
    stickyHeader: false,
    sortable: true,
    filterable: true,
    rowClickable: true,
    selectable: false,
    multiSelect: true,
    columnVisibility: false,
    loading: false,
    skeleton: true,
  },
  argTypes: playgroundArgTypes,
  render: (args) => (
    <div style={shellStyle}>
      <Table
        data={tradeRows.slice(0, 36)}
        columns={tableColumns}
        rowActions={tableRowActions}
        variant={args.variant ?? "basic"}
        size={args.size ?? "md"}
        compact={args.compact ?? false}
        hoverable={args.hoverable ?? true}
        bordered={args.bordered ?? true}
        rounded={args.rounded ?? true}
        stickyHeader={args.stickyHeader ?? false}
        sortable={args.sortable ?? true}
        filterable={args.filterable ?? true}
        rowClickable={args.rowClickable ?? false}
        selectable={args.selectable ?? false}
        multiSelect={args.multiSelect ?? true}
        columnVisibility={args.columnVisibility ?? false}
        loading={args.loading ?? false}
        skeleton={args.skeleton ?? true}
        onAction={args.onAction}
      />
    </div>
  ),
};
