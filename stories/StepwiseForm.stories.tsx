import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { StepwiseForm, type StepwiseFormStep } from "../src/index";

const meta: Meta<typeof StepwiseForm> = {
  title: "Data/StepwiseForm",
  component: StepwiseForm,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const frameStyle: CSSProperties = {
  width: "min(920px, 96vw)",
  maxWidth: "100%",
};

const bodyTextStyle: CSSProperties = {
  margin: 0,
  fontSize: "0.84rem",
  lineHeight: 1.45,
  color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
};

const basicSteps: StepwiseFormStep[] = [
  {
    id: "profile",
    title: "Profile Details",
    summary: "Step 1 summary for account profile information.",
    description: "Add owner name, email, and organization details.",
    defaultOpen: true,
    content: (
      <p style={bodyTextStyle}>This is the basic content area for step one.</p>
    ),
  },
  {
    id: "preferences",
    title: "Preferences",
    summary: "Step 2 summary for workspace preferences.",
    description: "Configure language, timezone, and default settings.",
    content: (
      <p style={bodyTextStyle}>This is the basic content area for step two.</p>
    ),
  },
  {
    id: "review",
    title: "Review and Submit",
    summary: "Step 3 summary for final verification.",
    description: "Verify all information before final submission.",
    content: (
      <p style={bodyTextStyle}>
        This is the basic content area for the final step.
      </p>
    ),
  },
];

const scrollRows = Array.from({ length: 16 }, (_, index) => index + 1);

const scrollableSteps: StepwiseFormStep[] = [
  {
    id: "documents",
    title: "Documents",
    summary: "Long content with optional scrollbar.",
    description: "Use this when step content can exceed visible area.",
    defaultOpen: true,
    showScrollbar: true,
    contentMaxHeight: "12rem",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        {scrollRows.map((row) => (
          <p key={row} style={bodyTextStyle}>
            Checklist item {row}: review and confirm requirement.
          </p>
        ))}
      </div>
    ),
  },
  {
    id: "signoff",
    title: "Signoff",
    summary: "Submit after reviewing all checklist items.",
    content: <p style={bodyTextStyle}>Final approval and submission step.</p>,
  },
];

const controlOverrideSteps: StepwiseFormStep[] = [
  {
    id: "account",
    title: "Account Setup",
    summary: "Start with account and identity fields.",
    description: "Step-level next button can override shared button props.",
    defaultOpen: true,
    nextBtnProps: {
      variant: "secondary",
      compact: true,
      tooltip: "Continue to billing",
    },
    content: (
      <p style={bodyTextStyle}>
        Step-level `nextBtnProps` is applied here while cards remain joined.
      </p>
    ),
  },
  {
    id: "billing",
    title: "Billing",
    summary:
      "Shared prev/next/submit props are forwarded as full Button props.",
    content: (
      <p style={bodyTextStyle}>
        Shared button props can control variant, compact mode, tooltip, and aria
        attributes.
      </p>
    ),
  },
  {
    id: "confirm",
    title: "Confirmation",
    summary: "Submit final setup.",
    content: (
      <p style={bodyTextStyle}>Submit action is available on the last step.</p>
    ),
  },
];

export const StepwiseFormStory: Story = {
  name: "Stepwise Form",
  render: () => (
    <div style={frameStyle}>
      <StepwiseForm
        steps={basicSteps}
        joined
        showContentDivider={false}
        showFooterDivider={false}
        onAction={action("action")}
        onSubmit={action("submit")}
      />
    </div>
  ),
};

export const StepwiseFormScrollable: Story = {
  name: "Scrollable Content",
  render: () => (
    <div style={frameStyle}>
      <StepwiseForm
        steps={scrollableSteps}
        joined
        contentScrollable
        contentMaxHeight="12rem"
        showContentDivider
        showFooterDivider
        onAction={action("action")}
      />
    </div>
  ),
};

