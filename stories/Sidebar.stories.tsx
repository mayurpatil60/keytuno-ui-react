import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import {
  FiBarChart2,
  FiBell,
  FiBook,
  FiBox,
  FiBriefcase,
  FiCalendar,
  FiCreditCard,
  FiDatabase,
  FiFileText,
  FiGlobe,
  FiGrid,
  FiHelpCircle,
  FiLayers,
  FiMoon,
  FiSettings,
  FiShield,
  FiShoppingCart,
  FiUsers,
} from "react-icons/fi";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Navbar,
  Sidebar,
  type SidebarActionContext,
  type SidebarItem,
  type SidebarProps,
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

type DesktopSidebarMode = "expanded" | "icons";

const MOBILE_BREAKPOINT = 960;

const sidebarCanvasStyle: CSSProperties = {
  width: "min(1260px, 98vw)",
  maxWidth: "100%",
  display: "flex",
  gap: "0.95rem",
  alignItems: "flex-start",
  overflow: "visible",
};

const sidebarPreviewStyle: CSSProperties = {
  flex: "1 1 22rem",
  minWidth: 0,
  minHeight: "100vh",
  border: "1px solid var(--ktn-border-muted)",
  borderRadius: "0.95rem",
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.9rem",
  background:
    "radial-gradient(110% 110% at 100% 0%, color-mix(in srgb, var(--ktn-action-primary-bg, #2563eb) 16%, transparent), transparent 60%), linear-gradient(145deg, var(--ktn-bg-surface, #ffffff), color-mix(in srgb, var(--ktn-bg-default, #f8fafc) 86%, #dbeafe 14%))",
};

const statsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
  gap: "0.62rem",
};

const statCardStyle: CSSProperties = {
  border: "1px solid var(--ktn-border-muted)",
  borderRadius: "0.72rem",
  padding: "0.65rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.2rem",
  backgroundColor: "var(--ktn-bg-surface, #ffffff)",
};

const pageShellStyle: CSSProperties = {
  width: "100vw",
  maxWidth: "100vw",
  minHeight: "100vh",
  height: "100vh",
  border: "1px solid var(--ktn-border-muted)",
  borderRadius: 0,
  overflow: "hidden",
  display: "flex",
  flexDirection: "row",
  backgroundColor: "var(--ktn-bg-default, #f1f4f8)",
};

const actionArgTypes = {
  size: {
    control: "select",
    options: ["xs", "sm", "md", "lg"],
  },
  variant: {
    control: "select",
    options: ["default", "light", "dark", "brand-light", "brand-dark"],
  },
  defaultCollapsed: {
    control: "boolean",
  },
  defaultOpen: {
    control: "boolean",
  },
  closeOnEscape: {
    control: "boolean",
  },
  showItemIcons: {
    control: "boolean",
  },
  brandName: {
    control: "text",
  },
  brandTagline: {
    control: "text",
  },
  onAction: {
    action: "action",
  },
  onItemSelect: {
    action: "item-select",
  },
  collapsed: {
    control: "boolean",
  },
  open: {
    control: "boolean",
  },
  activeItemId: {
    control: "text",
  },
  onCollapsedChange: {
    action: "collapsed-change",
  },
  onOpenChange: {
    action: "open-change",
  },
  onActiveItemChange: {
    action: "active-item-change",
  },
  sections: {
    table: { disable: true },
  },
  footer: {
    table: { disable: true },
  },
  brandLogo: {
    table: { disable: true },
  },
  className: {
    table: { disable: true },
  },
  style: {
    table: { disable: true },
  },
} satisfies NonNullable<Story["argTypes"]>;

const fallbackOnAction = action("action");
const fallbackOnItemSelect = action("item-select");
const fallbackHamburgerAction = action("hamburger-action");

function iconOrUndefined(
  includeIcons: boolean,
  icon: JSX.Element,
): JSX.Element | undefined {
  return includeIcons ? icon : undefined;
}

