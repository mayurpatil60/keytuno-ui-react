import { useEffect, useState, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import {
  FiBarChart2,
  FiBell,
  FiBook,
  FiBriefcase,
  FiGrid,
  FiHelpCircle,
  FiLayers,
  FiList,
  FiMoreHorizontal,
  FiSettings,
  FiShoppingCart,
  FiUser,
  FiUsers,
} from "react-icons/fi";

import {
  Avatar,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Separator,
  Sidebar,
  type SidebarActionContext,
  type SidebarItem,
  type SidebarProps,
  type SidebarSectionSeparatorContext,
  type SidebarSection,
} from "../src/index";

const meta: Meta<typeof Sidebar> = {
  title: "Navigation/Sidebar",
  component: Sidebar,
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
  minHeight: "34rem",
  overflow: "visible",
  border: "1px solid var(--ktn-border-muted)",
  borderRadius: "1rem",
  padding: "0.85rem",
  display: "flex",
  gap: "0.85rem",
  alignItems: "stretch",
  background:
    "linear-gradient(145deg, color-mix(in srgb, var(--ktn-bg-surface, #ffffff) 90%, #dbeafe 10%), var(--ktn-bg-default, #f8fafc))",
};

const previewPaneStyle: CSSProperties = {
  flex: "1 1 18rem",
  minWidth: 0,
  border: "1px solid var(--ktn-border-muted)",
  borderRadius: "0.85rem",
  backgroundColor: "var(--ktn-bg-surface, #ffffff)",
  padding: "0.9rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.8rem",
};

const metricGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
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
    options: ["sm", "md", "lg"],
  },
  variant: {
    control: "select",
    options: ["default", "outline", "soft"],
  },
  defaultCollapsed: {
    control: "boolean",
  },
  responsive: {
    control: "boolean",
  },
  collapseBreakpoint: {
    control: "number",
  },
  iconOnly: {
    control: "boolean",
  },
  showCollapseToggle: {
    control: "boolean",
  },
  showMobileToggle: {
    control: "boolean",
  },
  defaultMobileOpen: {
    control: "boolean",
  },
  closeMobileOnSelect: {
    control: "boolean",
  },
  sectionSpacing: {
    control: "text",
  },
  sectionPaddingTop: {
    control: "text",
  },
  sectionPaddingBottom: {
    control: "text",
  },
  showSectionSeparators: {
    control: "boolean",
  },
  sectionSeparatorInset: {
    control: "text",
  },
  sectionSeparatorSize: {
    control: "select",
    options: ["xs", "sm", "md", "lg"],
  },
  sectionSeparatorStyle: {
    control: "object",
  },
  onAction: {
    action: "action",
  },
  onItemSelect: {
    action: "item-select",
  },
  sections: {
    table: { disable: true },
  },
  header: {
    table: { disable: true },
  },
  footer: {
    table: { disable: true },
  },
  className: {
    table: { disable: true },
  },
  style: {
    table: { disable: true },
  },
  collapsed: {
    control: "boolean",
  },
  mobileOpen: {
    control: "boolean",
  },
  activeItemId: {
    control: "text",
  },
  onCollapsedChange: {
    action: "collapsed-change",
  },
  onMobileOpenChange: {
    action: "mobile-open-change",
  },
  onActiveItemChange: {
    action: "active-item-change",
  },
  renderSectionSeparator: {
    table: { disable: true },
  },
} satisfies NonNullable<Story["argTypes"]>;

const navigationSections: SidebarSection[] = [
  {
    id: "overview",
    title: "Overview",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: <FiGrid size={15} />,
        href: "#",
        active: true,
      },
      {
        id: "orders",
        label: "Orders",
        icon: <FiShoppingCart size={15} />,
        defaultExpanded: true,
        items: [
          {
            id: "orders-all",
            label: "All Orders",
            href: "#",
          },
          {
            id: "orders-pending",
            label: "Pending",
            badge: 12,
            href: "#",
          },
          {
            id: "orders-complete",
            label: "Completed",
            href: "#",
          },
        ],
      },
      {
        id: "alerts",
        label: "Alerts",
        icon: <FiBell size={15} />,
        badge: "3",
        href: "#",
      },
      {
        id: "workspace",
        label: "Workspace",
        icon: <FiLayers size={15} />,
        href: "#",
      },
    ],
  },
  {
    id: "management",
    title: "Management",
    items: [
      {
        id: "clients",
        label: "Clients",
        icon: <FiBriefcase size={15} />,
        href: "#",
      },
      {
        id: "team",
        label: "Team",
        icon: <FiUsers size={15} />,
        items: [
          {
            id: "team-members",
            label: "Members",
            href: "#",
          },
          {
            id: "team-permissions",
            label: "Permissions",
            href: "#",
          },
        ],
      },
      {
        id: "reports",
        label: "Reports",
        icon: <FiBarChart2 size={15} />,
        href: "#",
      },
    ],
  },
  {
    id: "preferences",
    title: "Preferences",
    items: [
      {
        id: "settings",
        label: "Settings",
        icon: <FiSettings size={15} />,
        href: "#",
      },
      {
        id: "docs",
        label: "Documentation",
        icon: <FiBook size={15} />,
        href: "#",
      },
      {
        id: "support",
        label: "Support",
        icon: <FiHelpCircle size={15} />,
        href: "#",
        disabled: true,
      },
    ],
  },
];

