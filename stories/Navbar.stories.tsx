import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { FiBell, FiMoon } from "react-icons/fi";

import { Badge, Button, Navbar } from "../src/index";

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

function renderPlaybook(): JSX.Element {
  return (
    <div style={canvasStyle}>
      <Navbar
        size="md"
        variant="light"
        sticky={false}
        showHamburger
        hamburgerAriaLabel="Open app menu"
        hamburgerDisabled={false}
        showBrand
        brandLogo={
          <Badge variant="primary" size="sm">
            KT
          </Badge>
        }
        brandName="Keytuno"
        brandTagline="Operations Platform"
        items={[]}
        emptyText={null}
        actions={<NavbarRightIcons />}
        onHamburgerAction={(event) => action("hamburger-action")(event)}
        onAction={(context) => action("action")(context)}
      />
    </div>
  );
}

export const HamburgerBrandRightIconsPlaybook: Story = {
  name: "Hamburger Brand Right Icons Playbook",
  render: () => renderPlaybook(),
};
