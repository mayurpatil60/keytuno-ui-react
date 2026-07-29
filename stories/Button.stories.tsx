import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  FiBell,
  FiDownload,
  FiEdit3,
  FiPlus,
  FiSearch,
  FiSettings,
  FiTrash2,
} from "react-icons/fi";

import { Button, Spinner } from "../src/index";

const meta: Meta<typeof Button> = {
  title: "Actions/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const galleryStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "0.75rem",
  width: "min(860px, 92vw)",
};

const stackStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  width: "min(860px, 92vw)",
};

export const ButtonVariants: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Variants</h3>
      <div style={galleryStyle}>
        <Button variant="primary">Primary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="success">Success</Button>
        <Button variant="warning">Warning</Button>
        <Button variant="accent">Accent</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
        <Button variant="secondary" compact>
          Compact Config
        </Button>
      </div>
    </div>
  ),
};

export const ButtonSizes: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Sizes</h3>
      <div style={galleryStyle}>
        <Button size="xs">Extra Small</Button>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
    </div>
  ),
};

export const ButtonIcon: Story = {
  name: "Button Icon",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Icon Buttons</h3>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Button size="md" variant="primary" aria-label="New">
          <FiPlus aria-hidden size={14} />
        </Button>

        <Button size="md" variant="outline" aria-label="Search">
          <FiSearch aria-hidden size={14} />
        </Button>

        <Button size="md" variant="secondary" aria-label="Export">
          <FiDownload aria-hidden size={14} />
        </Button>

        <Button size="md" variant="ghost" aria-label="Settings">
          <FiSettings aria-hidden size={14} />
        </Button>

        <Button size="md" variant="destructive" aria-label="Alerts">
          <FiBell aria-hidden size={14} />
        </Button>
      </div>

      <h3 style={{ margin: 0 }}>Icon Color Only</h3>
      <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
        <Button
          size="sm"
          variant="primary"
          compact
          iconOnly
          iconOnlyTone
          aria-label="Edit"
        >
          <FiEdit3 aria-hidden size={13} />
        </Button>

        <Button
          size="sm"
          variant="destructive"
          compact
          iconOnly
          iconOnlyTone
          aria-label="Delete"
        >
          <FiTrash2 aria-hidden size={13} />
        </Button>

        <Button
          size="sm"
          variant="secondary"
          compact
          iconOnly
          iconColor="var(--ktn-button-warning-bg, #f59e0b)"
          aria-label="Custom"
        >
          <FiSettings aria-hidden size={13} />
        </Button>
      </div>
    </div>
  ),
};

export const CompactButtons: Story = {
  name: "Compact Buttons",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Compact Buttons</h3>

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <Button
          size="sm"
          variant="secondary"
          compact
          aria-label="Create"
          tooltip="Create"
        >
          <FiPlus aria-hidden size={13} />
        </Button>
        <Button
          size="sm"
          variant="outline"
          compact
          aria-label="Search"
          tooltip="Search"
        >
          <FiSearch aria-hidden size={13} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          compact
          aria-label="Download"
          tooltip="Download"
        >
          <FiDownload aria-hidden size={13} />
        </Button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <Button size="sm" variant="secondary" compact tooltip="Add record">
          <FiPlus aria-hidden size={13} />
          <span>Add</span>
        </Button>
        <Button size="sm" variant="primary" compact tooltip="Search records">
          <FiSearch aria-hidden size={13} />
          <span>Find</span>
        </Button>
        <Button size="sm" variant="destructive" compact>
          <FiSettings aria-hidden size={13} />
          <span>Config</span>
        </Button>
      </div>
    </div>
  ),
};

