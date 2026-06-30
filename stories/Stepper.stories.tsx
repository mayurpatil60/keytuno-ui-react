import { useState, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import {
  FiCheckCircle,
  FiClipboard,
  FiCreditCard,
  FiFileText,
  FiPackage,
  FiShield,
  FiTruck,
  FiUser,
} from "react-icons/fi";

import {
  Button,
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Stepper,
  type StepperActionContext,
  type StepperProps,
  type StepperStep,
} from "../src/index";

const meta: Meta<typeof Stepper> = {
  title: "Navigation/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;
type StepperDataset = "basic" | "with-substeps" | "disabled";
type StepperControlMode =
  | "default"
  | "with-icons"
  | "without-icons"
  | "only-icons";

type StepperPlaygroundArgs = StepperProps & {
  dataset: StepperDataset;
  controlMode: StepperControlMode;
};

const fallbackOnAction = action("action");
const fallbackOnActiveStepChange = action("active-step-change");
const fallbackOnOpenStepIdsChange = action("open-step-ids-change");
const fallbackOnActiveSubstepChange = action("active-substep-change");
const fallbackOnSubmit = action("submit");

const stackStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  width: "min(1120px, 96vw)",
  maxWidth: "100%",
};

const frameStyle: CSSProperties = {
  width: "100%",
  maxWidth: "100%",
};

const stepContentStyle: CSSProperties = {
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: "0.35rem",
  fontSize: "0.82rem",
  color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
};

const defaultSteps: StepperStep[] = [
  {
    id: "profile",
    title: "Profile Setup",
    shortDescription: "Owner and contact details",
    description:
      "Add account owner details and your primary communication channels.",
    icon: <FiUser size={14} aria-hidden />,
    completed: true,
    defaultOpen: true,
    content: (
      <p style={stepContentStyle}>
        Profile is complete. You can edit owner and support contact details any
        time.
      </p>
    ),
  },
  {
    id: "identity",
    title: "Identity Verification",
    shortDescription: "KYC and regulatory checks",
    description:
      "Upload ID proofs and complete compliance verification before moving ahead.",
    icon: <FiShield size={14} aria-hidden />,
    content: (
      <p style={stepContentStyle}>
        Keep your legal name and tax details exactly as per official documents.
      </p>
    ),
  },
  {
    id: "billing",
    title: "Billing Setup",
    shortDescription: "Plans, GST and invoices",
    description:
      "Configure plan billing cycle, taxation rules, and invoice recipients.",
    icon: <FiCreditCard size={14} aria-hidden />,
    content: (
      <p style={stepContentStyle}>
        Billing cycle updates are applied from the next invoice period.
      </p>
    ),
  },
  {
    id: "review",
    title: "Review & Submit",
    shortDescription: "Final validation",
    description:
      "Verify all details, submit setup, and start inviting workspace members.",
    icon: <FiCheckCircle size={14} aria-hidden />,
    defaultOpen: true,
    content: <p style={stepContentStyle}>Submit once all steps are green.</p>,
  },
];

const substepSteps: StepperStep[] = [
  {
    id: "catalog",
    title: "Catalog Configuration",
    shortDescription: "Products and pricing",
    description:
      "Configure catalog data and list products for your initial storefront release.",
    icon: <FiPackage size={14} aria-hidden />,
    defaultOpen: true,
    substeps: [
      {
        id: "catalog-groups",
        title: "Grouping & taxonomy",
        shortDescription: "Create category hierarchy",
        completed: true,
      },
      {
        id: "catalog-pricing",
        title: "Pricing rules",
        shortDescription: "Tiered and regional pricing",
      },
    ],
    content: (
      <p style={stepContentStyle}>
        Use substeps to track configuration milestones within each phase.
      </p>
    ),
  },
  {
    id: "documents",
    title: "Document Verification",
    shortDescription: "Compliance files",
    description:
      "Upload all required files and set verification owner for approvals.",
    icon: <FiFileText size={14} aria-hidden />,
    substeps: [
      {
        id: "documents-pan",
        title: "PAN / Tax registration",
        shortDescription: "Mandatory",
        completed: true,
      },
      {
        id: "documents-gst",
        title: "GST certificate",
        shortDescription: "Mandatory",
      },
      {
        id: "documents-bank",
        title: "Bank proof",
        shortDescription: "Optional",
        disabled: true,
      },
    ],
    content: (
      <p style={stepContentStyle}>
        Disabled substeps can be hidden via Stepper props and remain
        non-interactive when shown.
      </p>
    ),
  },
  {
    id: "dispatch",
    title: "Dispatch & Handover",
    shortDescription: "Shipping readiness",
    description:
      "Prepare pack-slip templates and complete dispatch workflow checks.",
    icon: <FiTruck size={14} aria-hidden />,
    defaultOpen: true,
    substeps: [
      {
        id: "dispatch-carrier",
        title: "Carrier mapping",
        shortDescription: "Assign preferred partners",
      },
      {
        id: "dispatch-sla",
        title: "Service-level checks",
        shortDescription: "Define SLA alerts",
      },
    ],
  },
];

const disabledSteps: StepperStep[] = [
  {
    id: "draft",
    title: "Draft",
    shortDescription: "Seed data",
    description: "Draft can be edited until submitted for review.",
    icon: <FiClipboard size={14} aria-hidden />,
    completed: true,
    defaultOpen: true,
  },
  {
    id: "review",
    title: "Review",
    shortDescription: "Manager approval",
    description: "Manager review is currently blocked due to missing reviewer.",
    icon: <FiShield size={14} aria-hidden />,
    disabled: true,
  },
  {
    id: "publish",
    title: "Publish",
    shortDescription: "Go live",
    description: "Publish unlocks only after review is approved.",
    icon: <FiCheckCircle size={14} aria-hidden />,
    disabled: true,
  },
];

const disabledNoLockSteps: StepperStep[] = [
  {
    id: "first-disabled",
    title: "First (Disabled)",
    shortDescription: "Must toggle open/close",
    description:
      "This is a disabled first step. You should still be able to open and close this card.",
    icon: <FiShield size={14} aria-hidden />,
    disabled: true,
    defaultOpen: true,
  },
  {
    id: "middle-enabled",
    title: "Middle (Enabled)",
    shortDescription: "Reference state",
    description:
      "Enabled step for reference. Open/close from title, icon area, and chevron.",
    icon: <FiClipboard size={14} aria-hidden />,
  },
  {
    id: "middle-disabled",
    title: "Middle (Disabled)",
    shortDescription: "Must toggle open/close",
    description:
      "This is a disabled middle step. It should also always open and close.",
    icon: <FiShield size={14} aria-hidden />,
    disabled: true,
  },
  {
    id: "last-disabled",
    title: "Last (Disabled)",
    shortDescription: "Must toggle open/close",
    description:
      "This is a disabled last step. Open/close behavior should match other steps.",
    icon: <FiCheckCircle size={14} aria-hidden />,
    disabled: true,
    defaultOpen: true,
  },
];

function resolveSteps(dataset: StepperDataset): StepperStep[] {
  if (dataset === "with-substeps") {
    return substepSteps;
  }

  if (dataset === "disabled") {
    return disabledSteps;
  }

  return defaultSteps;
}

function resolveControls(mode: StepperControlMode): StepperProps["controls"] {
  if (mode === "without-icons") {
    return {
      previous: { showIcon: false },
      next: { showIcon: false },
      submit: { showIcon: false },
    };
  }

  if (mode === "only-icons") {
    return {
      previous: {
        iconOnly: true,
        ariaLabel: "Previous step",
      },
      next: {
        iconOnly: true,
        ariaLabel: "Next step",
      },
      submit: {
        iconOnly: true,
        ariaLabel: "Submit stepper",
      },
    };
  }

  if (mode === "with-icons") {
    return {
      previous: {
        showIcon: true,
        iconPosition: "left",
      },
      next: {
        showIcon: true,
        iconPosition: "right",
      },
      submit: {
        showIcon: true,
        iconPosition: "left",
      },
    };
  }

  return undefined;
}

function ControlledStateDemo(): JSX.Element {
  const [activeStepId, setActiveStepId] = useState<string>("identity");
  const [openStepIds, setOpenStepIds] = useState<string[]>([
    "profile",
    "identity",
    "review",
  ]);

  return (
    <div style={stackStyle}>
      <Stepper
        steps={defaultSteps}
        activeStepId={activeStepId}
        openStepIds={openStepIds}
        collapsible
        allowMultipleOpen
        onAction={(context: StepperActionContext) => {
          fallbackOnAction(context);
        }}
        onActiveStepChange={(stepId) => {
          setActiveStepId(stepId);
          fallbackOnActiveStepChange(stepId);
        }}
        onOpenStepIdsChange={(ids) => {
          setOpenStepIds(ids);
          fallbackOnOpenStepIdsChange(ids);
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.45rem",
        }}
      >
        {defaultSteps.map((step) => (
          <Button
            key={step.id}
            size="xs"
            variant={activeStepId === step.id ? "primary" : "outline"}
            onAction={() => {
              setActiveStepId(step.id);
              fallbackOnActiveStepChange(step.id);
            }}
          >
            {step.title}
          </Button>
        ))}
      </div>

      <FieldDescription>
        Active step and open steps are fully controlled from props. Use quick
        buttons and stepper UI to inspect emitted actions.
      </FieldDescription>
    </div>
  );
}

export const VerticalDefault: Story = {
  name: "Vertical (Default)",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Default Vertical Stepper</h3>

      <Field style={frameStyle}>
        <FieldLabel>Account Onboarding</FieldLabel>

        <FieldContent>
          <Stepper
            steps={defaultSteps}
            variant="vertical"
            defaultActiveStepId="identity"
            onAction={fallbackOnAction}
          />

          <FieldDescription>
            Vertical layout supports title, description, short description, and
            action-enabled navigation controls.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const HorizontalVariant: Story = {
  name: "Horizontal",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Horizontal Stepper</h3>

      <Field style={frameStyle}>
        <FieldLabel>Checkout Flow</FieldLabel>

        <FieldContent>
          <Stepper
            steps={defaultSteps}
            variant="horizontal"
            defaultActiveStepId="billing"
            onAction={fallbackOnAction}
          />

          <FieldDescription>
            Horizontal variant keeps step cards in a single row and still
            preserves keyboard navigation.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const CompactVariants: Story = {
  name: "Compact Variants",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Compact Vertical + Compact Horizontal</h3>

      <FieldGroup style={frameStyle}>
        <Field>
          <FieldLabel>Compact Vertical</FieldLabel>

          <FieldContent>
            <Stepper
              steps={defaultSteps}
              variant="compact-vertical"
              size="sm"
              defaultActiveStepId="identity"
              onAction={fallbackOnAction}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Compact Horizontal</FieldLabel>

          <FieldContent>
            <Stepper
              steps={defaultSteps}
              variant="compact-horizontal"
              size="sm"
              defaultActiveStepId="billing"
              onAction={fallbackOnAction}
            />
          </FieldContent>
        </Field>
      </FieldGroup>
    </div>
  ),
};

export const CollapsibleAndDisabled: Story = {
  name: "Collapsible + Disabled Steps",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Collapsible Steps and Disabled States</h3>

      <Field style={frameStyle}>
        <FieldLabel>Publishing Workflow</FieldLabel>

        <FieldContent>
          <Stepper
            steps={disabledSteps}
            variant="vertical"
            collapsible
            allowMultipleOpen
            defaultActiveStepId="draft"
            onAction={fallbackOnAction}
          />

          <FieldDescription>
            Disabled steps can stay visible or be hidden through props. They
            remain non-activatable, but their card can still be expanded or
            collapsed.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const WithSubstepsAndIcons: Story = {
  name: "With Substeps and Icons",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Substeps, Icons, and Default-Open Step</h3>

      <Field style={frameStyle}>
        <FieldLabel>Go-Live Checklist</FieldLabel>

        <FieldContent>
          <Stepper
            steps={substepSteps}
            variant="vertical"
            allowMultipleOpen
            defaultActiveStepId="documents"
            defaultOpenStepIds={["catalog", "documents", "dispatch"]}
            onAction={fallbackOnAction}
            onActiveSubstepChange={fallbackOnActiveSubstepChange}
          />

          <FieldDescription>
            Supports nested substeps with independent active state and action
            events.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const DisabledToggleNoLocks: Story = {
  name: "Disabled Toggle (No Locks)",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Disabled First/Middle/Last Always Toggle</h3>

      <Field style={frameStyle}>
        <FieldLabel>No-Lock Disabled Toggle Verification</FieldLabel>

        <FieldContent>
          <Stepper
            steps={disabledNoLockSteps}
            variant="vertical"
            collapsible
            allowMultipleOpen
            defaultOpenStepIds={[
              "first-disabled",
              "middle-disabled",
              "last-disabled",
            ]}
            defaultActiveStepId="middle-enabled"
            onAction={fallbackOnAction}
          />

          <FieldDescription>
            Verify disabled first, middle, and last step cards can always be
            collapsed/expanded from title/indicator area and the up/down toggle
            button.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const ControlsModes: Story = {
  name: "Prev/Next/Submit Modes",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>
        Buttons: with icons, without icons, icon-only, and placement control
      </h3>

      <FieldGroup style={frameStyle}>
        <Field>
          <FieldLabel>With Icons</FieldLabel>

          <FieldContent>
            <Stepper
              steps={defaultSteps}
              defaultActiveStepId="billing"
              controls={resolveControls("with-icons")}
              onAction={fallbackOnAction}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Without Icons</FieldLabel>

          <FieldContent>
            <Stepper
              steps={defaultSteps}
              defaultActiveStepId="billing"
              controls={resolveControls("without-icons")}
              onAction={fallbackOnAction}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Only Icons</FieldLabel>

          <FieldContent>
            <Stepper
              steps={defaultSteps}
              defaultActiveStepId="billing"
              controls={resolveControls("only-icons")}
              onAction={fallbackOnAction}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Inside Controls Only</FieldLabel>

          <FieldContent>
            <Stepper
              steps={defaultSteps}
              defaultActiveStepId="billing"
              controls={resolveControls("with-icons")}
              showControlsInside
              showControlsOutside={false}
              onAction={fallbackOnAction}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Inside + Outside Controls</FieldLabel>

          <FieldContent>
            <Stepper
              steps={defaultSteps}
              defaultActiveStepId="billing"
              controls={resolveControls("with-icons")}
              showControlsInside
              showControlsOutside
              onAction={fallbackOnAction}
            />
          </FieldContent>
        </Field>
      </FieldGroup>
    </div>
  ),
};

export const ControlledStateFromProps: Story = {
  name: "Active/Open From Props",
  render: () => (
    <Field style={frameStyle}>
      <FieldLabel>Controlled Active + Open State</FieldLabel>

      <FieldContent>
        <ControlledStateDemo />
      </FieldContent>
    </Field>
  ),
};

export const StepperActions: Story = {
  name: "Stepper Actions",
  args: {
    onAction: undefined,
    onActiveStepChange: undefined,
    onOpenStepIdsChange: undefined,
    onActiveSubstepChange: undefined,
    onSubmit: undefined,
  },
  argTypes: {
    onAction: { action: "action" },
    onActiveStepChange: { action: "active-step-change" },
    onOpenStepIdsChange: { action: "open-step-ids-change" },
    onActiveSubstepChange: { action: "active-substep-change" },
    onSubmit: { action: "submit" },
  },
  render: (args) => (
    <Field style={frameStyle}>
      <FieldLabel>Action Events</FieldLabel>

      <FieldContent>
        <Stepper
          steps={substepSteps}
          variant="vertical"
          allowMultipleOpen
          defaultActiveStepId="documents"
          defaultOpenStepIds={["catalog", "documents"]}
          onAction={args.onAction ?? fallbackOnAction}
          onActiveStepChange={
            args.onActiveStepChange ?? fallbackOnActiveStepChange
          }
          onOpenStepIdsChange={
            args.onOpenStepIdsChange ?? fallbackOnOpenStepIdsChange
          }
          onActiveSubstepChange={
            args.onActiveSubstepChange ?? fallbackOnActiveSubstepChange
          }
          onSubmit={args.onSubmit ?? fallbackOnSubmit}
        />

        <FieldDescription>
          Click steps, substeps, toggles, and controls to inspect emitted action
          payloads.
        </FieldDescription>
      </FieldContent>
    </Field>
  ),
};

export const StepperPlayground: StoryObj<StepperPlaygroundArgs> = {
  name: "Stepper Playground",
  args: {
    dataset: "basic",
    controlMode: "default",
    variant: "vertical",
    size: "md",
    disabled: false,
    collapsible: true,
    allowMultipleOpen: false,
    showDescriptions: true,
    showShortDescriptions: true,
    showSubsteps: true,
    showDisabledSteps: true,
    showDisabledSubsteps: true,
    showStepNumbers: true,
    showIndicators: true,
    showControls: true,
    showControlsInside: false,
    showControlsOutside: true,
    showPrevious: true,
    showNext: true,
    showSubmit: true,
    submitOnLastStep: true,
    hideNextWhenLastStep: false,
    defaultActiveStepId: "identity",
  },
  argTypes: {
    dataset: {
      control: "inline-radio",
      options: ["basic", "with-substeps", "disabled"],
    },
    controlMode: {
      control: "inline-radio",
      options: ["default", "with-icons", "without-icons", "only-icons"],
    },
    variant: {
      control: "inline-radio",
      options: [
        "vertical",
        "horizontal",
        "compact-vertical",
        "compact-horizontal",
      ],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    disabled: { control: "boolean" },
    collapsible: { control: "boolean" },
    allowMultipleOpen: { control: "boolean" },
    showDescriptions: { control: "boolean" },
    showShortDescriptions: { control: "boolean" },
    showSubsteps: { control: "boolean" },
    showDisabledSteps: { control: "boolean" },
    showDisabledSubsteps: { control: "boolean" },
    showStepNumbers: { control: "boolean" },
    showIndicators: { control: "boolean" },
    showControls: { control: "boolean" },
    showControlsInside: { control: "boolean" },
    showControlsOutside: { control: "boolean" },
    showPrevious: { control: "boolean" },
    showNext: { control: "boolean" },
    showSubmit: { control: "boolean" },
    submitOnLastStep: { control: "boolean" },
    hideNextWhenLastStep: { control: "boolean" },
    defaultActiveStepId: {
      control: "text",
    },
    activeStepId: { table: { disable: true } },
    defaultOpenStepIds: { control: "object" },
    openStepIds: { table: { disable: true } },
    controls: { table: { disable: true } },
    steps: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    onAction: { action: "action" },
    onActiveStepChange: { action: "active-step-change" },
    onOpenStepIdsChange: { action: "open-step-ids-change" },
    onActiveSubstepChange: { action: "active-substep-change" },
    onSubmit: { action: "submit" },
  },
  render: (args) => {
    const dataset = args.dataset ?? "basic";
    const controlMode = args.controlMode ?? "default";

    return (
      <Field style={frameStyle}>
        <FieldLabel>Interactive Stepper Playground</FieldLabel>

        <FieldContent>
          <Stepper
            key={`${dataset}-${controlMode}-${args.variant}-${args.size}-${args.disabled}-${args.collapsible}-${args.allowMultipleOpen}`}
            steps={resolveSteps(dataset)}
            variant={args.variant}
            size={args.size}
            disabled={args.disabled}
            collapsible={args.collapsible}
            allowMultipleOpen={args.allowMultipleOpen}
            showDescriptions={args.showDescriptions}
            showShortDescriptions={args.showShortDescriptions}
            showSubsteps={args.showSubsteps}
            showDisabledSteps={args.showDisabledSteps}
            showDisabledSubsteps={args.showDisabledSubsteps}
            showStepNumbers={args.showStepNumbers}
            showIndicators={args.showIndicators}
            showControls={args.showControls}
            showControlsInside={args.showControlsInside}
            showControlsOutside={args.showControlsOutside}
            showPrevious={args.showPrevious}
            showNext={args.showNext}
            showSubmit={args.showSubmit}
            submitOnLastStep={args.submitOnLastStep}
            hideNextWhenLastStep={args.hideNextWhenLastStep}
            defaultActiveStepId={args.defaultActiveStepId}
            defaultOpenStepIds={args.defaultOpenStepIds}
            controls={resolveControls(controlMode)}
            onAction={args.onAction ?? fallbackOnAction}
            onActiveStepChange={
              args.onActiveStepChange ?? fallbackOnActiveStepChange
            }
            onOpenStepIdsChange={
              args.onOpenStepIdsChange ?? fallbackOnOpenStepIdsChange
            }
            onActiveSubstepChange={
              args.onActiveSubstepChange ?? fallbackOnActiveSubstepChange
            }
            onSubmit={args.onSubmit ?? fallbackOnSubmit}
          />

          <FieldDescription>
            Playground emits action events for step selection, collapse toggle,
            substep click, and control button actions.
          </FieldDescription>
        </FieldContent>
      </Field>
    );
  },
};
