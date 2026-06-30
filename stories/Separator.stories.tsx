import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import {
  Badge,
  Button,
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Separator,
} from "@keytuno/ui-react";

const meta: Meta<typeof Separator> = {
  title: "Layout/Separator",
  component: Separator,
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

const menuItemTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "0.875rem",
  color: "var(--ktn-text-primary)",
  fontWeight: 500,
};

const menuItemDescriptionStyle: CSSProperties = {
  margin: 0,
  fontSize: "0.78rem",
  color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
};

export const Vertical: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Vertical</h3>

      <Field style={frameStyle}>
        <FieldLabel>Quick Links</FieldLabel>

        <FieldContent>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid var(--ktn-border-muted)",
              borderRadius: "var(--ktn-radius-md, 0.5rem)",
              padding: "0.35rem",
              gap: "0.45rem",
            }}
          >
            <Button variant="ghost" size="sm" style={{ minHeight: "1.9rem" }}>
              Blog
            </Button>
            <Separator orientation="vertical" size="md" />
            <Button variant="ghost" size="sm" style={{ minHeight: "1.9rem" }}>
              Docs
            </Button>
            <Separator orientation="vertical" size="md" />
            <Button variant="ghost" size="sm" style={{ minHeight: "1.9rem" }}>
              Source
            </Button>
          </div>

          <FieldDescription>
            Use vertical separators for dense inline navigation.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Menu: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Menu</h3>

      <Field style={frameStyle}>
        <FieldLabel>Settings Menu</FieldLabel>

        <FieldContent>
          <div
            style={{
              border: "1px solid var(--ktn-border-muted)",
              borderRadius: "var(--ktn-radius-md, 0.5rem)",
              backgroundColor: "var(--ktn-bg-surface, #ffffff)",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "0.7rem 0.85rem" }}>
              <p style={menuItemTitleStyle}>Settings</p>
              <p style={menuItemDescriptionStyle}>Manage preferences</p>
            </div>

            <Separator size="sm" />

            <div style={{ padding: "0.7rem 0.85rem" }}>
              <p style={menuItemTitleStyle}>Account</p>
              <p style={menuItemDescriptionStyle}>Profile and security</p>
            </div>

            <Separator size="sm" />

            <div style={{ padding: "0.7rem 0.85rem" }}>
              <p style={menuItemTitleStyle}>Help</p>
              <p style={menuItemDescriptionStyle}>Support and docs</p>
            </div>
          </div>

          <FieldDescription>
            Menu sections are separated with horizontal dividers.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const List: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>List</h3>

      <Field style={frameStyle}>
        <FieldLabel>Strategy Watchlist</FieldLabel>

        <FieldContent>
          <div
            style={{
              border: "1px solid var(--ktn-border-muted)",
              borderRadius: "var(--ktn-radius-md, 0.5rem)",
              overflow: "hidden",
              backgroundColor: "var(--ktn-bg-surface, #ffffff)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.5rem",
                padding: "0.65rem 0.85rem",
              }}
            >
              <span
                style={{
                  color: "var(--ktn-text-primary)",
                  fontSize: "0.875rem",
                }}
              >
                NIFTY 50
              </span>
              <Badge size="sm" variant="secondary">
                Active
              </Badge>
            </div>

            <Separator size="xs" />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.5rem",
                padding: "0.65rem 0.85rem",
              }}
            >
              <span
                style={{
                  color: "var(--ktn-text-primary)",
                  fontSize: "0.875rem",
                }}
              >
                BANKNIFTY
              </span>
              <Badge size="sm" variant="outline">
                Paused
              </Badge>
            </div>

            <Separator size="xs" />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.5rem",
                padding: "0.65rem 0.85rem",
              }}
            >
              <span
                style={{
                  color: "var(--ktn-text-primary)",
                  fontSize: "0.875rem",
                }}
              >
                FINNIFTY
              </span>
              <Badge size="sm" variant="secondary">
                Active
              </Badge>
            </div>
          </div>

          <FieldDescription>
            List rows use separators to improve scan readability.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const SeparatorPlayground: Story = {
  name: "Separator Playground",
  args: {
    size: "md",
    orientation: "horizontal",
    withAction: false,
  },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
    withAction: { control: "boolean" },
    onAction: { action: "action" },
    decorative: { table: { disable: true } },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const withAction = args.withAction ?? false;

    return (
      <FieldGroup style={frameStyle}>
        <Field>
          <FieldLabel>Playground</FieldLabel>

          <FieldContent>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "1px dashed var(--ktn-border-muted)",
                borderRadius: "var(--ktn-radius-md, 0.5rem)",
                padding: "0.6rem",
                minHeight: "4.5rem",
                width: "100%",
              }}
            >
              {args.orientation === "vertical" ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.6rem",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      textAlign: "center",
                      color: "var(--ktn-text-secondary)",
                    }}
                  >
                    Left
                  </div>
                  <Separator
                    orientation="vertical"
                    size={args.size}
                    onAction={withAction ? args.onAction : undefined}
                    style={withAction ? { cursor: "pointer" } : undefined}
                  />
                  <div
                    style={{
                      flex: 1,
                      textAlign: "center",
                      color: "var(--ktn-text-secondary)",
                    }}
                  >
                    Right
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.6rem",
                  }}
                >
                  <div style={{ color: "var(--ktn-text-secondary)" }}>Top</div>
                  <Separator
                    orientation="horizontal"
                    size={args.size}
                    onAction={withAction ? args.onAction : undefined}
                    style={withAction ? { cursor: "pointer" } : undefined}
                  />
                  <div style={{ color: "var(--ktn-text-secondary)" }}>
                    Bottom
                  </div>
                </div>
              )}
            </div>

            <FieldDescription>
              Adjust size and orientation using controls.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>
    );
  },
};
