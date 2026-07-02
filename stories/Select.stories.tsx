import { useState, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import {
  Select,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  type SelectGroup,
  type SelectOption,
  type SelectValue,
} from "@keytuno/ui-react";

const meta: Meta<typeof Select> = {
  title: "Forms/Select",
  component: Select,
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

const frameStyle: CSSProperties = {
  width: "min(560px, 92vw)",
};

const frameworkOptions: SelectOption[] = [
  { value: "nextjs", label: "Next.js", keywords: ["react", "ssr"] },
  { value: "react", label: "React", keywords: ["spa", "ui"] },
  { value: "svelte", label: "SvelteKit", keywords: ["svelte"] },
  { value: "nuxt", label: "Nuxt", keywords: ["vue"] },
  { value: "astro", label: "Astro", keywords: ["content", "islands"] },
];

const groupedItems: SelectGroup[] = [
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
      { value: "autonifty", label: "NIFTY AUTO" },
    ],
  },
];

const customItems: SelectOption[] = [
  {
    value: "pro",
    label: "Pro Plan",
    description: "Advanced analytics and priority alerts",
  },
  {
    value: "growth",
    label: "Growth Plan",
    description: "Portfolio tracking and strategy templates",
  },
  {
    value: "starter",
    label: "Starter Plan",
    description: "Essential watchlist and order management",
  },
];

const LARGE_GROUP_COUNT = 8;
const LARGE_OPTIONS_PER_GROUP = 40;

const largeDataGroups: SelectGroup[] = Array.from(
  { length: LARGE_GROUP_COUNT },
  (_, groupIndex) => ({
    label: `Universe ${groupIndex + 1}`,
    options: Array.from(
      { length: LARGE_OPTIONS_PER_GROUP },
      (_, optionIndex) => {
        const sequence = groupIndex * LARGE_OPTIONS_PER_GROUP + optionIndex + 1;

        return {
          value: `instrument-${sequence}`,
          label: `Instrument ${String(sequence).padStart(3, "0")}`,
          description: `Bucket ${groupIndex + 1}`,
          keywords: [`group-${groupIndex + 1}`, `instrument-${sequence}`],
        };
      },
    ),
  }),
);

function MultipleDemo(): JSX.Element {
  const [value, setValue] = useState<SelectValue>(["nextjs", "react"]);

  return (
    <div style={{ ...stackStyle, gap: "0.6rem" }}>
      <Field style={frameStyle}>
        <FieldLabel>Frameworks</FieldLabel>

        <FieldContent>
          <Select
            multiple
            showClear
            options={frameworkOptions}
            value={value}
            onValueChange={setValue}
            placeholder="Select frameworks"
            style={{ width: "100%" }}
          />

          <FieldDescription>
            Selected:{" "}
            {Array.isArray(value) && value.length > 0
              ? value.join(", ")
              : "none"}
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  );
}

export const Basic: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Basic</h3>

      <Field style={frameStyle}>
        <FieldLabel>Framework</FieldLabel>

        <FieldContent>
          <Select
            options={frameworkOptions}
            placeholder="Select framework"
            style={{ width: "100%" }}
          />
          <FieldDescription>
            Pick the primary stack used in your project.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Multiple: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Multiple</h3>
      <MultipleDemo />
    </div>
  ),
};