function buildSections(includeIcons: boolean): SidebarSection[] {
  const iconSize = 15;

  return [
    {
      id: "overview",
      title: "Overview",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: iconOrUndefined(includeIcons, <FiGrid size={iconSize} />),
          active: true,
          href: "#",
        },
        {
          id: "activity",
          label: "Activity Center",
          icon: iconOrUndefined(includeIcons, <FiLayers size={iconSize} />),
          href: "#",
        },
        {
          id: "alerts",
          label: "Alerts",
          icon: iconOrUndefined(includeIcons, <FiBell size={iconSize} />),
          badge: "5",
          href: "#",
        },
        {
          id: "calendar",
          label: "Calendar",
          icon: iconOrUndefined(includeIcons, <FiCalendar size={iconSize} />),
          href: "#",
        },
      ],
    },
    {
      id: "operations",
      title: "Operations",
      items: [
        {
          id: "orders",
          label: "Orders",
          icon: iconOrUndefined(
            includeIcons,
            <FiShoppingCart size={iconSize} />,
          ),
          defaultExpanded: true,
          items: [
            {
              id: "orders-all",
              label: "All Orders",
              href: "#",
            },
            {
              id: "orders-pending",
              label: "Pending Approval",
              badge: 12,
              href: "#",
            },
            {
              id: "orders-packed",
              label: "Packed",
              href: "#",
            },
            {
              id: "orders-shipped",
              label: "Shipped",
              href: "#",
            },
          ],
        },
        {
          id: "inventory",
          label: "Inventory",
          icon: iconOrUndefined(includeIcons, <FiBox size={iconSize} />),
          items: [
            {
              id: "inventory-stock",
              label: "Stock Levels",
              href: "#",
            },
            {
              id: "inventory-reorder",
              label: "Reorder Queue",
              href: "#",
            },
            {
              id: "inventory-batches",
              label: "Batch Tracking",
              href: "#",
            },
          ],
        },
        {
          id: "procurement",
          label: "Procurement",
          icon: iconOrUndefined(includeIcons, <FiBriefcase size={iconSize} />),
          href: "#",
        },
        {
          id: "fulfillment",
          label: "Fulfillment",
          icon: iconOrUndefined(includeIcons, <FiDatabase size={iconSize} />),
          href: "#",
        },
      ],
    },
    {
      id: "people",
      title: "People",
      items: [
        {
          id: "team",
          label: "Team",
          icon: iconOrUndefined(includeIcons, <FiUsers size={iconSize} />),
          href: "#",
        },
        {
          id: "roles",
          label: "Roles & Permissions",
          icon: iconOrUndefined(includeIcons, <FiShield size={iconSize} />),
          items: [
            {
              id: "roles-access",
              label: "Access Policies",
              href: "#",
            },
            {
              id: "roles-audit",
              label: "Approval Matrix",
              href: "#",
            },
          ],
        },
        {
          id: "partners",
          label: "Partners",
          icon: iconOrUndefined(includeIcons, <FiGlobe size={iconSize} />),
          href: "#",
        },
      ],
    },
    {
      id: "finance",
      title: "Finance",
      items: [
        {
          id: "billing",
          label: "Billing",
          icon: iconOrUndefined(includeIcons, <FiCreditCard size={iconSize} />),
          href: "#",
        },
        {
          id: "invoices",
          label: "Invoices",
          icon: iconOrUndefined(includeIcons, <FiFileText size={iconSize} />),
          href: "#",
        },
        {
          id: "reports",
          label: "Reports",
          icon: iconOrUndefined(includeIcons, <FiBarChart2 size={iconSize} />),
          href: "#",
        },
      ],
    },
    {
      id: "support",
      title: "Support",
      items: [
        {
          id: "docs",
          label: "Documentation",
          icon: iconOrUndefined(includeIcons, <FiBook size={iconSize} />),
          href: "#",
        },
        {
          id: "settings",
          label: "Settings",
          icon: iconOrUndefined(includeIcons, <FiSettings size={iconSize} />),
          href: "#",
        },
        {
          id: "help-desk",
          label: "Help Desk",
          icon: iconOrUndefined(includeIcons, <FiHelpCircle size={iconSize} />),
          href: "#",
          disabled: true,
        },
      ],
    },
  ];
}

