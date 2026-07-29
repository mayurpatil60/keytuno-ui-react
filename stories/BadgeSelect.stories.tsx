import { useState, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import {
  BadgeSelect,
  type BadgeSelectGroup,
  type BadgeSelectOption,
  type BadgeSelectValue,
} from "../src/index";

const meta: Meta<typeof BadgeSelect> = {
  title: "Feedback/BadgeSelect",
  component: BadgeSelect,
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

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  flexWrap: "wrap",
  gap: "1rem",
};

const options: BadgeSelectOption[] = [
  { value: "equity", label: "Equity" },
  { value: "futures", label: "Futures" },
  { value: "options", label: "Options" },
  { value: "currency", label: "Currency" },
  { value: "commodity", label: "Commodity" },
];

const groupedOptions: BadgeSelectGroup[] = [
  {
    label: "Popular",
    options: [
      { value: "banknifty", label: "BANKNIFTY" },
      { value: "nifty50", label: "NIFTY 50" },
    ],
  },
  {
    label: "Sector",
    options: [
      { value: "finnifty", label: "FINNIFTY" },
      { value: "itnifty", label: "NIFTY IT" },
      { value: "autonifty", label: "NIFTY AUTO", disabled: true },
    ],
  },
];

function MultipleDemo(): JSX.Element {
  const [value, setValue] = useState<BadgeSelectValue>(["equity", "options"]);

  return (
    <div style={{ ...stackStyle, gap: "0.6rem" }}>
      <BadgeSelect
        multiple
        options={options}
        value={value}
        onValueChange={setValue}
      >
        Strategy
      </BadgeSelect>

      <span
        style={{
          fontSize: "0.8125rem",
          color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
        }}
      >
        Selected:{" "}
        {Array.isArray(value) && value.length > 0 ? value.join(", ") : "none"}
      </span>
    </div>
  );
}

export const Basic: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Basic</h3>
      <BadgeSelect options={options}>Market</BadgeSelect>
    </div>
  ),
};

export const PanelVariants: Story = {
  name: "Panel Variants",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Panel Variants</h3>

      <div style={rowStyle}>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <span
            style={{
              fontSize: "0.8125rem",
              color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
            }}
          >
            Inline panel
          </span>
          <BadgeSelect dropdownVariant="inline" options={options}>
            Segment
          </BadgeSelect>
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <span
            style={{
              fontSize: "0.8125rem",
              color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
            }}
          >
            Overlay panel
          </span>
          <BadgeSelect dropdownVariant="overlay" options={options}>
            Instrument
          </BadgeSelect>
        </div>
      </div>
    </div>
  ),
};

export const GroupsAndMultiple: Story = {
  name: "Groups and Multiple",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Groups and Multiple</h3>

      <div style={rowStyle}>
        <BadgeSelect groups={groupedOptions} placeholder="Select index">
          Index
        </BadgeSelect>

        <MultipleDemo />
      </div>
    </div>
  ),
};

export const BadgeSelectPlayground: Story = {
  name: "BadgeSelect Playground",
  args: {
    children: "Category",
    variant: "primary",
    size: "md",
    dropdownVariant: "inline",
    side: "bottom",
    sideOffset: 0,
    multiple: false,
    showSelectedValue: true,
    disabled: false,
    required: false,
    invalid: false,
    placeholder: "Select category",
    emptyText: "No categories found.",
    withBadgeAction: false,
    withSelectAction: false,
  },
  argTypes: {
    children: { control: "text" },
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "success",
        "warning",
        "accent",
        "destructive",
        "outline",
        "ghost",
        "link",
      ],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    dropdownVariant: {
      control: "inline-radio",
      options: ["inline", "overlay"],
    },
    side: {
      control: "select",
      options: ["auto", "left", "top", "bottom", "right"],
    },
    sideOffset: {
      control: { type: "number", min: 0, max: 16, step: 1 },
    },
    multiple: { control: "boolean" },
    showSelectedValue: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    invalid: { control: "boolean" },
    placeholder: { control: "text" },
    emptyText: { control: "text" },
    withBadgeAction: { control: "boolean" },
    withSelectAction: { control: "boolean" },
    onAction: { action: "badge-action" },
    onSelectAction: { action: "select-action" },
    onValueChange: { action: "value-change" },
    options: { table: { disable: true } },
    groups: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    panelStyle: { table: { disable: true } },
    containerStyle: { table: { disable: true } },
    renderItem: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const withBadgeAction = args.withBadgeAction ?? false;
    const withSelectAction = args.withSelectAction ?? false;

    return (
      <BadgeSelect
        key={`${args.size}-${args.variant}-${args.dropdownVariant}-${args.side}-${args.sideOffset}-${args.multiple}-${args.showSelectedValue}-${args.disabled}-${args.required}-${args.invalid}`}
        variant={args.variant}
        size={args.size}
        dropdownVariant={args.dropdownVariant}
        side={args.side}
        sideOffset={args.sideOffset}
        multiple={args.multiple}
        showSelectedValue={args.showSelectedValue}
        disabled={args.disabled}
        required={args.required}
        invalid={args.invalid}
        placeholder={args.placeholder}
        emptyText={args.emptyText}
        options={options}
        defaultValue={args.multiple ? ["equity", "options"] : "equity"}
        onAction={withBadgeAction ? args.onAction : undefined}
        onSelectAction={withSelectAction ? args.onSelectAction : undefined}
        onValueChange={withSelectAction ? args.onValueChange : undefined}
      >
        {args.children}
      </BadgeSelect>
    );
  },
};
