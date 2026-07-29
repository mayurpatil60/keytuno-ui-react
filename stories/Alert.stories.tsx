import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  type AlertActionContext,
  type AlertSide,
  type AlertSize,
  type AlertVariant,
  type AlertViewportInset,
} from "../src/index";

type PlaygroundArgs = {
  withAction?: boolean;
  onAction?: (context: unknown) => void;
  onOpenChange?: (open: boolean) => void;
};

type AlertPlaygroundArgs = PlaygroundArgs & {
  variant: AlertVariant;
  side: AlertSide;
  size: AlertSize;
  duration: number;
  actionRequired: boolean;
  closeOnEscape: boolean;
  defaultOpen: boolean;
};

type AlertStackPlaygroundArgs = PlaygroundArgs & {
  variant: AlertVariant;
  side: AlertSide;
  size: AlertSize;
  duration: number;
};

type AlertSideGuidePlaygroundArgs = PlaygroundArgs & {
  variant: AlertVariant;
  size: AlertSize;
  duration: number;
};

type AlertVariantPageArgs = PlaygroundArgs & {
  side: AlertSide;
  size: AlertSize;
  duration: number;
  actionRequired: boolean;
  closeOnEscape: boolean;
};

type AlertSizePageArgs = PlaygroundArgs & {
  variant: AlertVariant;
  side: AlertSide;
  duration: number;
  actionRequired: boolean;
  closeOnEscape: boolean;
};

type AlertSideDebugPlaygroundArgs = PlaygroundArgs & {
  variant: AlertVariant;
  size: AlertSize;
  duration: number;
  actionRequired: boolean;
  closeOnEscape: boolean;
  areaMode: "full-viewport" | "custom-area";
  insetTop: number;
  insetRight: number;
  insetBottom: number;
  insetLeft: number;
};

type AlertCustomColorPlaygroundArgs = PlaygroundArgs & {
  variant: AlertVariant;
  side: AlertSide;
  size: AlertSize;
  duration: number;
  defaultOpen: boolean;
  closeOnEscape: boolean;
  backgroundColor: string;
  borderColor: string;
  titleColor: string;
  descriptionColor: string;
  actionColor: string;
};

const variantOptions: AlertVariant[] = [
  "primary",
  "secondary",
  "success",
  "warning",
  "accent",
  "destructive",
  "outline",
  "link",
  "compact",
];

const sideOptions: AlertSide[] = [
  "top-left",
  "bottom-left",
  "bottom-right",
  "top-right",
  "bottom-center",
  "top-center",
];

const sizeOptions: AlertSize[] = ["xs", "sm", "md", "lg"];

const meta: Meta<typeof Alert> = {
  title: "Feedback/Alert",
  component: Alert,
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
  gap: "0.9rem",
  width: "min(820px, 94vw)",
};

const frameStyle: CSSProperties = {
  width: "min(620px, 94vw)",
};

const mutedTextStyle: CSSProperties = {
  margin: 0,
  fontSize: "0.82rem",
  color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
};

const badgeRowStyle: CSSProperties = {
  display: "inline-flex",
  gap: "0.45rem",
  flexWrap: "wrap",
};

const sideGuideGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "0.55rem",
};

const sideGuideCardStyle: CSSProperties = {
  border: "1px dashed var(--ktn-border-muted)",
  borderRadius: "var(--ktn-radius-md, 0.5rem)",
  padding: "0.5rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.35rem",
};

const sideHintByValue: Record<AlertSide, string> = {
  "top-left":
    "Anchors at top-left. New alerts animate in-place over older alerts.",
  "bottom-left":
    "Anchors at bottom-left. New alerts animate in-place over older alerts.",
  "bottom-right":
    "Anchors at bottom-right. New alerts animate in-place over older alerts.",
  "top-right":
    "Anchors at top-right. New alerts animate in-place over older alerts.",
  "bottom-center":
    "Anchors at bottom-center. New alerts animate in-place over older alerts.",
  "top-center":
    "Anchors at top-center. New alerts animate in-place over older alerts.",
};

const sideDebugViewportStyle: CSSProperties = {
  position: "relative",
  width: "min(1100px, 96vw)",
  height: "72vh",
  minHeight: "34rem",
  border: "1px dashed var(--ktn-border-muted, #94a3b8)",
  borderRadius: "0.85rem",
  background:
    "linear-gradient(145deg, color-mix(in srgb, var(--ktn-bg-surface, #ffffff) 88%, #e2e8f0 12%), var(--ktn-bg-surface, #ffffff))",
  overflow: "hidden",
};