function buildLargeSections(includeIcons: boolean): SidebarSection[] {
  const sections = buildSections(includeIcons);

  return [
    ...sections,
    {
      id: "archive",
      title: "Archive",
      items: Array.from({ length: 12 }, (_, index) => ({
        id: `archive-${index + 1}`,
        label: `Archive Workspace ${index + 1}`,
        icon: iconOrUndefined(includeIcons, <FiBox size={15} />),
        href: "#",
      })),
    },
  ];
}

function SidebarFooter(): JSX.Element {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
      <Button variant="ghost" size="sm" style={{ width: "100%" }}>
        Team profile
      </Button>
      <Button variant="outline" size="sm" style={{ width: "100%" }}>
        Sign out
      </Button>
    </div>
  );
}

function SidebarPlaybookCanvas({
  args,
  useLargeData = false,
  includeIcons = true,
}: {
  args: SidebarProps;
  useLargeData?: boolean;
  includeIcons?: boolean;
}): JSX.Element {
  const sections = useMemo(() => {
    if (args.sections != null) {
      return args.sections;
    }

    return useLargeData
      ? buildLargeSections(includeIcons)
      : buildSections(includeIcons);
  }, [args.sections, includeIcons, useLargeData]);

  const [storyCollapsed, setStoryCollapsed] = useState<boolean>(
    args.collapsed ?? args.defaultCollapsed ?? false,
  );
  const [storyOpen, setStoryOpen] = useState<boolean>(
    args.open ?? args.defaultOpen ?? true,
  );
  const [storyActiveItemId, setStoryActiveItemId] = useState<
    string | undefined
  >(args.activeItemId ?? args.defaultActiveItemId);
  const [lastAction, setLastAction] = useState("No action yet");

  useEffect(() => {
    if (args.collapsed !== undefined) {
      setStoryCollapsed(args.collapsed);
      return;
    }

    setStoryCollapsed(args.defaultCollapsed ?? false);
  }, [args.collapsed, args.defaultCollapsed]);

  useEffect(() => {
    if (args.open !== undefined) {
      setStoryOpen(args.open);
      return;
    }

    setStoryOpen(args.defaultOpen ?? true);
  }, [args.open, args.defaultOpen]);

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
  const onOpenChange = args.onOpenChange;
  const onActiveItemChange = args.onActiveItemChange;

  return (
    <div style={sidebarCanvasStyle}>
      <Sidebar
        {...args}
        sections={sections}
        footer={<SidebarFooter />}
        collapsed={storyCollapsed}
        open={storyOpen}
        activeItemId={storyActiveItemId}
        onCollapsedChange={(nextCollapsed) => {
          setStoryCollapsed(nextCollapsed);
          onCollapsedChange?.(nextCollapsed);
        }}
        onOpenChange={(nextOpen) => {
          setStoryOpen(nextOpen);
          onOpenChange?.(nextOpen);
        }}
        onActiveItemChange={(itemId) => {
          setStoryActiveItemId(itemId);
          onActiveItemChange?.(itemId);
        }}
        onItemSelect={(item) => {
          onItemSelect(item);
        }}
        onAction={(context) => {
          const label = context.itemLabel ?? context.itemId ?? "n/a";
          setLastAction(`${context.source}: ${label}`);
          onAction(context);
        }}
      />

      <div style={sidebarPreviewStyle}>
        <div>
          <h3 style={{ margin: 0, fontSize: "1.02rem" }}>
            Sidebar Menu and Submenu Playbook
          </h3>
          <p
            style={{
              margin: "0.34rem 0 0",
              fontSize: "0.84rem",
              color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
            }}
          >
            Built with Sidebar + Badge + Button + Scrollbar. Collapse/expand and
            submenu interactions are emitted via onAction.
          </p>
        </div>

        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <span
              style={{
                color: "var(--ktn-text-secondary)",
                fontSize: "0.72rem",
              }}
            >
              Active section
            </span>
            <strong style={{ fontSize: "1.01rem" }}>{storyActiveItemId}</strong>
          </div>

          <div style={statCardStyle}>
            <span
              style={{
                color: "var(--ktn-text-secondary)",
                fontSize: "0.72rem",
              }}
            >
              Collapsed
            </span>
            <strong style={{ fontSize: "1.01rem" }}>
              {storyCollapsed ? "Yes" : "No"}
            </strong>
          </div>

          <div style={statCardStyle}>
            <span
              style={{
                color: "var(--ktn-text-secondary)",
                fontSize: "0.72rem",
              }}
            >
              Open
            </span>
            <strong style={{ fontSize: "1.01rem" }}>
              {storyOpen ? "Visible" : "Hidden"}
            </strong>
          </div>
        </div>

        <div
          style={{
            marginTop: "auto",
            border: "1px solid var(--ktn-border-muted)",
            borderRadius: "0.72rem",
            padding: "0.62rem",
            fontSize: "0.78rem",
            color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
            backgroundColor: "var(--ktn-bg-surface, #ffffff)",
          }}
        >
          Last sidebar action: {lastAction}
        </div>
      </div>
    </div>
  );
}

