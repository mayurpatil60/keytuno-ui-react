import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { FiBell, FiMoon } from "react-icons/fi";

import { Badge, Button, Navbar, type NavbarProps } from "../src/index";

const meta: Meta<typeof Navbar> = {
  title: "Navigation/Navbar",
  component: Navbar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const canvasStyle: CSSProperties = {
  width: "min(1120px, 96vw)",
  maxWidth: "100%",
  minHeight: "20rem",
  border: "1px solid var(--ktn-border-muted)",
  borderRadius: "1rem",
  padding: "0.9rem",
  background:
    "linear-gradient(145deg, color-mix(in srgb, var(--ktn-bg-surface, #ffffff) 88%, #e2e8f0 12%), var(--ktn-bg-default, #f8fafc))",
};

const rightActionsStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
};

const storyArgTypes = {
  size: {
    control: "select",
    options: ["xs", "sm", "md", "lg"],
  },
  variant: {
    control: "select",
    options: [
      "light",
      "dark",
      "brand-light",
      "brand-dark",
      "default",
      "outline",
    ],
  },
  sticky: {
    control: "boolean",
  },
  showBrand: {
    control: "boolean",
  },
  showHamburger: {
    control: "boolean",
  },
  hamburgerAriaLabel: {
    control: "text",
  },
  hamburgerDisabled: {
    control: "boolean",
  },
  brandName: {
    control: "text",
  },
  brandTagline: {
    control: "text",
  },
  onHamburgerAction: {
    action: "hamburger-action",
  },
  onAction: {
    action: "action",
  },
  onItemSelect: {
    action: "item-select",
  },
  brand: {
    table: { disable: true },
  },
  brandLogo: {
    table: { disable: true },
  },
  hamburgerIcon: {
    table: { disable: true },
  },
  items: {
    table: { disable: true },
  },
  actions: {
    table: { disable: true },
  },
  activeItemId: {
    table: { disable: true },
  },
  defaultActiveItemId: {
    table: { disable: true },
  },
} satisfies NonNullable<Story["argTypes"]>;

function NavbarRightIcons(): JSX.Element {
  return (
    <div style={rightActionsStyle}>
      <Button
        variant="ghost"
        size="sm"
        iconOnly
        aria-label="Change theme"
        tooltip="Change theme"
      >
        <FiMoon size={14} aria-hidden />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        iconOnly
        aria-label="Notifications"
        tooltip="Notifications"
      >
        <FiBell size={14} aria-hidden />
      </Button>
    </div>
  );
}

function renderPlaybook(args: NavbarProps): JSX.Element {
  const onHamburgerAction =
    args.onHamburgerAction ??
    ((event: Parameters<NonNullable<NavbarProps["onHamburgerAction"]>>[0]) => {
      action("hamburger-action")(event);
    });

  const onAction =
    args.onAction ??
    ((context: Parameters<NonNullable<NavbarProps["onAction"]>>[0]) => {
      action("action")(context);
    });

  return (
    <div style={canvasStyle}>
      <Navbar
        {...args}
        showHamburger={args.showHamburger ?? true}
        hamburgerAriaLabel={args.hamburgerAriaLabel ?? "Open app menu"}
        hamburgerDisabled={args.hamburgerDisabled ?? false}
        showBrand={args.showBrand ?? true}
        brandLogo={
          args.brandLogo ?? (
            <Badge variant="primary" size="sm">
              KT
            </Badge>
          )
        }
        brandName={args.brandName ?? "Keytuno"}
        brandTagline={args.brandTagline ?? "Operations Platform"}
        items={[]}
        emptyText={null}
        actions={<NavbarRightIcons />}
        onHamburgerAction={(event) => {
          onHamburgerAction(event);
        }}
        onAction={(context) => {
          onAction(context);
        }}
      />
    </div>
  );
}

export const HamburgerBrandRightIconsPlaybook: Story = {
  name: "Hamburger Brand Right Icons Playbook",
  args: {
    size: "md",
    variant: "light",
    sticky: false,
    showBrand: true,
    showHamburger: true,
    hamburgerAriaLabel: "Open app menu",
    hamburgerDisabled: false,
    brandName: "Keytuno",
    brandTagline: "Operations Platform",
    onHamburgerAction: undefined,
    onAction: undefined,
    onItemSelect: undefined,
  },
  argTypes: storyArgTypes,
  render: (args) => renderPlaybook(args),
};
