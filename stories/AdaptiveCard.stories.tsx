import { type CSSProperties } from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { FiEdit3, FiEye, FiTrash2 } from "../src/components/icons/feather";

import {
  AdaptiveCard,
  type AdaptiveCardAction,
  type AdaptiveCardFieldSchema,
  type AdaptiveCardProps,
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

interface ActionAnchorOption {
  id: string;
  label: string;
  actionPlacement: NonNullable<
    AdaptiveCardProps<PortfolioRow>["actionPlacement"]
  >;
  actionAlignment: NonNullable<
    AdaptiveCardProps<PortfolioRow>["actionAlignment"]
  >;
}

type AdaptiveCardStoryArgs = Partial<AdaptiveCardProps<PortfolioRow>>;

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

const actionAnchorOptions: ActionAnchorOption[] = [
  {
    id: "top-left",
    label: "Top Left",
    actionPlacement: "top",
    actionAlignment: "left",
  },
  {
    id: "top-right",
    label: "Top Right",
    actionPlacement: "top",
    actionAlignment: "right",
  },
  {
    id: "bottom-left",
    label: "Bottom Left",
    actionPlacement: "bottom",
    actionAlignment: "left",
  },
  {
    id: "bottom-right",
    label: "Bottom Right",
    actionPlacement: "bottom",
    actionAlignment: "right",
  },
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

const meta: Meta<AdaptiveCardStoryArgs> = {
  title: "Data/AdaptiveCard",
  component:
    AdaptiveCard as unknown as Meta<AdaptiveCardStoryArgs>["component"],
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<AdaptiveCardStoryArgs>;

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
        actionLayout="same-row"
        actionPlacement="top"
        actionAlignment="right"
      />
    </div>
  ),
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
        actionLayout="own-row"
      />
    </div>
  ),
};

export const ActionPositionMatrix: Story = {
  name: "Action Position Matrix",
  render: () => (
    <div style={{ ...shellStyle, maxWidth: "100%", gap: "1.1rem" }}>
      {(["same-row", "own-row"] as const).map((layoutMode) => (
        <section
          key={layoutMode}
          style={{
            width: "100%",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: "0.68rem",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.02em",
              color: "var(--ktn-text-secondary, #475569)",
            }}
          >
            {layoutMode === "same-row" ? "Same Row Layout" : "Own Row Layout"}
          </p>

          <div
            style={{
              width: "100%",
              minWidth: 0,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {actionAnchorOptions.map((option) => (
              <div
                key={`${layoutMode}-${option.id}`}
                style={{
                  width: "100%",
                  minWidth: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.45rem",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.76rem",
                    color: "var(--ktn-text-secondary, #64748b)",
                  }}
                >
                  {option.label}
                </p>

                <AdaptiveCard<PortfolioRow>
                  data={portfolioRows.slice(0, 2)}
                  rowKey="id"
                  schema={adaptiveSchema}
                  actions={adaptiveActions}
                  actionMode="inline"
                  actionLayout={layoutMode}
                  actionPlacement={option.actionPlacement}
                  actionAlignment={option.actionAlignment}
                  variant="default"
                  size="sm"
                  insideColumns={2}
                  columns={1}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};

const playgroundArgTypes = {
  actionMode: {
    control: "select",
    options: ["auto", "inline", "menu"],
  },
  actionInlineMaxVisible: {
    control: { type: "number", min: 1, max: 8, step: 1 },
  },
  actionPlacement: {
    control: "inline-radio",
    options: ["top", "bottom"],
  },
  actionAlignment: {
    control: "inline-radio",
    options: ["left", "right"],
  },
  actionLayout: {
    control: "inline-radio",
    options: ["own-row", "same-row"],
  },
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
  onAction: { action: "adaptive-action" },
  data: { table: { disable: true } },
  schema: { table: { disable: true } },
  actions: { table: { disable: true } },
} satisfies NonNullable<Story["argTypes"]>;

export const AdaptiveCardPlayground: Story = {
  name: "AdaptiveCard Playground",
  args: {
    actionMode: "auto",
    actionInlineMaxVisible: 4,
    actionPlacement: "bottom",
    actionAlignment: "right",
    actionLayout: "own-row",
    variant: "default",
    size: "sm",
    insideColumns: 2,
    columns: { mobile: 1, tablet: 1, web: 1 },
  },
  argTypes: playgroundArgTypes,
  render: (args) => (
    <div style={shellStyle}>
      <AdaptiveCard<PortfolioRow>
        data={portfolioRows.slice(0, 24)}
        rowKey="id"
        schema={adaptiveSchema}
        actions={adaptiveActions}
        actionMode={args.actionMode ?? "auto"}
        actionInlineMaxVisible={args.actionInlineMaxVisible ?? 4}
        actionPlacement={args.actionPlacement ?? "bottom"}
        actionAlignment={args.actionAlignment ?? "right"}
        actionLayout={args.actionLayout ?? "own-row"}
        variant={args.variant ?? "default"}
        size={args.size ?? "sm"}
        insideColumns={args.insideColumns ?? 2}
        columns={args.columns ?? { mobile: 1, tablet: 1, web: 1 }}
        onAction={args.onAction}
      />
    </div>
  ),
};