function useMobileViewport(breakpoint: number): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.innerWidth <= breakpoint;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    function handleResize(): void {
      setIsMobile(window.innerWidth <= breakpoint);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpoint]);

  return isMobile;
}

function PagePlaybook(): JSX.Element {
  const isMobile = useMobileViewport(MOBILE_BREAKPOINT);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopMode, setDesktopMode] =
    useState<DesktopSidebarMode>("expanded");
  const [activeItemId, setActiveItemId] = useState<string | undefined>(
    "dashboard",
  );
  const [lastAction, setLastAction] = useState("Ready");

  useEffect(() => {
    if (!isMobile) {
      setMobileOpen(false);
    }
  }, [isMobile]);

  const sections = useMemo(() => buildSections(!isMobile), [isMobile]);

  const sidebarCollapsed = !isMobile && desktopMode === "icons";

  function cycleDesktopMode(): void {
    setDesktopMode((current) =>
      current === "expanded" ? "icons" : "expanded",
    );
  }

  function handleSidebarAction(context: SidebarActionContext): void {
    const label = context.itemLabel ?? context.itemId ?? "n/a";
    setLastAction(`${context.source}: ${label}`);
    fallbackOnAction(context);

    if (isMobile && context.source === "item-select") {
      setMobileOpen(false);
    }
  }

  const navbarActions = (
    <div
      style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
    >
      <Button
        variant="ghost"
        size="sm"
        iconOnly
        aria-label="Theme"
        tooltip="Theme"
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

  return (
    <div style={pageShellStyle}>
      {!isMobile ? (
        <Sidebar
          sections={sections}
          size="md"
          variant="brand-light"
          brandName="Keytuno"
          brandTagline="Navigation"
          showItemIcons
          open
          collapsed={sidebarCollapsed}
          activeItemId={activeItemId}
          onActiveItemChange={(itemId) => {
            setActiveItemId(itemId);
          }}
          onCollapsedChange={(nextCollapsed) => {
            setDesktopMode(nextCollapsed ? "icons" : "expanded");
          }}
          onAction={handleSidebarAction}
          style={{
            position: "relative",
            zIndex: 2,
          }}
        />
      ) : null}

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minWidth: 0,
          minHeight: "100vh",
          backgroundColor: "var(--ktn-bg-default, #f1f4f8)",
        }}
      >
        <Navbar
          size="md"
          variant="light"
          showHamburger
          showBrand
          items={[]}
          emptyText={null}
          brandLogo={
            <Badge variant="primary" size="sm">
              KT
            </Badge>
          }
          brandName="Keytuno"
          brandTagline="Operations Platform"
          actions={navbarActions}
          onHamburgerAction={(event) => {
            fallbackHamburgerAction(event);

            if (isMobile) {
              setMobileOpen((current) => !current);
              return;
            }

            cycleDesktopMode();
          }}
        />

        <main
          style={{
            flex: 1,
            minHeight: 0,
            minWidth: 0,
            padding: "1rem 1.05rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.82rem",
            backgroundColor: "var(--ktn-bg-default, #f1f4f8)",
          }}
        >
          <div
            style={{
              border: "1px solid var(--ktn-border-muted)",
              borderRadius: "0.72rem",
              backgroundColor: "var(--ktn-bg-surface, #ffffff)",
              padding: "0.9rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.6rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <h3 style={{ margin: 0, fontSize: "1rem" }}>
                Navbar Sidebar Page Playbook
              </h3>
              <p
                style={{
                  margin: "0.26rem 0 0",
                  fontSize: "0.82rem",
                  color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
                }}
              >
                Desktop: full and icon modes. Mobile: left slide-in sidebar with
                outside-click close.
              </p>
            </div>

            <Badge variant="secondary" size="sm">
              {isMobile
                ? mobileOpen
                  ? "Mobile: open"
                  : "Mobile: hidden"
                : desktopMode === "icons"
                  ? "Desktop: icons"
                  : "Desktop: full"}
            </Badge>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "0.72rem",
            }}
          >
            <Card size="sm" spacing="sm">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Showcase buttons in the right page area.
                </CardDescription>
              </CardHeader>
              <CardContent
                style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
              >
                <Button size="sm">Create Order</Button>
                <Button size="sm" variant="outline">
                  Export
                </Button>
                <Button size="sm" variant="ghost">
                  Assign Team
                </Button>
              </CardContent>
              <CardFooter
                style={{
                  color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
                }}
              >
                Actions remain visible while sidebar changes state.
              </CardFooter>
            </Card>

            <Card size="sm" spacing="sm">
              <CardHeader>
                <CardTitle>Live Snapshot</CardTitle>
                <CardDescription>
                  Operational cards for visual verification.
                </CardDescription>
              </CardHeader>
              <CardContent
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "0.56rem",
                }}
              >
                {["Pending", "Warnings", "Online", "SLA"].map(
                  (label, index) => (
                    <div
                      key={label}
                      style={{
                        border: "1px solid var(--ktn-border-muted)",
                        borderRadius: "0.58rem",
                        padding: "0.54rem",
                        backgroundColor: "var(--ktn-bg-surface, #ffffff)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.72rem",
                          color:
                            "var(--ktn-text-secondary, var(--ktn-text-primary))",
                        }}
                      >
                        {label}
                      </div>
                      <strong style={{ fontSize: "0.95rem" }}>
                        {index === 0
                          ? "128"
                          : index === 1
                            ? "6"
                            : index === 2
                              ? "23"
                              : "98%"}
                      </strong>
                    </div>
                  ),
                )}
              </CardContent>
            </Card>
          </div>

          <Card size="sm" spacing="sm">
            <CardHeader>
              <CardTitle>Last Sidebar Action</CardTitle>
            </CardHeader>
            <CardContent
              style={{
                fontSize: "0.84rem",
                color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
              }}
            >
              {lastAction}
            </CardContent>
          </Card>
        </main>
      </div>

      {isMobile ? (
        <>
          {mobileOpen ? (
            <button
              type="button"
              aria-label="Close sidebar overlay"
              onClick={() => {
                setMobileOpen(false);
              }}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 30,
                border: "none",
                backgroundColor: "rgba(2, 6, 23, 0.46)",
                cursor: "pointer",
              }}
            />
          ) : null}

          <Sidebar
            sections={sections}
            size="md"
            variant="light"
            brandName="Keytuno"
            brandTagline="Navigation"
            showItemIcons={false}
            open
            collapsed={false}
            activeItemId={activeItemId}
            onActiveItemChange={(itemId) => {
              setActiveItemId(itemId);
            }}
            onOpenChange={(nextOpen) => {
              setMobileOpen(nextOpen);
            }}
            onAction={handleSidebarAction}
            style={{
              position: "fixed",
              insetBlockStart: 0,
              insetBlockEnd: 0,
              insetInlineStart: 0,
              transform: mobileOpen
                ? "translateX(0)"
                : "translateX(calc(-100% - 1.5rem))",
              transition: "transform 220ms ease",
              pointerEvents: mobileOpen ? "auto" : "none",
              zIndex: 40,
            }}
          />
        </>
      ) : null}
    </div>
  );
}

