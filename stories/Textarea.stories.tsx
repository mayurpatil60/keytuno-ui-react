import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Textarea,
} from "@keytuno/ui-react";

const meta: Meta<typeof Textarea> = {
  title: "Forms/Textarea",
  component: Textarea,
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

export const Basic: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Basic</h3>

      <Field style={frameStyle}>
        <FieldLabel htmlFor="textarea-basic-notes">Notes</FieldLabel>

        <FieldContent>
          <Textarea
            id="textarea-basic-notes"
            placeholder="Write your strategy notes here"
            defaultValue="Watch breakout confirmation near day-high."
          />
          <FieldDescription>
            Use textarea for multi-line user input.
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

      <FieldGroup style={frameStyle}>
        <Field>
          <FieldLabel htmlFor="textarea-size-xs">Extra Small</FieldLabel>

          <FieldContent>
            <Textarea
              id="textarea-size-xs"
              size="xs"
              placeholder="XS textarea"
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="textarea-size-sm">Small</FieldLabel>

          <FieldContent>
            <Textarea
              id="textarea-size-sm"
              size="sm"
              placeholder="SM textarea"
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="textarea-size-md">Medium</FieldLabel>

          <FieldContent>
            <Textarea
              id="textarea-size-md"
              size="md"
              placeholder="MD textarea"
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="textarea-size-lg">Large</FieldLabel>

          <FieldContent>
            <Textarea
              id="textarea-size-lg"
              size="lg"
              placeholder="LG textarea"
            />
          </FieldContent>
        </Field>
      </FieldGroup>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Disabled</h3>

      <Field disabled style={frameStyle}>
        <FieldLabel htmlFor="textarea-disabled-bio">Bio</FieldLabel>

        <FieldContent>
          <Textarea
            id="textarea-disabled-bio"
            disabled
            defaultValue="This profile is synced from organization settings."
          />
          <FieldDescription>
            Textarea is read-only when disabled.
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
        <FieldLabel htmlFor="textarea-invalid-comment">Comment</FieldLabel>

        <FieldContent>
          <Textarea
            id="textarea-invalid-comment"
            required
            invalid
            placeholder="Enter at least 20 characters"
            defaultValue="Too short"
          />
          <FieldError>Please provide a more detailed comment.</FieldError>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const TextareaPlayground: Story = {
  name: "Textarea Playground",
  args: {
    size: "md",
    disabled: false,
    required: false,
    invalid: false,
    rows: 4,
    placeholder: "Write details here...",
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
    rows: {
      control: "number",
    },
    placeholder: { control: "text" },
    withAction: { control: "boolean" },
    onAction: { action: "action" },
    onChange: { action: "change" },
    onFocus: { action: "focus" },
    onBlur: { action: "blur" },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const withAction = args.withAction ?? false;

    return (
      <Field
        invalid={args.invalid}
        required={args.required}
        disabled={args.disabled}
        style={frameStyle}
      >
        <FieldLabel htmlFor="textarea-playground">Playground</FieldLabel>

        <FieldContent>
          <Textarea
            id="textarea-playground"
            key={`${args.size}-${args.disabled}-${args.required}-${args.invalid}-${args.rows}-${withAction}`}
            size={args.size}
            disabled={args.disabled}
            required={args.required}
            invalid={args.invalid}
            rows={args.rows}
            placeholder={args.placeholder}
            onAction={withAction ? args.onAction : undefined}
            onChange={withAction ? args.onChange : undefined}
            onFocus={withAction ? args.onFocus : undefined}
            onBlur={withAction ? args.onBlur : undefined}
          />

          {args.invalid ? (
            <FieldError>Textarea content is invalid.</FieldError>
          ) : (
            <FieldDescription>
              Use controls to test textarea size and states.
            </FieldDescription>
          )}
        </FieldContent>
      </Field>
    );
  },
};
