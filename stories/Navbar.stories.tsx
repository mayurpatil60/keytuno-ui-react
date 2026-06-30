import { useEffect, useState, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import {
  FiActivity,
  FiBell,
  FiBox,
  FiBriefcase,
  FiGrid,
  FiHelpCircle,
  FiShoppingCart,
} from "react-icons/fi";

import {
  Avatar,
  Badge,
  Button,
  Navbar,
  type NavbarActionContext,
  type NavbarItem,
  type NavbarProps,
} from "../src/index";

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

const fallbackOnAction = action("action");
const fallbackOnItemSelect = action("item-select");

const canvasStyle: CSSProperties = {
  width: "min(1120px, 96vw)",
  maxWidth: "100%",
  minHeight: "32rem",
  border: "1px solid var(--ktn-border-muted)",
  borderRadius: "1rem",
  padding: "0.9rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.9rem",
  background:
    "linear-gradient(145deg, color-mix(in srgb, var(--ktn-bg-surface, #ffffff) 90%, #dbeafe 10%), var(--ktn-bg-default, #f8fafc))",
};

const contentStyle: CSSProperties = {
  flex: "1 1 auto",
  minHeight: "14rem",
  border: "1px solid var(--ktn-border-muted)",
  borderRadius: "0.85rem",
  backgroundColor: "var(--ktn-bg-surface, #ffffff)",
  padding: "0.95rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.8rem",
};

const metricGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
  gap: "0.55rem",
};

const metricCardStyle: CSSProperties = {
  border: "1px solid var(--ktn-border-muted)",
  borderRadius: "0.7rem",
  padding: "0.65rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.2rem",
  backgroundColor: "var(--ktn-bg-surface, #ffffff)",
};

const actionArgTypes = {
  size: {
    control: "select",
    options: ["xs", "sm", "md", "lg"],
  },
  variant: {
    control: "select",
    options: ["default", "outline", "soft"],
  },
  sticky: {
    control: "boolean",
  },
  responsive: {
    control: "boolean",
  },
  mobileBreakpoint: {
    control: "number",
  },
  mobileMenuSide: {
    control: "inline-radio",
    options: ["left", "right"],
  },
  mobileTitle: {
    control: "text",
  },
  showMobileToggle: {
    control: "boolean",
  },
  mobileToggleLabel: {
    control: "text",
  },
  showBrand: {
    control: "boolean",
  },
  brandName: {
    control: "text",
  },
  brandTagline: {
    control: "text",
  },
  defaultMobileOpen: {
    control: "boolean",
  },
  closeMobileOnSelect: {
    control: "boolean",
  },
  defaultActiveItemId: {
    control: "select",
    options: [
      "home",
      "orders",
      "orders-all",
      "orders-pending",
      "inventory",
      "analytics",
      "clients",
      "support",
    ],
  },
  onAction: {
    action: "action",
  },
  onItemSelect: {
    action: "item-select",
  },
  onMobileOpenChange: {
    action: "mobile-open-change",
  },
  onActiveItemChange: {
    action: "active-item-change",
  },
  brand: {
    table: { disable: true },
  },
  brandLogo: {
    table: { disable: true },
  },
  items: {
    table: { disable: true },
  },
  actions: {
    table: { disable: true },
  },
  className: {
    table: { disable: true },
  },
  style: {
    table: { disable: true },
  },
  activeItemId: {
    control: "text",
  },
  mobileOpen: {
    control: "boolean",
  },
} satisfies NonNullable<Story["argTypes"]>;

const navbarItems: NavbarItem[] = [
  {
    id: "home",
    label: "Home",
    icon: <FiGrid size={14} />,
    active: true,
    href: "#",
  },
  {
    id: "orders",
    label: "Orders",
    icon: <FiShoppingCart size={14} />,
    badge: "12",
    items: [
      {
        id: "orders-all",
        label: "All Orders",
      },
      {
        id: "orders-pending",
        label: "Pending",
        badge: 5,
      },
      {
        id: "orders-completed",
        label: "Completed",
      },
    ],
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: <FiBox size={14} />,
    href: "#",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <FiActivity size={14} />,
    href: "#",
  },
  {
    id: "clients",
    label: "Clients",
    icon: <FiBriefcase size={14} />,
    href: "#",
  },
  {
    id: "support",
    label: "Support",
    icon: <FiHelpCircle size={14} />,
    disabled: true,
    href: "#",
  },
];

function NavbarActions(): JSX.Element {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
      <Button size="sm" variant="outline" compact>
        <FiBell size={13} aria-hidden />
      </Button>

      <Button size="sm" variant="primary" compact>
        Create Order
      </Button>

      <Avatar size="xs" text="MP" />
    </div>
  );
}