export const ClearButton: Story = {
  name: "Clear Button",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Clear Button</h3>

      <Field style={frameStyle}>
        <FieldLabel>Framework</FieldLabel>

        <FieldContent>
          <Select
            options={frameworkOptions}
            defaultValue="nextjs"
            showClear
            placeholder="Choose framework"
            style={{ width: "100%" }}
          />
          <FieldDescription>
            Use the clear icon to reset the selection.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Groups: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Groups</h3>

      <Field style={frameStyle}>
        <FieldLabel>Market Index</FieldLabel>

        <FieldContent>
          <Select
            groups={groupedItems}
            placeholder="Select index"
            style={{ width: "100%" }}
          />
          <FieldDescription>
            Grouped options help organize large watchlists.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const CustomItems: Story = {
  name: "Custom Items",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Custom Items</h3>

      <Field style={frameStyle}>
        <FieldLabel>Subscription Plan</FieldLabel>

        <FieldContent>
          <Select
            options={customItems}
            placeholder="Select plan"
            style={{ width: "100%" }}
            renderItem={(item, state) => (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  minWidth: 0,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: "0.5rem",
                    height: "0.5rem",
                    borderRadius: "999px",
                    backgroundColor: state.selected
                      ? "var(--ktn-action-primary-bg)"
                      : "var(--ktn-border-muted)",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    display: "inline-flex",
                    flexDirection: "column",
                    gap: "0.1rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--ktn-text-primary)",
                    }}
                  >
                    {item.label}
                  </span>
                  {item.description != null ? (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--ktn-text-secondary)",
                      }}
                    >
                      {item.description}
                    </span>
                  ) : null}
                </span>
              </span>
            )}
          />
          <FieldDescription>
            Custom rendering can add metadata in each option row.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Invalid</h3>

      <Field invalid required style={frameStyle}>
        <FieldLabel>Framework</FieldLabel>

        <FieldContent>
          <Select
            required
            invalid
            options={frameworkOptions}
            placeholder="Please select a framework"
            style={{ width: "100%" }}
          />
          <FieldError>This field is required.</FieldError>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Disabled</h3>

      <Field disabled style={frameStyle}>
        <FieldLabel>Framework</FieldLabel>

        <FieldContent>
          <Select
            disabled
            options={frameworkOptions}
            defaultValue="react"
            placeholder="Select framework"
            style={{ width: "100%" }}
          />
          <FieldDescription>
            Selection is disabled for this account tier.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const LargeDataScrollbar: Story = {
  name: "Large Data Scrollbar",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Large Data Scrollbar</h3>

      <Field style={frameStyle}>
        <FieldLabel>Large Instrument Universe</FieldLabel>

        <FieldContent>
          <Select
            groups={largeDataGroups}
            showClear
            placeholder="Search 320 instruments"
            searchPlaceholder="Search by instrument or bucket"
            style={{ width: "100%" }}
          />

          <FieldDescription>
            Dedicated scrollbar stress story with 320 grouped options. Open the
            panel and scroll to validate themed scrollbar behavior.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const SelectPlayground: Story = {
  name: "Select Playground",
  args: {
    size: "md",
    disabled: false,
    required: false,
    invalid: false,
    multiple: false,
    showClear: true,
    placeholder: "Select framework",
    searchPlaceholder: "Search framework...",
    emptyText: "No frameworks found.",
    withAction: false,
  },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    invalid: { control: "boolean" },
    multiple: { control: "boolean" },
    showClear: { control: "boolean" },
    placeholder: { control: "text" },
    searchPlaceholder: { control: "text" },
    emptyText: { control: "text" },
    withAction: { control: "boolean" },
    onAction: { action: "action" },
    onValueChange: { action: "value-change" },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    options: { table: { disable: true } },
    groups: { table: { disable: true } },
    renderItem: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const withAction = args.withAction ?? false;

    return (
      <Field
        disabled={args.disabled}
        invalid={args.invalid}
        required={args.required}
        style={frameStyle}
      >
        <FieldLabel>Framework</FieldLabel>

        <FieldContent>
          <Select
            key={`${args.size}-${args.disabled}-${args.required}-${args.invalid}-${args.multiple}-${args.showClear}-${withAction}`}
            size={args.size}
            disabled={args.disabled}
            required={args.required}
            invalid={args.invalid}
            multiple={args.multiple}
            showClear={args.showClear}
            placeholder={args.placeholder}
            searchPlaceholder={args.searchPlaceholder}
            emptyText={args.emptyText}
            options={frameworkOptions}
            defaultValue={args.multiple ? ["nextjs", "react"] : "nextjs"}
            onAction={withAction ? args.onAction : undefined}
            onValueChange={withAction ? args.onValueChange : undefined}
            style={{ width: "100%" }}
          />

          {args.invalid ? (
            <FieldError>Choose at least one framework.</FieldError>
          ) : (
            <FieldDescription>
              Adjust props from controls to test behavior.
            </FieldDescription>
          )}
        </FieldContent>
      </Field>
    );
  },
};
