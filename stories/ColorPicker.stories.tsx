import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import {
  ColorPicker,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  type ColorPickerActionContext,
  type ColorPickerProps,
} from "../src/index";

const meta: Meta<typeof ColorPicker> = {
  title: "Forms/ColorPicker",
  component: ColorPicker,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

type ColorPickerPlaygroundArgs = ColorPickerProps;

const stackStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  width: "min(860px, 92vw)",
};

const fieldStyle: CSSProperties = {
  width: "min(560px, 92vw)",
};

const brandSwatches = [
  "#1D4ED8",
  "#2563EB",
  "#3B82F6",
  "#0EA5E9",
  "#14B8A6",
  "#22C55E",
  "#EAB308",
  "#F97316",
  "#EF4444",
  "#A855F7",
];

const compactSwatches = [
  "#111827",
  "#334155",
  "#6B7280",
  "#9CA3AF",
  "#E5E7EB",
  "#FFFFFF",
];

export const Basic: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Basic</h3>

      <Field style={fieldStyle}>
        <FieldLabel>Theme Accent</FieldLabel>

        <FieldContent>
          <ColorPicker
            defaultValue="#2563EB"
            swatches={brandSwatches}
            style={{ width: "100%" }}
          />
          <FieldDescription>
            Choose a primary brand color for UI accents.
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

      <Field style={fieldStyle}>
        <FieldLabel>Detailed</FieldLabel>

        <FieldContent>
          <ColorPicker
            variant="detailed"
            defaultValue="#14B8A6"
            swatches={brandSwatches}
            style={{ width: "100%" }}
          />

          <FieldDescription>
            Detailed variant includes editable hex input and swatch palette.
          </FieldDescription>
        </FieldContent>
      </Field>

      <Field style={fieldStyle}>
        <FieldLabel>Compact</FieldLabel>

        <FieldContent>
          <ColorPicker
            variant="compact"
            defaultValue="#111827"
            swatches={compactSwatches}
            style={{ width: "100%" }}
          />

          <FieldDescription>
            Compact variant keeps inline selection minimal for dense forms.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const WithoutSwatches: Story = {
  name: "Without Swatches",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Without Swatches</h3>

      <Field style={fieldStyle}>
        <FieldLabel>Inline Hex Only</FieldLabel>

        <FieldContent>
          <ColorPicker
            variant="detailed"
            showSwatches={false}
            defaultValue="#2563EB"
            style={{ width: "100%" }}
          />

          <FieldDescription>
            Disable rounded swatches when you only need picker and hex input.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Sizes</h3>

      <FieldGroup style={fieldStyle}>
        {(["xs", "sm", "md", "lg"] as const).map((size) => (
          <Field key={size}>
            <FieldLabel>{size.toUpperCase()} size</FieldLabel>

            <FieldContent>
              <ColorPicker
                size={size}
                defaultValue="#3B82F6"
                swatches={brandSwatches}
                style={{ width: "100%" }}
              />

              <FieldDescription>
                Size {size} adapts control and swatch density.
              </FieldDescription>
            </FieldContent>
          </Field>
        ))}
      </FieldGroup>
    </div>
  ),
};

export const Accessibility: Story = {
  render: () => {
    const descriptionId = "color-picker-accessibility-description";

    return (
      <div style={stackStyle}>
        <h3 style={{ margin: 0 }}>Accessibility</h3>

        <Field required style={fieldStyle}>
          <FieldLabel>Chart Highlight Color</FieldLabel>

          <FieldContent>
            <ColorPicker
              required
              aria-label="Chart highlight color"
              aria-describedby={descriptionId}
              defaultValue="#22C55E"
              swatches={brandSwatches}
              style={{ width: "100%" }}
            />

            <FieldDescription id={descriptionId}>
              Supports keyboard focus, labeled color input, and swatch buttons
              with pressed state for assistive technologies.
            </FieldDescription>
          </FieldContent>
        </Field>
      </div>
    );
  },
};