const sideDebugInfoStyle: CSSProperties = {
  position: "absolute",
  insetInline: "0.75rem",
  insetBlockStart: "0.6rem",
  fontSize: "0.74rem",
  color: "var(--ktn-text-secondary, #64748b)",
  lineHeight: 1.35,
  zIndex: 1,
};

const sideDebugToolbarStyle: CSSProperties = {
  position: "absolute",
  insetBlockStart: "2.1rem",
  insetInlineEnd: "0.75rem",
  display: "inline-flex",
  gap: "0.4rem",
  flexWrap: "wrap",
  zIndex: 2,
};

const sideDebugAnchorTagStyle: CSSProperties = {
  marginTop: "0.35rem",
  fontSize: "0.66rem",
  lineHeight: 1.2,
  letterSpacing: "0.01em",
  color: "var(--ktn-text-secondary, #64748b)",
  textTransform: "uppercase",
};

const sideDebugAreaLabelStyle: CSSProperties = {
  position: "absolute",
  insetBlockStart: "0.45rem",
  insetInlineStart: "0.55rem",
  fontSize: "0.66rem",
  lineHeight: 1.2,
  letterSpacing: "0.01em",
  color: "var(--ktn-text-secondary, #64748b)",
  textTransform: "uppercase",
  backgroundColor: "var(--ktn-bg-surface, #ffffff)",
  paddingInline: "0.25rem",
};

const sideDebugAnchorPositions: Array<{
  label: string;
  side: AlertSide;
  style: CSSProperties;
}> = [
  {
    label: "Top Left",
    side: "top-left",
    style: {
      position: "absolute",
      insetBlockStart: "5.2rem",
      insetInlineStart: "1rem",
    },
  },
  {
    label: "Top Center",
    side: "top-center",
    style: {
      position: "absolute",
      insetBlockStart: "5.2rem",
      insetInlineStart: "50%",
      transform: "translateX(-50%)",
    },
  },
  {
    label: "Top Right",
    side: "top-right",
    style: {
      position: "absolute",
      insetBlockStart: "5.2rem",
      insetInlineEnd: "1rem",
    },
  },
  {
    label: "Bottom Left",
    side: "bottom-left",
    style: {
      position: "absolute",
      insetBlockEnd: "1rem",
      insetInlineStart: "1rem",
    },
  },
  {
    label: "Bottom Center",
    side: "bottom-center",
    style: {
      position: "absolute",
      insetBlockEnd: "1rem",
      insetInlineStart: "50%",
      transform: "translateX(-50%)",
    },
  },
  {
    label: "Bottom Right",
    side: "bottom-right",
    style: {
      position: "absolute",
      insetBlockEnd: "1rem",
      insetInlineEnd: "1rem",
    },
  },
];

function StackPlaygroundDemo(args: AlertStackPlaygroundArgs): JSX.Element {
  const [items, setItems] = useState<Array<{ id: number; createdAt: number }>>(
    [],
  );
  const nextIdRef = useRef(1);
  const withAction = args.withAction ?? false;

  function spawnAlert(): void {
    const nextId = nextIdRef.current;
    nextIdRef.current += 1;

    setItems((current) => [{ id: nextId, createdAt: Date.now() }, ...current]);
  }

  function spawnBurst(): void {
    spawnAlert();

    window.setTimeout(() => {
      spawnAlert();
    }, 160);

    window.setTimeout(() => {
      spawnAlert();
    }, 320);
  }

  function clearAlerts(): void {
    setItems([]);
  }

  return (
    <Field style={frameStyle}>
      <FieldLabel>Stack Playground</FieldLabel>

      <FieldContent>
        <div
          style={{ display: "inline-flex", gap: "0.5rem", flexWrap: "wrap" }}
        >
          <Button size="sm" variant="primary" onClick={spawnAlert}>
            Add Alert
          </Button>

          <Button size="sm" variant="outline" onClick={spawnBurst}>
            Add Burst
          </Button>

          <Button size="sm" variant="ghost" onClick={clearAlerts}>
            Clear
          </Button>
        </div>

        <p style={{ ...mutedTextStyle, marginTop: "0.5rem" }}>
          New alerts stack over older ones and each closes after its own
          duration timer.
        </p>

        {items.map((item) => (
          <Alert
            key={`stack-alert-${item.id}`}
            defaultOpen
            variant={args.variant}
            side={args.side}
            size={args.size}
            duration={args.duration}
            onAction={
              withAction && args.onAction != null
                ? (context: AlertActionContext) => {
                    args.onAction?.({
                      ...context,
                      alertId: item.id,
                    });
                  }
                : undefined
            }
            onOpenChange={(nextOpen) => {
              if (withAction) {
                args.onOpenChange?.(nextOpen);
              }

              if (!nextOpen) {
                setItems((current) =>
                  current.filter((entry) => entry.id !== item.id),
                );
              }
            }}
          >
            <AlertTitle>Stack Alert #{item.id}</AlertTitle>
            <AlertDescription>
              Created at {new Date(item.createdAt).toLocaleTimeString()} and
              auto-dismisses independently.
            </AlertDescription>
          </Alert>
        ))}

        <FieldDescription>
          Use Add Burst to validate direction-based entry animation and
          automatic stacking.
        </FieldDescription>
      </FieldContent>
    </Field>
  );
}