export const ButtonIconPlayground: Story = {
  name: "Button Icon Playground",
  args: {
    variant: "primary",
    size: "md",
    compact: false,
    iconOnly: true,
    iconOnlyTone: true,
    iconColor: "",
    tooltip: "Icon action tooltip",
    tooltipSide: "auto",
    tooltipSize: "sm",
    tooltipDisabled: false,
    tooltipOpenDelay: 120,
    tooltipCloseDelay: 70,
    disabled: false,
    type: "button",
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "outline",
        "secondary",
        "success",
        "warning",
        "accent",
        "ghost",
        "destructive",
        "link",
      ],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    compact: { control: "boolean" },
    iconOnly: { control: "boolean" },
    iconOnlyTone: { control: "boolean" },
    iconColor: { control: "text" },
    tooltip: { control: "text" },
    tooltipSide: {
      control: "select",
      options: ["auto", "left", "top", "bottom", "right"],
    },
    tooltipSize: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    tooltipDisabled: { control: "boolean" },
    tooltipOpenDelay: {
      control: { type: "number", min: 0, step: 10 },
    },
    tooltipCloseDelay: {
      control: { type: "number", min: 0, step: 10 },
    },
    disabled: { control: "boolean" },
    type: { control: "select", options: ["button", "submit", "reset"] },
    children: { table: { disable: true } },
    onClick: { action: "click" },
    onAction: { action: "action" },
    style: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  render: (args) => {
    const size = args.size ?? "md";

    return (
      <div style={{ display: "inline-flex" }}>
        <Button
          variant={args.variant}
          size={size}
          compact={args.compact}
          iconOnly={args.iconOnly}
          iconOnlyTone={args.iconOnlyTone}
          iconColor={
            typeof args.iconColor === "string" && args.iconColor.trim() !== ""
              ? args.iconColor
              : undefined
          }
          tooltip={args.tooltip}
          tooltipSide={args.tooltipSide}
          tooltipSize={args.tooltipSize}
          tooltipDisabled={args.tooltipDisabled}
          tooltipOpenDelay={args.tooltipOpenDelay}
          tooltipCloseDelay={args.tooltipCloseDelay}
          disabled={args.disabled}
          type={args.type}
          aria-label="Icon action"
          onClick={args.onClick}
          onAction={args.onAction}
        >
          <FiPlus aria-hidden size={14} />
        </Button>
      </div>
    );
  },
};

export const ButtonWithIcon: Story = {
  name: "Button With Icon",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>With Icon</h3>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Button size="md" variant="primary">
          <FiPlus aria-hidden size={14} />
          <span>Create</span>
        </Button>

        <Button size="md" variant="secondary" disabled aria-busy>
          <Spinner size="sm" />
          <span>Loading</span>
        </Button>
      </div>
    </div>
  ),
};

export const ButtonWithIconPlayground: Story = {
  name: "Button With Icon Playground",
  args: {
    children: "Create",
    variant: "primary",
    size: "md",
    compact: false,
    disabled: false,
    type: "button",
  },
  argTypes: {
    children: { control: "text" },
    variant: {
      control: "select",
      options: [
        "primary",
        "outline",
        "secondary",
        "success",
        "warning",
        "accent",
        "ghost",
        "destructive",
        "link",
      ],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    compact: { control: "boolean" },
    disabled: { control: "boolean" },
    type: { control: "select", options: ["button", "submit", "reset"] },
    onClick: { action: "click" },
    onAction: { action: "action" },
    style: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  render: (args) => {
    const size = args.size ?? "md";
    const label = typeof args.children === "string" ? args.children : "Create";

    return (
      <div style={{ display: "inline-flex" }}>
        <Button
          variant={args.variant}
          size={size}
          compact={args.compact}
          disabled={args.disabled}
          type={args.type}
          onClick={args.onClick}
          onAction={args.onAction}
        >
          <FiPlus aria-hidden size={14} />
          <span>{label}</span>
        </Button>
      </div>
    );
  },
};

export const ButtonPlayground: Story = {
  name: "Button Playground",
  args: {
    children: "Playground Button",
    variant: "primary",
    size: "md",
    compact: false,
    disabled: false,
    type: "button",
  },
  argTypes: {
    children: { control: "text" },
    variant: {
      control: "select",
      options: [
        "primary",
        "outline",
        "secondary",
        "success",
        "warning",
        "accent",
        "ghost",
        "destructive",
        "link",
      ],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    compact: { control: "boolean" },
    disabled: { control: "boolean" },
    type: { control: "select", options: ["button", "submit", "reset"] },
    onClick: { action: "click" },
    onAction: { action: "action" },
    style: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  render: (args) => {
    const size = args.size ?? "md";
    const label =
      typeof args.children === "string" ? args.children : "Playground Button";

    return (
      <div style={{ display: "inline-flex" }}>
        <Button
          variant={args.variant}
          size={size}
          compact={args.compact}
          disabled={args.disabled}
          type={args.type}
          onClick={args.onClick}
          onAction={args.onAction}
        >
          {label}
        </Button>
      </div>
    );
  },
};
