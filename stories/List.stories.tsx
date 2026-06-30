import { type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "../src/components/Field";
import {
  List,
  type ListHoverActionId,
  type ListItem,
  type ListProps,
} from "../src/components/List";

const marketRows: ListItem[] = [
  {
    id: "nifty50",
    lines: [
      {
        values: ["NIFTY50", "25865.75"],
        size: "md",
        valueTones: ["default", "positive"],
      },
      {
        values: ["INDICES", "-80 (-0.33%)"],
        size: "xs",
        tone: "muted",
        valueTones: ["muted", "negative"],
      },
    ],
  },
  {
    id: "banknifty",
    lines: [
      {
        values: ["BANKNIFTY", "45865.75"],
        size: "md",
        valueTones: ["default", "negative"],
      },
      {
        values: ["INDICES", "-650 (-0.33%)"],
        size: "xs",
        tone: "muted",
        valueTones: ["muted", "negative"],
      },
    ],
  },
];

const oneColumnRows: ListItem[] = [
  {
    id: "watchlist-summary",
    lines: [
      {
        values: ["WATCHLIST SUMMARY"],
        size: "md",
      },
      {
        values: ["Large-cap counters showing mixed momentum in opening hour."],
        size: "sm",
        tone: "muted",
      },
    ],
  },
  {
    id: "watchlist-alert",
    lines: [
      {
        values: ["VOLATILITY ALERT"],
        size: "md",
      },
      {
        values: ["Options IV elevated near weekly expiry."],
        size: "sm",
        tone: "muted",
      },
    ],
  },
];

const threeColumnRows: ListItem[] = [
  {
    id: "reliance-three",
    lines: [
      {
        values: ["RELIANCE", "BUY", "2585.40"],
        size: "md",
        valueTones: ["default", "muted", "positive"],
      },
      {
        values: ["INDICES", "INTRADAY", "+0.82%"],
        size: "xs",
        tone: "muted",
        valueTones: ["muted", "muted", "positive"],
      },
    ],
  },
  {
    id: "icici-three",
    lines: [
      {
        values: ["ICICIBANK", "SELL", "1222.10"],
        size: "md",
        valueTones: ["default", "muted", "negative"],
      },
      {
        values: ["INDICES", "SWING", "-0.44%"],
        size: "xs",
        tone: "muted",
        valueTones: ["muted", "muted", "negative"],
      },
    ],
  },
];

const extendedMarketRows: ListItem[] = [
  {
    id: "nifty50-extended",
    lines: [
      {
        values: ["NIFTY50", "25865.75"],
        size: "md",
        valueTones: ["default", "positive"],
      },
      {
        values: ["INDICES", "+80 (+0.33%)"],
        size: "xs",
        tone: "muted",
        valueTones: ["muted", "positive"],
      },
      {
        values: ["FUTURES", "JUL SERIES"],
        size: "xs",
        tone: "muted",
      },
      {
        values: ["VOLUME", "2.4 CR"],
        size: "xs",
        tone: "muted",
      },
    ],
  },
  {
    id: "banknifty-extended",
    lines: [
      {
        values: ["BANKNIFTY", "45865.75"],
        size: "md",
        valueTones: ["default", "negative"],
      },
      {
        values: ["INDICES", "-650 (-0.33%)"],
        size: "xs",
        tone: "muted",
        valueTones: ["muted", "negative"],
      },
      {
        values: ["OPEN INTEREST", "DOWN 2.1%"],
        size: "xs",
        tone: "muted",
      },
      {
        values: ["ATR", "312"],
        size: "xs",
        tone: "muted",
      },
    ],
    defaultCollapsed: true,
  },
  {
    id: "finnifty-disabled",
    disabled: true,
    lines: [
      {
        values: ["FINNIFTY", "22410.25"],
        size: "md",
      },
      {
        values: ["INDICES", "+10 (+0.04%)"],
        size: "xs",
        tone: "muted",
        valueTones: ["muted", "positive"],
      },
    ],
  },
];

const virtualizedRows: ListItem[] = Array.from({ length: 1200 }, (_, index) => {
  const symbol = `SYM-${String(index + 1).padStart(4, "0")}`;
  const price = 780 + (index % 180) * 2.35;
  const change = ((index % 21) - 10) * 0.18;
  const trendTone = change >= 0 ? "positive" : "negative";
  const pctLabel = `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;

  return {
    id: `virtual-${index + 1}`,
    lines: [
      {
        values: [symbol, price.toFixed(2)],
        size: "sm",
        valueTones: ["default", trendTone],
      },
      {
        values: ["WATCHLIST", pctLabel],
        size: "xs",
        tone: "muted",
        valueTones: ["muted", trendTone],
      },
    ],
  };
});

const stackStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  width: "100%",
  maxWidth: "980px",
};

const frameStyle: CSSProperties = {
  width: "100%",
};

const actionArgTypes = {
  onAction: { action: "action" },
};

const fallbackOnAction = action("action");

const meta: Meta<ListProps> = {
  title: "Data/List",
  component: List,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<ListProps>;
type ListDataset = "one" | "two" | "three" | "extended" | "large";
type ListPlaygroundArgs = ListProps & {
  dataset: ListDataset;
  withAction: boolean;
};

function resolveRows(dataset: ListDataset): ListItem[] {
  if (dataset === "one") {
    return oneColumnRows;
  }

  if (dataset === "three") {
    return threeColumnRows;
  }

  if (dataset === "extended") {
    return extendedMarketRows;
  }

  if (dataset === "large") {
    return virtualizedRows;
  }

  return marketRows;
}

export const OneColumnLayout: Story = {
  name: "One Column Layout",
  argTypes: actionArgTypes,
  render: (args) => {
    const onAction = args.onAction ?? fallbackOnAction;

    return (
      <div style={stackStyle}>
        <Field style={frameStyle}>
          <FieldLabel>One Column List</FieldLabel>

          <FieldContent>
            <List
              items={oneColumnRows}
              columns="one"
              size="md"
              secondaryLineSize="sm"
              secondaryLineTone="muted"
              showHoverActions
              hoverActionIds={["view", "edit", "delete"]}
              onAction={onAction}
              aria-label="One column list"
            />

            <FieldDescription>
              Single-column layout for notes and watch summaries with hover icon
              actions.
            </FieldDescription>
          </FieldContent>
        </Field>
      </div>
    );
  },
};

export const ZerodhaStyle: Story = {
  name: "Zerodha Style",
  argTypes: actionArgTypes,
  render: (args) => {
    const onAction = args.onAction ?? fallbackOnAction;

    return (
      <div style={stackStyle}>
        <Field style={frameStyle}>
          <FieldLabel>Market Watch (Minimal)</FieldLabel>

          <FieldContent>
            <List
              items={marketRows}
              columns="two"
              size="md"
              secondaryLineSize="xs"
              secondaryLineTone="muted"
              showHoverActions
              hoverActionIds={["view", "edit", "delete"]}
              onAction={onAction}
              aria-label="Zerodha style list"
            />

            <FieldDescription>
              Borderless list with two-line rows, right-aligned values, muted
              secondary line, and red/green value tones with overlay hover
              actions.
            </FieldDescription>
          </FieldContent>
        </Field>
      </div>
    );
  },
};

export const ThreeColumnLayout: Story = {
  name: "Three Column Layout",
  argTypes: actionArgTypes,
  render: (args) => {
    const onAction = args.onAction ?? fallbackOnAction;

    return (
      <div style={stackStyle}>
        <Field style={frameStyle}>
          <FieldLabel>Three Column List</FieldLabel>

          <FieldContent>
            <List
              items={threeColumnRows}
              columns="three"
              size="md"
              secondaryLineSize="xs"
              secondaryLineTone="muted"
              showHoverActions
              hoverActionIds={["view", "edit", "delete"]}
              onAction={onAction}
              aria-label="Three column list"
            />

            <FieldDescription>
              Three-column alignment: left label, centered signal, and right
              value.
            </FieldDescription>
          </FieldContent>
        </Field>
      </div>
    );
  },
};

export const MultiLineRows: Story = {
  name: "Multiple Lines",
  argTypes: actionArgTypes,
  render: (args) => {
    const onAction = args.onAction ?? fallbackOnAction;

    return (
      <div style={stackStyle}>
        <Field style={frameStyle}>
          <FieldLabel>Multi-line Rows</FieldLabel>

          <FieldContent>
            <List
              items={extendedMarketRows}
              columns="two"
              size="md"
              secondaryLineSize="xs"
              secondaryLineTone="muted"
              showHoverActions
              hoverActionIds={["view", "edit", "delete"]}
              onAction={onAction}
              aria-label="Multi line market list"
            />

            <FieldDescription>
              Supports two-line and multi-line layouts per row without adding
              card borders or background blocks.
            </FieldDescription>
          </FieldContent>
        </Field>
      </div>
    );
  },
};

export const CollapsibleRows: Story = {
  name: "Collapsible Rows",
  argTypes: actionArgTypes,
  render: (args) => {
    const onAction = args.onAction ?? fallbackOnAction;

    return (
      <div style={stackStyle}>
        <Field style={frameStyle}>
          <FieldLabel>Collapsible Market Rows</FieldLabel>

          <FieldContent>
            <List
              items={extendedMarketRows}
              columns="two"
              size="md"
              secondaryLineSize="xs"
              secondaryLineTone="muted"
              collapsible
              defaultCollapsed
              showCollapseIndicator
              showHoverActions
              hoverActionIds={["view", "edit", "delete"]}
              onAction={onAction}
              aria-label="Collapsible market list"
            />

            <FieldDescription>
              Toggle each row to expand or collapse additional lines. The
              collapse icon stays separate while hover actions appear offset at
              top-right.
            </FieldDescription>
          </FieldContent>
        </Field>
      </div>
    );
  },
};

export const VirtualizedLargeDataset: Story = {
  name: "Virtualized Large Dataset",
  argTypes: actionArgTypes,
  render: (args) => {
    const onAction = args.onAction ?? fallbackOnAction;

    return (
      <div style={stackStyle}>
        <Field style={frameStyle}>
          <FieldLabel>Large Dataset (TanStack Virtual)</FieldLabel>

          <FieldContent>
            <List
              items={virtualizedRows}
              columns="two"
              size="sm"
              secondaryLineSize="xs"
              secondaryLineTone="muted"
              virtualized
              virtualizedMaxHeight="24rem"
              virtualizedEstimateSize={60}
              virtualizedOverscan={10}
              showHoverActions
              hoverActionIds={["view", "edit", "delete"]}
              onAction={onAction}
              aria-label="Virtualized large market list"
            />

            <FieldDescription>
              Renders 1200 rows with TanStack Virtual so only visible rows are
              mounted, reducing DOM load and scroll jank.
            </FieldDescription>
          </FieldContent>
        </Field>
      </div>
    );
  },
};

export const ListPlayground: StoryObj<ListPlaygroundArgs> = {
  name: "List Playground",
  args: {
    columns: "two",
    size: "md",
    secondaryLineSize: "xs",
    secondaryLineTone: "muted",
    disabled: false,
    rowDivider: true,
    collapsible: false,
    defaultCollapsed: false,
    showCollapseIndicator: true,
    showHoverActions: true,
    virtualized: true,
    virtualizedMaxHeight: "24rem",
    virtualizedEstimateSize: 66,
    virtualizedOverscan: 8,
    hoverActionIds: ["view", "edit", "delete"] satisfies ListHoverActionId[],
    withAction: true,
    dataset: "two",
    emptyText: "No data available.",
  },
  argTypes: {
    columns: {
      control: "inline-radio",
      options: ["auto", "one", "two", "three"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    secondaryLineSize: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    secondaryLineTone: {
      control: "inline-radio",
      options: ["default", "muted", "positive", "negative"],
    },
    dataset: {
      control: "inline-radio",
      options: ["one", "two", "three", "extended", "large"],
    },
    withAction: {
      control: "boolean",
      description:
        "When enabled, row click/keyboard interaction emits onAction context.",
    },
    disabled: { control: "boolean" },
    rowDivider: { control: "boolean" },
    collapsible: { control: "boolean" },
    defaultCollapsed: { control: "boolean" },
    showCollapseIndicator: { control: "boolean" },
    showHoverActions: { control: "boolean" },
    virtualized: { control: "boolean" },
    virtualizedMaxHeight: {
      control: "text",
      description:
        "Viewport max height for virtualization (for example 24rem, 50vh, or 360).",
    },
    virtualizedEstimateSize: {
      control: { type: "number", min: 20, max: 220, step: 1 },
      description: "Estimated row height in pixels for the virtualizer.",
    },
    virtualizedOverscan: {
      control: { type: "number", min: 1, max: 40, step: 1 },
      description: "Extra rows to render above and below the viewport.",
    },
    hoverActionIds: {
      control: "check",
      options: ["view", "edit", "delete"],
    },
    emptyText: { control: "text" },
    onAction: { action: "action" },
    items: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    role: { table: { disable: true } },
  },
  render: (args) => {
    const columns = args.columns ?? "two";
    const size = args.size ?? "md";
    const secondaryLineSize = args.secondaryLineSize ?? "xs";
    const secondaryLineTone = args.secondaryLineTone ?? "muted";
    const rowDivider = args.rowDivider ?? true;
    const disabled = args.disabled ?? false;
    const collapsible = args.collapsible ?? false;
    const defaultCollapsed = args.defaultCollapsed ?? false;
    const showCollapseIndicator = args.showCollapseIndicator ?? true;
    const showHoverActions = args.showHoverActions ?? true;
    const virtualized = args.virtualized ?? false;
    const virtualizedMaxHeight =
      typeof args.virtualizedMaxHeight === "number"
        ? args.virtualizedMaxHeight
        : typeof args.virtualizedMaxHeight === "string" &&
            args.virtualizedMaxHeight.trim() !== ""
          ? args.virtualizedMaxHeight
          : "24rem";
    const virtualizedEstimateSize =
      typeof args.virtualizedEstimateSize === "number" &&
      Number.isFinite(args.virtualizedEstimateSize) &&
      args.virtualizedEstimateSize > 0
        ? args.virtualizedEstimateSize
        : undefined;
    const virtualizedOverscan =
      typeof args.virtualizedOverscan === "number" &&
      Number.isFinite(args.virtualizedOverscan) &&
      args.virtualizedOverscan > 0
        ? Math.round(args.virtualizedOverscan)
        : 8;
    const hoverActionIds =
      args.hoverActionIds != null && args.hoverActionIds.length > 0
        ? (args.hoverActionIds as ListHoverActionId[])
        : (["view", "edit", "delete"] as ListHoverActionId[]);
    const emptyText = args.emptyText ?? "No data available.";
    const dataset = args.dataset ?? "two";
    const withAction = args.withAction ?? true;
    const resolvedOnAction = args.onAction ?? fallbackOnAction;
    const rows = resolveRows(dataset);

    return (
      <div style={stackStyle}>
        <Field style={frameStyle}>
          <FieldLabel>Interactive Playground</FieldLabel>

          <FieldContent>
            <List
              items={rows}
              columns={columns}
              size={size}
              secondaryLineSize={secondaryLineSize}
              secondaryLineTone={secondaryLineTone}
              disabled={disabled}
              rowDivider={rowDivider}
              collapsible={collapsible}
              defaultCollapsed={defaultCollapsed}
              showCollapseIndicator={showCollapseIndicator}
              showHoverActions={showHoverActions}
              virtualized={virtualized}
              virtualizedMaxHeight={virtualizedMaxHeight}
              virtualizedEstimateSize={virtualizedEstimateSize}
              virtualizedOverscan={virtualizedOverscan}
              hoverActionIds={hoverActionIds}
              emptyText={emptyText}
              onAction={withAction ? resolvedOnAction : undefined}
              aria-label="List playground"
            />

            <FieldDescription>
              Configure row density, secondary-line tone, collapsible behavior,
              right-side hover icon actions, separator visibility, and optional
              TanStack Virtual rendering for large datasets.
            </FieldDescription>
          </FieldContent>
        </Field>
      </div>
    );
  },
};
