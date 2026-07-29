import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FiAtSign, FiSearch, FiSend } from "react-icons/fi";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from "../src/index";

const meta: Meta<typeof InputGroup> = {
  title: "Forms/InputGroup",
  component: InputGroup,
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

const addonTextStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  whiteSpace: "nowrap",
};

export const InlineStart: Story = {
  name: "Inline Start",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Inline Start</h3>

      <Field style={frameStyle}>
        <FieldLabel htmlFor="input-group-inline-start">Search</FieldLabel>

        <FieldContent>
          <InputGroup>
            <InputGroupInput
              id="input-group-inline-start"
              type="search"
              placeholder="Search symbol or company"
            />
            <InputGroupAddon>
              <FiSearch size={14} />
            </InputGroupAddon>
          </InputGroup>

          <FieldDescription>
            Default alignment places addon at inline start.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const InlineEnd: Story = {
  name: "Inline End",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Inline End</h3>

      <FieldGroup style={frameStyle}>
        <Field>
          <FieldLabel htmlFor="input-group-inline-end-url">Website</FieldLabel>

          <FieldContent>
            <InputGroup variant="outline" align="inline-end">
              <InputGroupInput
                id="input-group-inline-end-url"
                placeholder="https://example.com"
              />
              <InputGroupAddon>
                <InputGroupButton type="button" variant="secondary">
                  Visit
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>

            <FieldDescription>
              Buttons and addons can be aligned at inline end.
            </FieldDescription>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="input-group-inline-end-email">Email</FieldLabel>

          <FieldContent>
            <InputGroup variant="secondary" align="inline-end">
              <InputGroupInput
                id="input-group-inline-end-email"
                type="email"
                placeholder="name@example.com"
              />
              <InputGroupAddon>
                <span style={addonTextStyle}>
                  <FiAtSign size={13} />
                  verified
                </span>
              </InputGroupAddon>
            </InputGroup>
          </FieldContent>
        </Field>
      </FieldGroup>
    </div>
  ),
};

export const BlockLayout: Story = {
  name: "Block Layout",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Block Layout</h3>

      <Field style={frameStyle}>
        <FieldLabel htmlFor="input-group-textarea">Notes</FieldLabel>

        <FieldContent>
          <InputGroup variant="secondary" align="block-end" size="md">
            <InputGroupTextarea
              id="input-group-textarea"
              placeholder="Write release notes for this deployment"
              defaultValue="Highlights:\n- New input group component\n- Added Field examples"
            />
            <InputGroupAddon>
              <span style={addonTextStyle}>0/280</span>
              <InputGroupButton type="button" variant="primary">
                <span style={addonTextStyle}>
                  <FiSend size={13} />
                  Send
                </span>
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>

          <FieldDescription>
            Use block-end for textarea footers and actions.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>States</h3>

      <Field required style={frameStyle}>
        <FieldLabel htmlFor="input-group-required">Required Value</FieldLabel>

        <FieldContent>
          <InputGroup required variant="primary" align="inline-end">
            <InputGroupInput
              id="input-group-required"
              placeholder="Enter ticker symbol"
            />
            <InputGroupAddon>
              <InputGroupButton type="button">Check</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>

          <FieldError>This value is required.</FieldError>
        </FieldContent>
      </Field>

      <Field disabled style={frameStyle}>
        <FieldLabel htmlFor="input-group-disabled">Disabled Group</FieldLabel>

        <FieldContent>
          <InputGroup disabled variant="outline" align="inline-start">
            <InputGroupInput
              id="input-group-disabled"
              defaultValue="KTN-ACCT-0021"
              placeholder="Account ID"
            />
            <InputGroupAddon>
              <FiSearch size={14} />
            </InputGroupAddon>
          </InputGroup>

          <FieldDescription>
            The full group can be locked using disabled state.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const InputGroupPlayground: Story = {
  name: "InputGroup Playground",
  args: {
    variant: "primary",
    size: "md",
    align: "inline-start",
    disabled: false,
    required: false,
    withAction: false,
  },
  argTypes: {
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
    align: {
      control: "inline-radio",
      options: ["inline-start", "inline-end", "block-start", "block-end"],
    },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    withAction: { control: "boolean" },
    onAction: { action: "action" },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const withAction = args.withAction ?? false;
    const useTextarea =
      args.align === "block-start" || args.align === "block-end";

    return (
      <Field
        disabled={args.disabled}
        required={args.required}
        style={frameStyle}
      >
        <FieldLabel htmlFor="input-group-playground">
          Group Playground
        </FieldLabel>

        <FieldContent>
          <InputGroup
            key={`${args.variant}-${args.size}-${args.align}-${args.disabled}-${args.required}`}
            variant={args.variant}
            size={args.size}
            align={args.align}
            disabled={args.disabled}
            required={args.required}
            onAction={withAction ? args.onAction : undefined}
          >
            {useTextarea ? (
              <InputGroupTextarea
                id="input-group-playground"
                placeholder="Write your notes here..."
                defaultValue="Preview content"
              />
            ) : (
              <InputGroupInput
                id="input-group-playground"
                placeholder="Type a value"
                type="text"
              />
            )}

            <InputGroupAddon>
              {useTextarea ? (
                <InputGroupButton type="button">Publish</InputGroupButton>
              ) : (
                <span style={addonTextStyle}>
                  <FiSearch size={13} />
                  Lookup
                </span>
              )}
            </InputGroupAddon>
          </InputGroup>

          {args.required ? (
            <FieldError>This field is required.</FieldError>
          ) : (
            <FieldDescription>
              Adjust variant, size, and align to preview grouped input layouts.
            </FieldDescription>
          )}
        </FieldContent>
      </Field>
    );
  },
};