export const ColorPickerActions: Story = {
  name: "Color Picker Actions",
  args: {
    onAction: undefined,
    onValueChange: undefined,
  },
  argTypes: {
    onAction: {
      action: "action",
      description:
        "Fires for color input updates, hex edits, swatch selection, clear, focus, and blur.",
    },
    onValueChange: {
      action: "value-change",
      description: "Fires when a normalized color value changes.",
    },
  },
  render: (args) => {
    const onAction = args.onAction;

    const handleAction =
      onAction == null
        ? undefined
        : (context: ColorPickerActionContext) => {
            onAction(context);
          };

    return (
      <div style={stackStyle}>
        <h3 style={{ margin: 0 }}>Action Events</h3>

        <Field style={fieldStyle}>
          <FieldLabel>Signal Color</FieldLabel>

          <FieldContent>
            <ColorPicker
              defaultValue="#0EA5E9"
              swatches={brandSwatches}
              onAction={handleAction}
              onValueChange={args.onValueChange}
              style={{ width: "100%" }}
            />

            <FieldDescription>
              Interact with the picker, text input, and swatches to emit
              actions.
            </FieldDescription>
          </FieldContent>
        </Field>
      </div>
    );
  },
};

export const ColorPickerPlayground: Story = {
  name: "Color Picker Playground",
  args: {
    size: "md",
    variant: "detailed",
    disabled: false,
    required: false,
    invalid: false,
    showClear: true,
    showSwatches: true,
    placeholder: "#2563EB",
  } satisfies ColorPickerPlaygroundArgs,
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    variant: {
      control: "inline-radio",
      options: ["compact", "detailed"],
    },
    varient: { table: { disable: true } },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    invalid: { control: "boolean" },
    showClear: { control: "boolean" },
    showSwatches: { control: "boolean" },
    placeholder: { control: "text" },
    swatches: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    onAction: { action: "action" },
    onValueChange: { action: "value-change" },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => (
    <Field
      disabled={args.disabled}
      invalid={args.invalid}
      required={args.required}
      style={fieldStyle}
    >
      <FieldLabel>Interactive Color Picker</FieldLabel>

      <FieldContent>
        <ColorPicker
          key={`${args.size}-${args.variant}-${args.disabled}-${args.required}-${args.invalid}-${args.showClear}-${args.showSwatches}`}
          size={args.size}
          variant={args.variant}
          disabled={args.disabled}
          required={args.required}
          invalid={args.invalid}
          showClear={args.showClear}
          showSwatches={args.showSwatches}
          placeholder={args.placeholder}
          swatches={brandSwatches}
          defaultValue="#2563EB"
          onAction={args.onAction}
          onValueChange={args.onValueChange}
          style={{ width: "100%" }}
        />

        {args.invalid ? (
          <FieldError>Select a valid color value.</FieldError>
        ) : (
          <FieldDescription>
            Playground always emits action and value-change events.
          </FieldDescription>
        )}
      </FieldContent>
    </Field>
  ),
};

export const CompactColorPickerPlayground: Story = {
  name: "Compact Playground",
  args: {
    size: "md",
    variant: "compact",
    disabled: false,
    required: false,
    invalid: false,
    showClear: true,
    showSwatches: true,
    placeholder: "#111827",
  } satisfies ColorPickerPlaygroundArgs,
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    variant: {
      control: "inline-radio",
      options: ["compact", "detailed"],
    },
    varient: { table: { disable: true } },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    invalid: { control: "boolean" },
    showClear: { control: "boolean" },
    showSwatches: { control: "boolean" },
    placeholder: { control: "text" },
    swatches: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    onAction: { action: "action" },
    onValueChange: { action: "value-change" },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => (
    <Field
      disabled={args.disabled}
      invalid={args.invalid}
      required={args.required}
      style={fieldStyle}
    >
      <FieldLabel>Compact Color Picker</FieldLabel>

      <FieldContent>
        <ColorPicker
          key={`compact-${args.size}-${args.variant}-${args.disabled}-${args.required}-${args.invalid}-${args.showClear}-${args.showSwatches}`}
          size={args.size}
          variant={args.variant}
          disabled={args.disabled}
          required={args.required}
          invalid={args.invalid}
          showClear={args.showClear}
          showSwatches={args.showSwatches}
          placeholder={args.placeholder}
          swatches={compactSwatches}
          defaultValue="#334155"
          onAction={args.onAction}
          onValueChange={args.onValueChange}
          style={{ width: "100%" }}
        />

        {args.invalid ? (
          <FieldError>Select a valid compact palette color.</FieldError>
        ) : (
          <FieldDescription>
            Compact playground also emits action and value-change events.
          </FieldDescription>
        )}
      </FieldContent>
    </Field>
  ),
};