function SideGuidePlaygroundDemo(
  args: AlertSideGuidePlaygroundArgs,
): JSX.Element {
  const [items, setItems] = useState<
    Array<{ id: number; side: AlertSide; createdAt: number }>
  >([]);
  const nextIdRef = useRef(1);
  const withAction = args.withAction ?? false;

  function triggerSide(side: AlertSide): void {
    const nextId = nextIdRef.current;
    nextIdRef.current += 1;

    setItems((current) => [
      { id: nextId, side, createdAt: Date.now() },
      ...current,
    ]);
  }

  function triggerAllSides(): void {
    sideOptions.forEach((side, index) => {
      window.setTimeout(() => {
        triggerSide(side);
      }, index * 120);
    });
  }

  function clearAlerts(): void {
    setItems([]);
  }

  return (
    <Field style={frameStyle}>
      <FieldLabel>Side Position Guide</FieldLabel>

      <FieldContent>
        <p style={mutedTextStyle}>
          Trigger alerts by side to learn entry direction and stacking behavior
          for each position.
        </p>

        <div style={badgeRowStyle}>
          <Button size="xs" variant="primary" onClick={triggerAllSides}>
            Trigger All Sides
          </Button>

          <Button size="xs" variant="outline" onClick={clearAlerts}>
            Clear
          </Button>
        </div>

        <div style={sideGuideGridStyle}>
          {sideOptions.map((side) => (
            <div key={`side-guide-${side}`} style={sideGuideCardStyle}>
              <strong style={{ fontSize: "0.8rem" }}>{side}</strong>
              <p style={{ ...mutedTextStyle, fontSize: "0.76rem" }}>
                {sideHintByValue[side]}
              </p>
              <div>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => triggerSide(side)}
                >
                  Trigger {side}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {items.map((item) => (
          <Alert
            key={`side-guide-alert-${item.id}`}
            defaultOpen
            variant={args.variant}
            side={item.side}
            size={args.size}
            duration={args.duration}
            onAction={
              withAction && args.onAction != null
                ? (context: AlertActionContext) => {
                    args.onAction?.({
                      ...context,
                      alertId: item.id,
                    });
                  }
                : undefined
            }
            onOpenChange={(nextOpen) => {
              if (withAction) {
                args.onOpenChange?.(nextOpen);
              }

              if (!nextOpen) {
                setItems((current) =>
                  current.filter((entry) => entry.id !== item.id),
                );
              }
            }}
          >
            <AlertTitle>{item.side}</AlertTitle>
            <AlertDescription>
              Spawned at {new Date(item.createdAt).toLocaleTimeString()} to show
              side behavior.
            </AlertDescription>
          </Alert>
        ))}

        <FieldDescription>
          Use Trigger All Sides for a quick side-by-side behavior check across
          all six positions.
        </FieldDescription>
      </FieldContent>
    </Field>
  );
}

interface SideDebugAnchorProps {
  label: string;
  side: AlertSide;
  style: CSSProperties;
  onTrigger: (side: AlertSide) => void;
}

function SideDebugAnchor({
  label,
  side,
  style,
  onTrigger,
}: SideDebugAnchorProps): JSX.Element {
  return (
    <div style={style}>
      <Button size="xs" variant="outline" onClick={() => onTrigger(side)}>
        {label}
      </Button>
      <div style={sideDebugAnchorTagStyle}>{`side = ${side}`}</div>
    </div>
  );
}

function resolveDebugViewportInset(
  args: AlertSideDebugPlaygroundArgs,
): AlertViewportInset | undefined {
  if (args.areaMode !== "custom-area") {
    return undefined;
  }

  return {
    top: Math.max(args.insetTop, 0),
    right: Math.max(args.insetRight, 0),
    bottom: Math.max(args.insetBottom, 0),
    left: Math.max(args.insetLeft, 0),
  };
}

function VariantsPageDemo(args: AlertVariantPageArgs): JSX.Element {
  const withAction = args.withAction ?? false;
  const [openByVariant, setOpenByVariant] = useState<
    Record<AlertVariant, boolean>
  >(
    () =>
      Object.fromEntries(
        variantOptions.map((variant) => [variant, true]),
      ) as Record<AlertVariant, boolean>,
  );

  useEffect(() => {
    setOpenByVariant(
      Object.fromEntries(
        variantOptions.map((variant) => [variant, true]),
      ) as Record<AlertVariant, boolean>,
    );
  }, [
    args.side,
    args.size,
    args.duration,
    args.actionRequired,
    args.closeOnEscape,
  ]);

  function reopenAll(): void {
    setOpenByVariant(
      Object.fromEntries(
        variantOptions.map((variant) => [variant, true]),
      ) as Record<AlertVariant, boolean>,
    );
  }

  return (
    <Field style={frameStyle}>
      <FieldLabel>Variants</FieldLabel>

      <FieldContent>
        <p style={mutedTextStyle}>
          Separate page to compare all variants with same size and side.
        </p>

        <div style={badgeRowStyle}>
          <Badge variant="secondary">side: {args.side}</Badge>
          <Badge variant="outline">size: {args.size}</Badge>
          <Button size="xs" variant="outline" onClick={reopenAll}>
            Reopen All Variants
          </Button>
        </div>

        {variantOptions.map((variant) => (
          <Alert
            key={`variant-page-${variant}-${args.side}-${args.size}-${args.duration}`}
            open={openByVariant[variant]}
            variant={variant}
            side={args.side}
            size={args.size}
            duration={args.duration}
            actionRequired={args.actionRequired}
            closeOnEscape={args.closeOnEscape}
            onOpenChange={(nextOpen) => {
              setOpenByVariant((current) => ({
                ...current,
                [variant]: nextOpen,
              }));

              if (withAction) {
                args.onOpenChange?.(nextOpen);
              }
            }}
            onAction={
              withAction && args.onAction != null
                ? (context: AlertActionContext) => {
                    args.onAction?.({
                      ...context,
                      debugVariant: variant,
                    });
                  }
                : undefined
            }
          >
            <AlertTitle>{`Variant: ${variant}`}</AlertTitle>
            <AlertDescription>
              Compare visual treatment while behavior remains consistent.
            </AlertDescription>
            {args.actionRequired ? (
              <AlertAction closeOnAction>Resolve</AlertAction>
            ) : null}
          </Alert>
        ))}

        <FieldDescription>
          Use this page to compare primary, secondary, destructive, outline,
          link, and compact.
        </FieldDescription>
      </FieldContent>
    </Field>
  );
}

function SizesPageDemo(args: AlertSizePageArgs): JSX.Element {
  const withAction = args.withAction ?? false;
  const [openBySize, setOpenBySize] = useState<Record<AlertSize, boolean>>(
    () =>
      Object.fromEntries(sizeOptions.map((size) => [size, true])) as Record<
        AlertSize,
        boolean
      >,
  );

  useEffect(() => {
    setOpenBySize(
      Object.fromEntries(sizeOptions.map((size) => [size, true])) as Record<
        AlertSize,
        boolean
      >,
    );
  }, [
    args.variant,
    args.side,
    args.duration,
    args.actionRequired,
    args.closeOnEscape,
  ]);

  function reopenAll(): void {
    setOpenBySize(
      Object.fromEntries(sizeOptions.map((size) => [size, true])) as Record<
        AlertSize,
        boolean
      >,
    );
  }

  return (
    <Field style={frameStyle}>
      <FieldLabel>Sizes</FieldLabel>

      <FieldContent>
        <p style={mutedTextStyle}>
          Separate page to compare xs, sm, md, and lg sizes.
        </p>

        <div style={badgeRowStyle}>
          <Badge variant="secondary">variant: {args.variant}</Badge>
          <Badge variant="outline">side: {args.side}</Badge>
          <Button size="xs" variant="outline" onClick={reopenAll}>
            Reopen All Sizes
          </Button>
        </div>

        {sizeOptions.map((size) => (
          <Alert
            key={`size-page-${size}-${args.variant}-${args.side}-${args.duration}`}
            open={openBySize[size]}
            variant={args.variant}
            side={args.side}
            size={size}
            duration={args.duration}
            actionRequired={args.actionRequired}
            closeOnEscape={args.closeOnEscape}
            onOpenChange={(nextOpen) => {
              setOpenBySize((current) => ({
                ...current,
                [size]: nextOpen,
              }));

              if (withAction) {
                args.onOpenChange?.(nextOpen);
              }
            }}
            onAction={
              withAction && args.onAction != null
                ? (context: AlertActionContext) => {
                    args.onAction?.({
                      ...context,
                      debugSize: size,
                    });
                  }
                : undefined
            }
          >
            <AlertTitle>{`Size: ${size}`}</AlertTitle>
            <AlertDescription>
              Compare typography, spacing, and close-action affordance across
              sizes.
            </AlertDescription>
            {args.actionRequired ? (
              <AlertAction closeOnAction>Resolve</AlertAction>
            ) : null}
          </Alert>
        ))}

        <FieldDescription>
          Use this page to validate scale and readability between xs, sm, md,
          and lg.
        </FieldDescription>
      </FieldContent>
    </Field>
  );
}

function SideDebugPlaygroundDemo(
  args: AlertSideDebugPlaygroundArgs,
): JSX.Element {
  const withAction = args.withAction ?? false;
  const viewportInset = resolveDebugViewportInset(args);
  const [items, setItems] = useState<
    Array<{ id: number; side: AlertSide; createdAt: number }>
  >([]);
  const nextIdRef = useRef(1);

  function triggerSide(side: AlertSide): void {
    const nextId = nextIdRef.current;
    nextIdRef.current += 1;

    setItems((current) => [
      { id: nextId, side, createdAt: Date.now() },
      ...current,
    ]);
  }

  function triggerAllSides(): void {
    sideOptions.forEach((side, index) => {
      window.setTimeout(() => {
        triggerSide(side);
      }, index * 140);
    });
  }

  function clearAlerts(): void {
    setItems([]);
  }

  const customAreaStyle: CSSProperties | undefined =
    viewportInset == null
      ? undefined
      : {
          position: "absolute",
          top: `${viewportInset.top ?? 14}px`,
          right: `${viewportInset.right ?? 14}px`,
          bottom: `${viewportInset.bottom ?? 14}px`,
          left: `${viewportInset.left ?? 14}px`,
          border:
            "1px dashed color-mix(in srgb, var(--ktn-action-primary-bg) 55%, #94a3b8)",
          borderRadius: "0.7rem",
          pointerEvents: "none",
          zIndex: 1,
        };

  return (
    <div style={{ padding: "1rem", display: "flex", justifyContent: "center" }}>
      <div style={sideDebugViewportStyle}>
        <div style={sideDebugInfoStyle}>
          Side debug mirrors DropdownMenu style: trigger each side and inspect
          entry direction, overlay order, and placement. Switch area mode to
          test full viewport vs custom bounds.
        </div>

        <div style={sideDebugToolbarStyle}>
          <Button size="xs" variant="primary" onClick={triggerAllSides}>
            Trigger All Sides
          </Button>
          <Button size="xs" variant="outline" onClick={clearAlerts}>
            Clear
          </Button>
        </div>

        {customAreaStyle != null ? (
          <div style={customAreaStyle}>
            <div style={sideDebugAreaLabelStyle}>Custom Alert Area</div>
          </div>
        ) : null}

        {sideDebugAnchorPositions.map((anchor) => (
          <SideDebugAnchor
            key={`alert-side-debug-${anchor.label}-${anchor.side}`}
            label={anchor.label}
            side={anchor.side}
            style={anchor.style}
            onTrigger={triggerSide}
          />
        ))}

        {items.map((item) => (
          <Alert
            key={`side-debug-alert-${item.id}`}
            defaultOpen
            variant={args.variant}
            side={item.side}
            size={args.size}
            duration={args.duration}
            actionRequired={args.actionRequired}
            closeOnEscape={args.closeOnEscape}
            viewportInset={viewportInset}
            onOpenChange={(nextOpen) => {
              if (withAction) {
                args.onOpenChange?.(nextOpen);
              }

              if (!nextOpen) {
                setItems((current) =>
                  current.filter((entry) => entry.id !== item.id),
                );
              }
            }}
            onAction={
              withAction && args.onAction != null
                ? (context: AlertActionContext) => {
                    args.onAction?.({
                      ...context,
                      alertId: item.id,
                      emittedSide: item.side,
                    });
                  }
                : undefined
            }
          >
            <AlertTitle>{`Side: ${item.side}`}</AlertTitle>
            <AlertDescription>
              Created at {new Date(item.createdAt).toLocaleTimeString()} for
              side-debug testing.
            </AlertDescription>
            {args.actionRequired ? (
              <AlertAction closeOnAction>Resolve</AlertAction>
            ) : null}
          </Alert>
        ))}
      </div>
    </div>
  );
}

export const Basic: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <div style={stackStyle}>
        <h3 style={{ margin: 0 }}>Basic</h3>

        <Field style={frameStyle}>
          <FieldLabel>Alert Anatomy</FieldLabel>

          <FieldContent>
            <p style={mutedTextStyle}>
              Alert includes close button by default and supports title,
              description, and action.
            </p>

            <div style={badgeRowStyle}>
              <Badge variant="secondary">variant: primary</Badge>
              <Badge variant="outline">side: top-right</Badge>
              <Badge variant="outline">size: md</Badge>
              <Button
                size="xs"
                variant="outline"
                onClick={() => setIsOpen(true)}
              >
                Show Alert
              </Button>
            </div>

            <Alert
              open={isOpen}
              onOpenChange={setIsOpen}
              side="top-right"
              variant="primary"
              size="md"
              duration={30000}
            >
              <AlertTitle>Order Update</AlertTitle>
              <AlertDescription>
                Your limit order was placed successfully and is waiting for
                execution.
              </AlertDescription>
              <AlertAction closeOnAction>Acknowledge</AlertAction>
            </Alert>

            <FieldDescription>
              This alert uses composable primitives: AlertTitle,
              AlertDescription, and AlertAction.
            </FieldDescription>
          </FieldContent>
        </Field>
      </div>
    );
  },
};