function SidebarHeader(): JSX.Element {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
      <Badge variant="primary" size="sm">
        KT
      </Badge>

      <div style={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
        <strong
          style={{
            fontSize: "0.86rem",
            lineHeight: 1.15,
            color: "var(--ktn-text-primary)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Keytuno Admin
        </strong>

        <span
          style={{
            fontSize: "0.72rem",
            lineHeight: 1.1,
            color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
            whiteSpace: "normal",
            overflowWrap: "anywhere",
          }}
        >
          Navigation workspace
        </span>
      </div>
    </div>
  );
}

function SidebarFooter(): JSX.Element {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <DropdownMenu size="sm" variant="soft">
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            style={{ width: "100%", justifyContent: "space-between" }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                minWidth: 0,
              }}
            >
              <Avatar size="xs" text="Mayur" />
              <span
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                My Profile
              </span>
            </span>

            <FiMoreHorizontal size={14} aria-hidden />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="top" align="start">
          <DropdownMenuItem icon={<FiUser size={14} />}>
            Account
          </DropdownMenuItem>
          <DropdownMenuItem icon={<FiList size={14} />}>
            Activity
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem destructive>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function DashboardPreview({ lastAction }: { lastAction: string }): JSX.Element {
  return (
    <div style={previewPaneStyle}>
      <div>
        <h3 style={{ margin: 0, fontSize: "1rem" }}>Operations Dashboard</h3>
        <p
          style={{
            margin: "0.25rem 0 0",
            color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
            fontSize: "0.82rem",
          }}
        >
          Sidebar supports direct menu and nested submenu items, plus your
          existing components in header/footer.
        </p>
      </div>

      <div style={metricGridStyle}>
        <div style={metricCardStyle}>
          <span
            style={{ color: "var(--ktn-text-secondary)", fontSize: "0.72rem" }}
          >
            Open Orders
          </span>
          <strong style={{ fontSize: "1rem" }}>127</strong>
        </div>

        <div style={metricCardStyle}>
          <span
            style={{ color: "var(--ktn-text-secondary)", fontSize: "0.72rem" }}
          >
            Team Online
          </span>
          <strong style={{ fontSize: "1rem" }}>19</strong>
        </div>

        <div style={metricCardStyle}>
          <span
            style={{ color: "var(--ktn-text-secondary)", fontSize: "0.72rem" }}
          >
            Active Alerts
          </span>
          <strong style={{ fontSize: "1rem" }}>3</strong>
        </div>
      </div>

      <div
        style={{
          marginTop: "auto",
          border: "1px solid var(--ktn-border-muted)",
          borderRadius: "0.7rem",
          padding: "0.6rem",
          fontSize: "0.78rem",
          color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
          backgroundColor: "var(--ktn-bg-surface, #ffffff)",
        }}
      >
        Last sidebar action: {lastAction}
      </div>
    </div>
  );
}

function renderSidebar(
  args: SidebarProps,
  options?: {
    collapseBreakpoint?: number;
    separatorStyle?: "default" | "dashed";
  },
): JSX.Element {
  const [lastAction, setLastAction] = useState("No action yet");
  const [storyCollapsed, setStoryCollapsed] = useState<boolean>(
    args.collapsed ?? args.defaultCollapsed ?? false,
  );
  const [storyMobileOpen, setStoryMobileOpen] = useState<boolean>(
    args.mobileOpen ?? args.defaultMobileOpen ?? false,
  );
  const [storyActiveItemId, setStoryActiveItemId] = useState<
    string | undefined
  >(args.activeItemId ?? args.defaultActiveItemId);

  useEffect(() => {
    if (args.collapsed !== undefined) {
      setStoryCollapsed(args.collapsed);
      return;
    }

    setStoryCollapsed(args.defaultCollapsed ?? false);
  }, [args.collapsed, args.defaultCollapsed]);

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
    ((context: SidebarActionContext) => {
      fallbackOnAction(context);
    });

  const onItemSelect =
    args.onItemSelect ??
    ((item: SidebarItem) => {
      fallbackOnItemSelect(item);
    });

  const onCollapsedChange = args.onCollapsedChange;
  const onMobileOpenChange = args.onMobileOpenChange;
  const onActiveItemChange = args.onActiveItemChange;

  return (
    <div style={canvasStyle}>
      <Sidebar
        {...args}
        sections={navigationSections}
        header={<SidebarHeader />}
        footer={<SidebarFooter />}
        onAction={(context) => {
          const label = context.itemLabel ?? context.itemId ?? "n/a";
          setLastAction(`${context.source}: ${label}`);
          onAction(context);
        }}
        collapsed={storyCollapsed}
        mobileOpen={storyMobileOpen}
        activeItemId={storyActiveItemId}
        onCollapsedChange={(nextCollapsed) => {
          setStoryCollapsed(nextCollapsed);
          onCollapsedChange?.(nextCollapsed);
        }}
        onMobileOpenChange={(nextOpen) => {
          setStoryMobileOpen(nextOpen);
          onMobileOpenChange?.(nextOpen);
        }}
        onActiveItemChange={(itemId) => {
          setStoryActiveItemId(itemId);
          onActiveItemChange?.(itemId);
        }}
        onItemSelect={(item) => {
          onItemSelect(item);
        }}
        collapseBreakpoint={
          options?.collapseBreakpoint ?? args.collapseBreakpoint
        }
        renderSectionSeparator={
          options?.separatorStyle === "dashed"
            ? (context: SidebarSectionSeparatorContext) => (
                <Separator
                  size={args.sectionSeparatorSize ?? "sm"}
                  style={{
                    backgroundColor: "transparent",
                    borderTop: "1px dashed var(--ktn-border-muted)",
                    height: 0,
                    minHeight: 0,
                    opacity: context.collapsed ? 0.5 : 1,
                    ...(args.sectionSeparatorStyle ?? {}),
                  }}
                />
              )
            : args.renderSectionSeparator
        }
      />

      <DashboardPreview lastAction={lastAction} />
    </div>
  );
}

export const SidebarMenuAndSubmenu: Story = {
  name: "Sidebar Menu and Submenu",
  render: () =>
    renderSidebar({
      size: "md",
      variant: "default",
      defaultCollapsed: false,
      iconOnly: false,
      responsive: true,
      collapseBreakpoint: 992,
      showCollapseToggle: true,
      showMobileToggle: true,
      defaultMobileOpen: false,
      closeMobileOnSelect: true,
      sectionSpacing: "0.6rem",
      sectionPaddingTop: "0.2rem",
      sectionPaddingBottom: "0rem",
      showSectionSeparators: true,
      sectionSeparatorInset: "0.45rem",
      sectionSeparatorSize: "sm",
    }),
};

export const SidebarPlayground: Story = {
  name: "Sidebar Playground",
  args: {
    size: "md",
    variant: "default",
    defaultCollapsed: false,
    iconOnly: false,
    responsive: true,
    collapseBreakpoint: 992,
    showCollapseToggle: true,
    showMobileToggle: true,
    defaultMobileOpen: false,
    closeMobileOnSelect: true,
    sectionSpacing: "0.6rem",
    sectionPaddingTop: "0.2rem",
    sectionPaddingBottom: "0rem",
    showSectionSeparators: true,
    sectionSeparatorInset: "0.45rem",
    sectionSeparatorSize: "sm",
    sectionSeparatorStyle: undefined,
    renderSectionSeparator: undefined,
    onAction: undefined,
    onItemSelect: undefined,
  },
  argTypes: actionArgTypes,
  render: (args) => renderSidebar(args),
};

export const ResponsivePlayground: Story = {
  name: "Responsive Playground",
  args: {
    size: "md",
    variant: "soft",
    defaultCollapsed: false,
    iconOnly: false,
    responsive: true,
    collapseBreakpoint: 9999,
    showCollapseToggle: true,
    showMobileToggle: true,
    defaultMobileOpen: true,
    closeMobileOnSelect: true,
    sectionSpacing: "0.6rem",
    sectionPaddingTop: "0.2rem",
    sectionPaddingBottom: "0rem",
    showSectionSeparators: true,
    sectionSeparatorInset: "0.45rem",
    sectionSeparatorSize: "sm",
    sectionSeparatorStyle: undefined,
    renderSectionSeparator: undefined,
    onAction: undefined,
    onItemSelect: undefined,
  },
  argTypes: actionArgTypes,
  render: (args) =>
    renderSidebar(args, {
      collapseBreakpoint: args.collapseBreakpoint,
    }),
};

export const SeparatorStylePlayground: Story = {
  name: "Separator Style Playground",
  args: {
    size: "md",
    variant: "outline",
    defaultCollapsed: false,
    iconOnly: false,
    responsive: true,
    collapseBreakpoint: 992,
    showCollapseToggle: true,
    showMobileToggle: true,
    defaultMobileOpen: false,
    closeMobileOnSelect: true,
    sectionSpacing: "0.72rem",
    sectionPaddingTop: "0.24rem",
    sectionPaddingBottom: "0rem",
    showSectionSeparators: true,
    sectionSeparatorInset: "0.25rem",
    sectionSeparatorSize: "sm",
    sectionSeparatorStyle: {
      opacity: 0.85,
    },
    onAction: undefined,
    onItemSelect: undefined,
  },
  argTypes: actionArgTypes,
  render: (args) =>
    renderSidebar(args, {
      separatorStyle: "dashed",
    }),
};