function BackdropOverlayPlaybook(): JSX.Element {
  const isMobile = useMobileViewport(MOBILE_BREAKPOINT);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string | undefined>(
    "dashboard",
  );
  const [lastAction, setLastAction] = useState("Ready");

  const sections = useMemo(() => buildSections(false), []);

  const navbarActions = (
    <div
      style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
    >
      <Button
        variant="ghost"
        size="sm"
        iconOnly
        aria-label="Theme"
        tooltip="Theme"
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

  function handleSidebarAction(context: SidebarActionContext): void {
    const label = context.itemLabel ?? context.itemId ?? "n/a";
    setLastAction(`${context.source}: ${label}`);
    fallbackOnAction(context);

    if (context.source === "item-select") {
      setDrawerOpen(false);
    }
  }

  return (
    <div
      style={{
        width: "100vw",
        maxWidth: "100vw",
        minHeight: "100vh",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--ktn-bg-default, #f1f4f8)",
        border: "1px solid var(--ktn-border-muted)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Navbar
        size="md"
        variant="light"
        showHamburger
        showBrand
        items={[]}
        emptyText={null}
        brandLogo={
          <Badge variant="primary" size="sm">
            KT
          </Badge>
        }
        brandName="Keytuno"
        brandTagline="Overlay Navigation"
        actions={navbarActions}
        onHamburgerAction={(event) => {
          fallbackHamburgerAction(event);
          setDrawerOpen((current) => !current);
        }}
      />

      <main
        style={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          padding: "1rem 1.05rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.82rem",
          backgroundColor: "var(--ktn-bg-default, #f1f4f8)",
        }}
      >
        <div
          style={{
            border: "1px solid var(--ktn-border-muted)",
            borderRadius: "0.72rem",
            backgroundColor: "var(--ktn-bg-surface, #ffffff)",
            padding: "0.9rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.6rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h3 style={{ margin: 0, fontSize: "1rem" }}>
              Sidebar Backdrop Overlay Playbook
            </h3>
            <p
              style={{
                margin: "0.26rem 0 0",
                fontSize: "0.82rem",
                color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
              }}
            >
              Both web and mobile use backdrop + overlay sidebar. Page content
              stays fixed and does not shift.
            </p>
          </div>

          <Badge variant="secondary" size="sm">
            {isMobile
              ? drawerOpen
                ? "Mobile: open"
                : "Mobile: hidden"
              : drawerOpen
                ? "Desktop: open"
                : "Desktop: hidden"}
          </Badge>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "0.72rem",
          }}
        >
          <Card size="sm" spacing="sm">
            <CardHeader>
              <CardTitle>Overlay Behavior</CardTitle>
              <CardDescription>
                Click hamburger to open. Click backdrop to close.
              </CardDescription>
            </CardHeader>
            <CardContent style={{ display: "flex", gap: "0.5rem" }}>
              <Button size="sm" onAction={() => setDrawerOpen(true)}>
                Open Sidebar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onAction={() => setDrawerOpen(false)}
              >
                Close Sidebar
              </Button>
            </CardContent>
            <CardFooter
              style={{
                color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
              }}
            >
              Sidebar is text-only in this playbook (no icons, no icon mode).
            </CardFooter>
          </Card>

          <Card size="sm" spacing="sm">
            <CardHeader>
              <CardTitle>Current State</CardTitle>
            </CardHeader>
            <CardContent
              style={{
                fontSize: "0.84rem",
                color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
                display: "flex",
                flexDirection: "column",
                gap: "0.34rem",
              }}
            >
              <span>Viewport: {isMobile ? "Mobile" : "Desktop"}</span>
              <span>Drawer: {drawerOpen ? "Open" : "Hidden"}</span>
              <span>Last Action: {lastAction}</span>
            </CardContent>
          </Card>
        </div>
      </main>

      {drawerOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => {
            setDrawerOpen(false);
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 30,
            border: "none",
            backgroundColor: "rgba(2, 6, 23, 0.46)",
            cursor: "pointer",
          }}
        />
      ) : null}

      <Sidebar
        sections={sections}
        size={isMobile ? "sm" : "md"}
        variant={isMobile ? "light" : "brand-light"}
        brandName="Keytuno"
        brandTagline="Overlay Sidebar"
        showItemIcons={false}
        open
        collapsed={false}
        activeItemId={activeItemId}
        onActiveItemChange={(itemId) => {
          setActiveItemId(itemId);
        }}
        onOpenChange={(nextOpen) => {
          setDrawerOpen(nextOpen);
        }}
        onAction={handleSidebarAction}
        style={{
          position: "fixed",
          insetBlockStart: 0,
          insetBlockEnd: 0,
          insetInlineStart: 0,
          transform: drawerOpen
            ? "translateX(0)"
            : "translateX(calc(-100% - 1.5rem))",
          transition: "transform 220ms ease",
          pointerEvents: drawerOpen ? "auto" : "none",
          zIndex: 40,
        }}
      />
    </div>
  );
}