export const Variants: Story = {
  name: "Variants",
  args: {
    side: "top-right",
    size: "md",
    duration: 30000,
    actionRequired: false,
    closeOnEscape: true,
    withAction: false,
  } as AlertVariantPageArgs,
  argTypes: {
    side: { control: "select", options: sideOptions },
    size: { control: "select", options: sizeOptions },
    duration: { control: { type: "number", min: 0, step: 500 } },
    actionRequired: { control: "boolean" },
    closeOnEscape: { control: "boolean" },
    withAction: { control: "boolean" },
    onAction: { action: "action" },
    onOpenChange: { action: "open-change" },
    open: { table: { disable: true } },
    defaultOpen: { table: { disable: true } },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (rawArgs) => (
    <VariantsPageDemo {...(rawArgs as AlertVariantPageArgs)} />
  ),
};

export const Sizes: Story = {
  name: "Sizes",
  args: {
    variant: "primary",
    side: "top-right",
    duration: 30000,
    actionRequired: false,
    closeOnEscape: true,
    withAction: false,
  } as AlertSizePageArgs,
  argTypes: {
    variant: { control: "select", options: variantOptions },
    side: { control: "select", options: sideOptions },
    duration: { control: { type: "number", min: 0, step: 500 } },
    actionRequired: { control: "boolean" },
    closeOnEscape: { control: "boolean" },
    withAction: { control: "boolean" },
    size: { table: { disable: true } },
    onAction: { action: "action" },
    onOpenChange: { action: "open-change" },
    open: { table: { disable: true } },
    defaultOpen: { table: { disable: true } },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (rawArgs) => <SizesPageDemo {...(rawArgs as AlertSizePageArgs)} />,
};

export const AlertPlayground: Story = {
  name: "Alert Playground",
  args: {
    variant: "primary",
    side: "top-right",
    size: "md",
    duration: 30000,
    actionRequired: false,
    closeOnEscape: true,
    defaultOpen: true,
    withAction: false,
  } as AlertPlaygroundArgs,
  argTypes: {
    variant: { control: "select", options: variantOptions },
    side: { control: "select", options: sideOptions },
    size: { control: "select", options: sizeOptions },
    duration: { control: { type: "number", min: 0, step: 500 } },
    actionRequired: { control: "boolean" },
    closeOnEscape: { control: "boolean" },
    defaultOpen: { control: "boolean" },
    withAction: { control: "boolean" },
    onAction: { action: "action" },
    onOpenChange: { action: "open-change" },
    open: { table: { disable: true } },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (rawArgs) => {
    const args = rawArgs as AlertPlaygroundArgs;
    const withAction = args.withAction ?? false;
    const [isOpen, setIsOpen] = useState(args.defaultOpen);

    useEffect(() => {
      setIsOpen(args.defaultOpen);
    }, [args.defaultOpen]);

    function handleOpenChange(nextOpen: boolean): void {
      setIsOpen(nextOpen);

      if (withAction) {
        args.onOpenChange?.(nextOpen);
      }
    }

    return (
      <Field style={frameStyle}>
        <FieldLabel>Interactive Playground</FieldLabel>

        <FieldContent>
          <div style={badgeRowStyle}>
            <Badge variant="secondary">
              Duration: {Math.round(args.duration / 1000)}s
            </Badge>
            <Badge variant={args.actionRequired ? "primary" : "outline"}>
              {args.actionRequired ? "Action Required" : "Auto Dismiss"}
            </Badge>
            <Button size="xs" variant="outline" onClick={() => setIsOpen(true)}>
              Show Alert
            </Button>
          </div>

          <Alert
            key={`${args.variant}-${args.side}-${args.size}-${args.duration}-${args.actionRequired}-${args.closeOnEscape}-${withAction}`}
            open={isOpen}
            side={args.side}
            variant={args.variant}
            size={args.size}
            duration={args.duration}
            actionRequired={args.actionRequired}
            closeOnEscape={args.closeOnEscape}
            onOpenChange={handleOpenChange}
            onAction={withAction ? args.onAction : undefined}
          >
            <AlertTitle>Playground Alert</AlertTitle>
            <AlertDescription>
              Configure variant, side, size, and timer behavior from controls.
            </AlertDescription>
            {args.actionRequired ? (
              <AlertAction closeOnAction>Resolve</AlertAction>
            ) : null}
          </Alert>

          <FieldDescription>
            Toggle actionRequired to keep alert visible until user interacts.
          </FieldDescription>
        </FieldContent>
      </Field>
    );
  },
};

export const AlertStackPlayground: Story = {
  name: "Alert Stack Playground",
  args: {
    variant: "secondary",
    side: "top-right",
    size: "md",
    duration: 30000,
    withAction: false,
  } as AlertStackPlaygroundArgs,
  argTypes: {
    variant: { control: "select", options: variantOptions },
    side: { control: "select", options: sideOptions },
    size: { control: "select", options: sizeOptions },
    duration: { control: { type: "number", min: 0, step: 500 } },
    withAction: { control: "boolean" },
    onAction: { action: "action" },
    onOpenChange: { action: "open-change" },
    open: { table: { disable: true } },
    defaultOpen: { table: { disable: true } },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (rawArgs) => (
    <StackPlaygroundDemo {...(rawArgs as AlertStackPlaygroundArgs)} />
  ),
};

export const DirectionSide: Story = {
  name: "Direction Side",
  args: {
    variant: "primary",
    size: "md",
    duration: 30000,
    withAction: false,
  } as AlertSideGuidePlaygroundArgs,
  argTypes: {
    variant: { control: "select", options: variantOptions },
    size: { control: "select", options: sizeOptions },
    duration: { control: { type: "number", min: 0, step: 500 } },
    withAction: { control: "boolean" },
    onAction: { action: "action" },
    onOpenChange: { action: "open-change" },
    side: { table: { disable: true } },
    open: { table: { disable: true } },
    defaultOpen: { table: { disable: true } },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (rawArgs) => (
    <SideGuidePlaygroundDemo {...(rawArgs as AlertSideGuidePlaygroundArgs)} />
  ),
};

export const SideDebug: Story = {
  name: "Side Debug",
  parameters: {
    layout: "fullscreen",
  },
  args: {
    variant: "primary",
    size: "md",
    duration: 30000,
    actionRequired: false,
    closeOnEscape: true,
    areaMode: "full-viewport",
    insetTop: 72,
    insetRight: 80,
    insetBottom: 96,
    insetLeft: 80,
    withAction: false,
  } as AlertSideDebugPlaygroundArgs,
  argTypes: {
    variant: { control: "select", options: variantOptions },
    size: { control: "select", options: sizeOptions },
    duration: { control: { type: "number", min: 0, step: 500 } },
    actionRequired: { control: "boolean" },
    closeOnEscape: { control: "boolean" },
    areaMode: {
      control: "inline-radio",
      options: ["full-viewport", "custom-area"],
    },
    insetTop: { control: { type: "number", min: 0, step: 4 } },
    insetRight: { control: { type: "number", min: 0, step: 4 } },
    insetBottom: { control: { type: "number", min: 0, step: 4 } },
    insetLeft: { control: { type: "number", min: 0, step: 4 } },
    withAction: { control: "boolean" },
    side: { table: { disable: true } },
    onAction: { action: "action" },
    onOpenChange: { action: "open-change" },
    open: { table: { disable: true } },
    defaultOpen: { table: { disable: true } },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (rawArgs) => (
    <SideDebugPlaygroundDemo {...(rawArgs as AlertSideDebugPlaygroundArgs)} />
  ),
};

export const AlertActionRequiredPlayground: Story = {
  name: "Action Required Playground",
  args: {
    variant: "destructive",
    side: "bottom-right",
    size: "md",
    duration: 30000,
    closeOnEscape: true,
    defaultOpen: true,
    withAction: false,
  } as AlertPlaygroundArgs,
  argTypes: {
    variant: { control: "select", options: variantOptions },
    side: { control: "select", options: sideOptions },
    size: { control: "select", options: sizeOptions },
    duration: { control: { type: "number", min: 0, step: 500 } },
    closeOnEscape: { control: "boolean" },
    defaultOpen: { control: "boolean" },
    withAction: { control: "boolean" },
    onAction: { action: "action" },
    onOpenChange: { action: "open-change" },
    open: { table: { disable: true } },
    actionRequired: { table: { disable: true } },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (rawArgs) => {
    const args = rawArgs as AlertPlaygroundArgs;
    const withAction = args.withAction ?? false;
    const [isOpen, setIsOpen] = useState(args.defaultOpen);

    useEffect(() => {
      setIsOpen(args.defaultOpen);
    }, [args.defaultOpen]);

    function handleOpenChange(nextOpen: boolean): void {
      setIsOpen(nextOpen);

      if (withAction) {
        args.onOpenChange?.(nextOpen);
      }
    }

    return (
      <Field style={frameStyle}>
        <FieldLabel>Action Required Playground</FieldLabel>

        <FieldContent>
          <div style={badgeRowStyle}>
            <Badge variant="primary">Persistent Until Action</Badge>
            <Button size="xs" variant="outline" onClick={() => setIsOpen(true)}>
              Show Alert
            </Button>
          </div>

          <Alert
            key={`action-required-${args.variant}-${args.side}-${args.size}-${withAction}`}
            open={isOpen}
            variant={args.variant}
            side={args.side}
            size={args.size}
            duration={args.duration}
            actionRequired
            closeOnEscape={args.closeOnEscape}
            onOpenChange={handleOpenChange}
            onAction={withAction ? args.onAction : undefined}
          >
            <AlertTitle>Action Required: KYC Verification</AlertTitle>
            <AlertDescription>
              This alert stays visible until user action is completed.
            </AlertDescription>
            <AlertAction closeOnAction>Upload Documents</AlertAction>
          </Alert>

          <FieldDescription>
            Actionable alert remains on screen until the user completes an
            action or closes it.
          </FieldDescription>
        </FieldContent>
      </Field>
    );
  },
};

export const AlertCustomColorPlayground: Story = {
  name: "Custom Color Playground",
  args: {
    variant: "outline",
    side: "top-center",
    size: "md",
    duration: 30000,
    defaultOpen: true,
    closeOnEscape: true,
    backgroundColor: "#fff7ed",
    borderColor: "#fb923c",
    titleColor: "#9a3412",
    descriptionColor: "#7c2d12",
    actionColor: "#c2410c",
    withAction: false,
  } as AlertCustomColorPlaygroundArgs,
  argTypes: {
    variant: { control: "select", options: variantOptions },
    side: { control: "select", options: sideOptions },
    size: { control: "select", options: sizeOptions },
    duration: { control: { type: "number", min: 0, step: 500 } },
    defaultOpen: { control: "boolean" },
    closeOnEscape: { control: "boolean" },
    backgroundColor: { control: "color" },
    borderColor: { control: "color" },
    titleColor: { control: "color" },
    descriptionColor: { control: "color" },
    actionColor: { control: "color" },
    withAction: { control: "boolean" },
    onAction: { action: "action" },
    onOpenChange: { action: "open-change" },
    open: { table: { disable: true } },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (rawArgs) => {
    const args = rawArgs as AlertCustomColorPlaygroundArgs;
    const withAction = args.withAction ?? false;
    const [isOpen, setIsOpen] = useState(args.defaultOpen);

    useEffect(() => {
      setIsOpen(args.defaultOpen);
    }, [args.defaultOpen]);

    function handleOpenChange(nextOpen: boolean): void {
      setIsOpen(nextOpen);

      if (withAction) {
        args.onOpenChange?.(nextOpen);
      }
    }

    return (
      <Field style={frameStyle}>
        <FieldLabel>Custom Color Playground</FieldLabel>

        <FieldContent>
          <div style={badgeRowStyle}>
            <Badge variant="outline">customColors enabled</Badge>
            <Button size="xs" variant="outline" onClick={() => setIsOpen(true)}>
              Show Alert
            </Button>
          </div>

          <Alert
            key={`custom-${args.variant}-${args.side}-${args.size}-${args.backgroundColor}-${args.borderColor}-${args.titleColor}-${args.descriptionColor}-${args.actionColor}-${withAction}`}
            open={isOpen}
            variant={args.variant}
            side={args.side}
            size={args.size}
            duration={args.duration}
            closeOnEscape={args.closeOnEscape}
            onOpenChange={handleOpenChange}
            customColors={{
              backgroundColor: args.backgroundColor,
              borderColor: args.borderColor,
              titleColor: args.titleColor,
              descriptionColor: args.descriptionColor,
              actionColor: args.actionColor,
            }}
            onAction={withAction ? args.onAction : undefined}
          >
            <AlertTitle>Custom Color Alert</AlertTitle>
            <AlertDescription>
              Configure brand-specific colors while keeping the alert structure
              and behavior.
            </AlertDescription>
            <AlertAction>Review</AlertAction>
          </Alert>

          <FieldDescription>
            Use customColors to override background, border, text, and action
            tones.
          </FieldDescription>
        </FieldContent>
      </Field>
    );
  },
};