function DashboardPreview({ lastAction }: { lastAction: string }): JSX.Element {
  return (
    <div style={contentStyle}>
      <div>
        <h3 style={{ margin: 0, fontSize: "1rem" }}>Operations Overview</h3>
        <p
          style={{
            margin: "0.25rem 0 0",
            color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
            fontSize: "0.82rem",
          }}
        >
          Navbar keeps all routes accessible on desktop and mobile using the
          same item model.
        </p>
      </div>

      <div style={metricGridStyle}>
        <div style={metricCardStyle}>
          <span
            style={{ color: "var(--ktn-text-secondary)", fontSize: "0.72rem" }}
          >
            Active Orders
          </span>
          <strong style={{ fontSize: "1rem" }}>84</strong>
        </div>

        <div style={metricCardStyle}>
          <span
            style={{ color: "var(--ktn-text-secondary)", fontSize: "0.72rem" }}
          >
            Fill Rate
          </span>
          <strong style={{ fontSize: "1rem" }}>97.8%</strong>
        </div>

        <div style={metricCardStyle}>
          <span
            style={{ color: "var(--ktn-text-secondary)", fontSize: "0.72rem" }}
          >
            Blocking Alerts
          </span>
          <strong style={{ fontSize: "1rem" }}>2</strong>
        </div>
      </div>

      <div
        style={{
          marginTop: "auto",
          border: "1px solid var(--ktn-border-muted)",
          borderRadius: "0.7rem",
          padding: "0.62rem",
          fontSize: "0.78rem",
          color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
          backgroundColor: "var(--ktn-bg-surface, #ffffff)",
        }}
      >
        Last navbar action: {lastAction}
      </div>
    </div>
  );
}

function renderNavbar(
  args: NavbarProps,
  options?: {
    mobileBreakpoint?: number;
  },
): JSX.Element {
  const [lastAction, setLastAction] = useState("No action yet");
  const [storyMobileOpen, setStoryMobileOpen] = useState<boolean>(
    args.mobileOpen ?? args.defaultMobileOpen ?? false,
  );
  const [storyActiveItemId, setStoryActiveItemId] = useState<
    string | undefined
  >(args.activeItemId ?? args.defaultActiveItemId);

  useEffect(() => {
    if (args.mobileOpen !== undefined) {
      setStoryMobileOpen(args.mobileOpen);
      return;
    }

    setStoryMobileOpen(args.defaultMobileOpen ?? false);
  }, [args.mobileOpen, args.defaultMobileOpen]);

  useEffect(() => {
    if (args.activeItemId !== undefined) {
      setStoryActiveItemId(args.activeItemId);
      return;
    }

    setStoryActiveItemId(args.defaultActiveItemId);
  }, [args.activeItemId, args.defaultActiveItemId]);

  const onAction =
    args.onAction ??
    ((context: NavbarActionContext) => {
      fallbackOnAction(context);
    });

  const onItemSelect = args.onItemSelect ?? fallbackOnItemSelect;
  const onMobileOpenChange = args.onMobileOpenChange;
  const onActiveItemChange = args.onActiveItemChange;

  return (
    <div style={canvasStyle}>
      <Navbar
        {...args}
        showBrand={args.showBrand ?? true}
        brandLogo={
          args.brandLogo ?? (
            <Badge variant="primary" size="sm">
              KT
            </Badge>
          )
        }
        brandName={args.brandName ?? "Keytuno Workspace"}
        brandTagline={args.brandTagline ?? "Navigation shell"}
        items={navbarItems}
        actions={<NavbarActions />}
        mobileOpen={storyMobileOpen}
        activeItemId={storyActiveItemId}
        mobileBreakpoint={
          options?.mobileBreakpoint ?? args.mobileBreakpoint ?? 960
        }
        onAction={(context) => {
          const label = context.itemLabel ?? context.itemId ?? "n/a";
          setLastAction(`${context.source}: ${label}`);
          onAction(context);
        }}
        onItemSelect={(item, parentItem) => {
          onItemSelect(item, parentItem);
        }}
        onMobileOpenChange={(nextOpen) => {
          setStoryMobileOpen(nextOpen);
          onMobileOpenChange?.(nextOpen);
        }}
        onActiveItemChange={(nextItemId) => {
          setStoryActiveItemId(nextItemId);
          onActiveItemChange?.(nextItemId);
        }}
      />

      <DashboardPreview lastAction={lastAction} />
    </div>
  );
}

export const NavbarMenuAndSubmenu: Story = {
  name: "Navbar Menu and Submenu",
  render: () =>
    renderNavbar({
      size: "md",
      variant: "default",
      responsive: true,
      sticky: false,
      mobileBreakpoint: 960,
      mobileMenuSide: "left",
      mobileTitle: "Workspace Navigation",
      showMobileToggle: true,
      mobileToggleLabel: "Menu",
      defaultMobileOpen: false,
      closeMobileOnSelect: true,
      defaultActiveItemId: "home",
    }),
};

export const NavbarPlayground: Story = {
  name: "Navbar Playground",
  args: {
    size: "md",
    variant: "default",
    sticky: false,
    responsive: true,
    mobileBreakpoint: 960,
    mobileMenuSide: "left",
    mobileTitle: "Workspace Navigation",
    showMobileToggle: true,
    mobileToggleLabel: "Menu",
    defaultMobileOpen: false,
    closeMobileOnSelect: true,
    defaultActiveItemId: "home",
    onAction: undefined,
    onItemSelect: undefined,
  },
  argTypes: actionArgTypes,
  render: (args) => renderNavbar(args),
};

export const ResponsivePlayground: Story = {
  name: "Responsive Playground",
  args: {
    size: "md",
    variant: "soft",
    sticky: false,
    responsive: true,
    mobileBreakpoint: 9999,
    mobileMenuSide: "right",
    mobileTitle: "Mobile Navigation",
    showMobileToggle: true,
    mobileToggleLabel: "Open Menu",
    defaultMobileOpen: true,
    closeMobileOnSelect: true,
    defaultActiveItemId: "orders-pending",
    onAction: undefined,
    onItemSelect: undefined,
  },
  argTypes: actionArgTypes,
  render: (args) =>
    renderNavbar(args, {
      mobileBreakpoint: args.mobileBreakpoint,
    }),
};