export const SidebarMenuAndSubmenuPlaybook: Story = {
  name: "Sidebar Menu and Submenu Playbook",
  render: () => (
    <SidebarPlaybookCanvas
      args={{
        size: "md",
        variant: "default",
        defaultCollapsed: false,
        defaultOpen: true,
        closeOnEscape: true,
        showItemIcons: true,
        brandName: "Keytuno",
        brandTagline: "Navigation",
      }}
    />
  ),
};

export const SidebarLongListScrollbarPlaybook: Story = {
  name: "Sidebar Long List Scrollbar Playbook",
  render: () => (
    <SidebarPlaybookCanvas
      args={{
        size: "md",
        variant: "brand-light",
        defaultCollapsed: false,
        defaultOpen: true,
        closeOnEscape: true,
        showItemIcons: true,
        brandName: "Keytuno",
        brandTagline: "Large Data",
      }}
      useLargeData
    />
  ),
};

export const SidebarVariantPlaybook: Story = {
  name: "Sidebar Variant Playbook",
  render: () => (
    <SidebarPlaybookCanvas
      args={{
        size: "md",
        variant: "brand-dark",
        defaultCollapsed: false,
        defaultOpen: true,
        closeOnEscape: true,
        showItemIcons: true,
        brandName: "Keytuno",
        brandTagline: "Brand Dark",
      }}
    />
  ),
};

export const SidebarPlayground: Story = {
  name: "Sidebar Playground",
  args: {
    size: "md",
    variant: "default",
    defaultCollapsed: false,
    defaultOpen: true,
    closeOnEscape: true,
    showItemIcons: true,
    brandName: "Keytuno",
    brandTagline: "Operations",
    onAction: undefined,
    onItemSelect: undefined,
    onCollapsedChange: undefined,
    onOpenChange: undefined,
    onActiveItemChange: undefined,
  },
  argTypes: actionArgTypes,
  render: (args) => <SidebarPlaybookCanvas args={args} />,
};

export const NavbarSidebarPagePlaybook: Story = {
  name: "Navbar Sidebar Page Playbook",
  parameters: {
    layout: "fullscreen",
  },
  render: () => <PagePlaybook />,
};

export const SidebarBackdropOverlayPlaybook: Story = {
  name: "Sidebar Backdrop Overlay Playbook",
  parameters: {
    layout: "fullscreen",
  },
  render: () => <BackdropOverlayPlaybook />,
};
