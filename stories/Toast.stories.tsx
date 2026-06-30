import { useState, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import {
  Button,
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  Toast,
  type ToastActionContext,
  type ToastSize,
  type ToastVariant,
} from "@keytuno/ui-react";

type ToastPlaygroundArgs = {
  variant: ToastVariant;
  size: ToastSize;
  duration: number;
  bottomOffset: number;
  message: string;
  onAction?: (context: ToastActionContext) => void;
  onOpenChange?: (open: boolean) => void;
};

type ToastControlledPlaygroundArgs = ToastPlaygroundArgs & {
  open: boolean;
};

const variantOptions: ToastVariant[] = [
  "default",
  "success",
  "warning",
  "danger",
];
const sizeOptions: ToastSize[] = ["xs", "sm", "md"];

const messageByVariant: Record<ToastVariant, string> = {
  default: "Changes saved",
  success: "Profile updated",
  warning: "Storage almost full",
  danger: "Upload failed",
};

const meta: Meta<typeof Toast> = {
  title: "Feedback/Toast",
  component: Toast,
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
  width: "min(620px, 92vw)",
};

const previewGridStyle: CSSProperties = {
  display: "grid",
  gap: "0.8rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
};

const previewCardStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.45rem",
};

const previewLabelStyle: CSSProperties = {
  margin: 0,
  fontSize: "0.78rem",
  color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
  textTransform: "uppercase",
  letterSpacing: "0.02em",
};

const previewStageStyle: CSSProperties = {
  position: "relative",
  height: "11.5rem",
  border: "1px dashed var(--ktn-border-muted)",
  borderRadius: "0.8rem",
  background:
    "linear-gradient(145deg, color-mix(in srgb, var(--ktn-bg-surface, #ffffff) 90%, #e2e8f0 10%), var(--ktn-bg-surface, #ffffff))",
  overflow: "hidden",
};

const previewHintStyle: CSSProperties = {
  margin: 0,
  fontSize: "0.74rem",
  color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
  position: "absolute",
  insetBlockStart: "0.6rem",
  insetInlineStart: "0.75rem",
};

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.55rem",
  flexWrap: "wrap",
};

export const ToastVariants: Story = {
  name: "Toast Variants",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Variants</h3>

      <div style={previewGridStyle}>
        {variantOptions.map((variant) => (
          <div key={variant} style={previewCardStyle}>
            <p style={previewLabelStyle}>{variant}</p>

            <div style={previewStageStyle}>
              <p style={previewHintStyle}>Bottom-center absolute placement</p>

              <Toast defaultOpen duration={0} size="sm" variant={variant}>
                {messageByVariant[variant]}
              </Toast>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const ToastSizes: Story = {
  name: "Toast Sizes",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Sizes</h3>

      <div style={previewGridStyle}>
        {sizeOptions.map((size) => (
          <div key={size} style={previewCardStyle}>
            <p style={previewLabelStyle}>{size}</p>

            <div style={previewStageStyle}>
              <p style={previewHintStyle}>Bottom-center absolute placement</p>

              <Toast defaultOpen duration={0} size={size} variant="default">
                Toast size {size.toUpperCase()}
              </Toast>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

function TriggeredPlaygroundDemo(args: ToastPlaygroundArgs): JSX.Element {
  const [open, setOpen] = useState(false);
  const [launchId, setLaunchId] = useState(0);

  function handleOpenChange(nextOpen: boolean): void {
    setOpen(nextOpen);
    args.onOpenChange?.(nextOpen);
  }

  function showToast(): void {
    setLaunchId((value) => value + 1);
    setOpen(true);
  }

  return (
    <Field style={frameStyle}>
      <FieldLabel htmlFor="toast-playground-trigger">
        Interactive Playground
      </FieldLabel>

      <FieldContent>
        <div style={rowStyle}>
          <Button
            id="toast-playground-trigger"
            type="button"
            size="sm"
            onClick={showToast}
          >
            Show Toast
          </Button>

          <FieldDescription>
            Click trigger to mount a bottom-center toast with current control
            values.
          </FieldDescription>
        </div>

        <div style={previewStageStyle}>
          <p style={previewHintStyle}>Viewport preview</p>

          <Toast
            key={`${launchId}-${args.variant}-${args.size}-${args.duration}-${args.bottomOffset}`}
            open={open}
            variant={args.variant}
            size={args.size}
            duration={args.duration}
            bottomOffset={args.bottomOffset}
            onOpenChange={handleOpenChange}
            onAction={args.onAction}
          >
            {args.message}
          </Toast>
        </div>
      </FieldContent>
    </Field>
  );
}

function ControlledPlaygroundDemo(
  args: ToastControlledPlaygroundArgs,
): JSX.Element {
  return (
    <Field style={frameStyle}>
      <FieldLabel htmlFor="toast-controlled-playground">
        Controlled Open Playground
      </FieldLabel>

      <FieldContent>
        <FieldDescription>
          Use controls to toggle open state directly while keeping action events
          available.
        </FieldDescription>

        <div id="toast-controlled-playground" style={previewStageStyle}>
          <p style={previewHintStyle}>Viewport preview</p>

          <Toast
            open={args.open}
            variant={args.variant}
            size={args.size}
            duration={args.duration}
            bottomOffset={args.bottomOffset}
            onOpenChange={args.onOpenChange}
            onAction={args.onAction}
          >
            {args.message}
          </Toast>
        </div>
      </FieldContent>
    </Field>
  );
}

export const ToastPlayground: Story = {
  name: "Toast Playground",
  args: {
    variant: "default",
    size: "sm",
    duration: 1800,
    bottomOffset: 20,
    message: "Saved successfully.",
  } as ToastPlaygroundArgs,
  argTypes: {
    variant: {
      control: "select",
      options: variantOptions,
    },
    size: {
      control: "select",
      options: sizeOptions,
    },
    duration: {
      control: { type: "number", min: 0, step: 100 },
    },
    bottomOffset: {
      control: { type: "number", min: 0, step: 2 },
    },
    message: { control: "text" },
    onAction: { action: "action" },
    onOpenChange: { action: "open-change" },
    open: { table: { disable: true } },
    defaultOpen: { table: { disable: true } },
    children: { table: { disable: true } },
    style: { table: { disable: true } },
    className: { table: { disable: true } },
    contentStyle: { table: { disable: true } },
  },
  render: (rawArgs) => (
    <TriggeredPlaygroundDemo {...(rawArgs as ToastPlaygroundArgs)} />
  ),
};

export const ToastControlledPlayground: Story = {
  name: "Toast Controlled Playground",
  args: {
    open: true,
    variant: "success",
    size: "sm",
    duration: 0,
    bottomOffset: 20,
    message: "Controlled toast is visible.",
  } as ToastControlledPlaygroundArgs,
  argTypes: {
    open: { control: "boolean" },
    variant: {
      control: "select",
      options: variantOptions,
    },
    size: {
      control: "select",
      options: sizeOptions,
    },
    duration: {
      control: { type: "number", min: 0, step: 100 },
    },
    bottomOffset: {
      control: { type: "number", min: 0, step: 2 },
    },
    message: { control: "text" },
    onAction: { action: "action" },
    onOpenChange: { action: "open-change" },
    defaultOpen: { table: { disable: true } },
    children: { table: { disable: true } },
    style: { table: { disable: true } },
    className: { table: { disable: true } },
    contentStyle: { table: { disable: true } },
  },
  render: (rawArgs) => (
    <ControlledPlaygroundDemo {...(rawArgs as ToastControlledPlaygroundArgs)} />
  ),
};