export const StepwiseFormButtonProps: Story = {
  name: "Button Props Overrides",
  render: () => (
    <div style={frameStyle}>
      <StepwiseForm
        steps={controlOverrideSteps}
        joined
        prevBtnProps={{
          variant: "ghost",
          compact: true,
          tooltip: "Go back",
        }}
        nextBtnProps={{
          variant: "outline",
          tooltip: "Move forward",
          "aria-label": "Go to next step",
        }}
        submitBtnProps={{
          variant: "primary",
          tooltip: "Submit setup",
        }}
        controls={{
          submit: {
            label: "Finish",
            iconPosition: "right",
          },
        }}
        onAction={action("action")}
        onSubmit={action("submit")}
      />
    </div>
  ),
};

export const StepwiseFormPlayground: Story = {
  name: "Playground",
  args: {
    size: "md",
    spacing: "md",
    collapsible: true,
    allowMultipleOpen: false,
    joined: true,
    showSummary: true,
    showFooterStepCounter: true,
    headerCollapseTrigger: true,
    contentScrollable: false,
    contentMaxHeight: "14rem",
    showContentDivider: false,
    showFooterDivider: false,
    showPrevious: true,
    showNext: true,
    showSubmit: true,
    hideNextWhenLastStep: true,
    submitOnLastStep: true,
    prevBtnProps: {
      variant: "outline",
    },
    nextBtnProps: {
      variant: "outline",
    },
    submitBtnProps: {
      variant: "primary",
    },
    controls: undefined,
    cardProps: undefined,
    disabled: false,
  },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    spacing: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    collapsible: { control: "boolean" },
    allowMultipleOpen: { control: "boolean" },
    joined: { control: "boolean" },
    showSummary: { control: "boolean" },
    showFooterStepCounter: { control: "boolean" },
    headerCollapseTrigger: { control: "boolean" },
    contentScrollable: { control: "boolean" },
    contentMaxHeight: { control: "text" },
    showContentDivider: { control: "boolean" },
    showFooterDivider: { control: "boolean" },
    showPrevious: { control: "boolean" },
    showNext: { control: "boolean" },
    showSubmit: { control: "boolean" },
    hideNextWhenLastStep: { control: "boolean" },
    submitOnLastStep: { control: "boolean" },
    prevBtnProps: { control: "object" },
    nextBtnProps: { control: "object" },
    submitBtnProps: { control: "object" },
    disabled: { control: "boolean" },
    steps: { table: { disable: true } },
    controls: { control: "object" },
    cardProps: { control: "object" },
    defaultActiveStepId: { table: { disable: true } },
    activeStepId: { table: { disable: true } },
    openStepIds: { table: { disable: true } },
    defaultOpenStepIds: { table: { disable: true } },
    onAction: { action: "action" },
    onActiveStepChange: { action: "active-step-change" },
    onOpenStepIdsChange: { action: "open-step-ids-change" },
    onSubmit: { action: "submit" },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => (
    <div style={frameStyle}>
      <StepwiseForm
        steps={basicSteps}
        size={args.size}
        spacing={args.spacing}
        collapsible={args.collapsible}
        allowMultipleOpen={args.allowMultipleOpen}
        joined={args.joined}
        showSummary={args.showSummary}
        showFooterStepCounter={args.showFooterStepCounter}
        headerCollapseTrigger={args.headerCollapseTrigger}
        contentScrollable={args.contentScrollable}
        contentMaxHeight={args.contentMaxHeight}
        showContentDivider={args.showContentDivider}
        showFooterDivider={args.showFooterDivider}
        showPrevious={args.showPrevious}
        showNext={args.showNext}
        showSubmit={args.showSubmit}
        hideNextWhenLastStep={args.hideNextWhenLastStep}
        submitOnLastStep={args.submitOnLastStep}
        prevBtnProps={args.prevBtnProps}
        nextBtnProps={args.nextBtnProps}
        submitBtnProps={args.submitBtnProps}
        controls={args.controls}
        cardProps={args.cardProps}
        disabled={args.disabled}
        onAction={args.onAction}
        onActiveStepChange={args.onActiveStepChange}
        onOpenStepIdsChange={args.onOpenStepIdsChange}
        onSubmit={args.onSubmit}
      />
    </div>
  ),
};
