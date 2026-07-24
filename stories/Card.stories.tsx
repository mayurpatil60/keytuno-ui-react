import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import {
  Button,
  Card,
  type CardActionContext,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@keytuno/ui-react";

const meta: Meta<typeof Card> = {
  title: "Data/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const stackStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  width: "min(860px, 92vw)",
};

const cardWidthStyle: CSSProperties = {
  width: "min(560px, 92vw)",
};

export const CardBasic: Story = {
  name: "Card",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Basic Card</h3>
      <Card style={cardWidthStyle}>
        <CardHeader>
          <CardTitle>Portfolio Summary</CardTitle>
          <CardDescription>
            Track today&apos;s movement and portfolio updates.
          </CardDescription>
        </CardHeader>

        <CardContent>
          Your total invested amount is updated every 15 minutes. Open
          performance details to see allocation, trend, and category split.
        </CardContent>

        <CardFooter>
          <Button size="sm" variant="primary">
            View Details
          </Button>
          <Button size="sm" variant="outline">
            Export
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

export const CardSizes: Story = {
  name: "Card Sizes",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Sizes</h3>

      {(["xs", "sm", "md", "lg"] as const).map((size) => (
        <Card key={size} size={size} style={cardWidthStyle}>
          <CardHeader>
            <CardTitle>{size.toUpperCase()} Card</CardTitle>
            <CardDescription>
              Size controls typography and icon scale.
            </CardDescription>
          </CardHeader>
          <CardContent>This card is using size {size}.</CardContent>
        </Card>
      ))}
    </div>
  ),
};

export const CardSpacing: Story = {
  name: "Card Spacing",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Spacing</h3>

      {(["xs", "sm", "md", "lg"] as const).map((spacing) => (
        <Card key={spacing} spacing={spacing} style={cardWidthStyle}>
          <CardHeader>
            <CardTitle>{spacing.toUpperCase()} Spacing</CardTitle>
            <CardDescription>
              Spacing controls section padding and gaps.
            </CardDescription>
          </CardHeader>
          <CardContent>This card is using spacing {spacing}.</CardContent>
        </Card>
      ))}
    </div>
  ),
};

export const CardCollapse: Story = {
  name: "Card Collapse",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Collapsible</h3>
      <Card collapse style={cardWidthStyle}>
        <CardHeader>
          <CardTitle>Market Notifications</CardTitle>
          <CardDescription>
            Chevron appears because collapse is true.
          </CardDescription>
        </CardHeader>

        <CardContent>
          Notifications can include threshold alerts, circuit activity, and
          unusual volume tracking.
        </CardContent>

        <CardFooter>
          <Button size="sm" variant="primary">
            Manage Alerts
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

export const CardActions: Story = {
  name: "Card Actions",
  args: {
    onAction: undefined,
  },
  argTypes: {
    onAction: {
      action: "action",
      description:
        "Fires for card surface clicks and collapse toggle actions with source metadata.",
    },
  },
  render: (args) => {
    const onAction = args.onAction;
    const handleAction =
      onAction == null
        ? undefined
        : (context: CardActionContext) => {
            onAction(context);
          };

    return (
      <div style={stackStyle}>
        <h3 style={{ margin: 0 }}>Card Action Events</h3>
        <Card collapse onAction={handleAction} style={cardWidthStyle}>
          <CardHeader>
            <CardTitle>Alerts Center</CardTitle>
            <CardDescription>
              Click card surface or toggle collapse to emit actions.
            </CardDescription>
          </CardHeader>

          <CardContent>
            This card emits action context from both card surface interaction
            and collapse toggle.
          </CardContent>

          <CardFooter>
            <Button size="sm" variant="secondary">
              Open Alerts
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  },
};

export const CardPlayground: Story = {
  name: "Card Playground",
  args: {
    size: "md",
    spacing: "md",
    collapse: true,
    defaultCollapsed: false,
    withAction: false,
    titleCollapseTrigger: false,
    descriptionCollapseTrigger: false,
  },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    spacing: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    collapse: {
      control: "boolean",
    },
    defaultCollapsed: {
      control: "boolean",
    },
    titleCollapseTrigger: {
      control: "boolean",
      description:
        "Enable collapse toggle when CardTitle is clicked or activated with keyboard.",
    },
    descriptionCollapseTrigger: {
      control: "boolean",
      description:
        "Enable collapse toggle when CardDescription is clicked or activated with keyboard.",
    },
    withAction: {
      control: "boolean",
    },
    onAction: {
      action: "action",
    },
    onCollapseChange: {
      action: "collapse-change",
    },
    onClick: {
      action: "click",
    },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const withAction = args.withAction ?? false;
    const cardInstanceKey = `${args.collapse ? "collapse-on" : "collapse-off"}-${args.defaultCollapsed ? "default-collapsed" : "default-expanded"}`;

    return (
      <Card
        key={cardInstanceKey}
        size={args.size}
        spacing={args.spacing}
        collapse={args.collapse}
        defaultCollapsed={args.defaultCollapsed}
        onAction={withAction ? args.onAction : undefined}
        onCollapseChange={withAction ? args.onCollapseChange : undefined}
        onClick={withAction ? args.onClick : undefined}
        style={cardWidthStyle}
      >
        <CardHeader>
          <CardTitle collapseTrigger={args.titleCollapseTrigger}>
            Card Playground
          </CardTitle>
          <CardDescription collapseTrigger={args.descriptionCollapseTrigger}>
            Try size, spacing, collapse, trigger and action controls.
          </CardDescription>
        </CardHeader>

        <CardContent>
          This content and footer will hide when the card is collapsed via the
          chevron, title, or description trigger.
        </CardContent>

        <CardFooter>
          <Button size="sm" variant="primary">
            Save
          </Button>
        </CardFooter>
      </Card>
    );
  },
};
