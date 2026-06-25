import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  type DialogActionContext,
} from '@keytuno/ui-react';

const meta: Meta<typeof Dialog> = {
  title: 'Overlay/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const stackStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: 'min(860px, 92vw)',
};

const mutedTextStyle: CSSProperties = {
  margin: 0,
  fontSize: '0.8125rem',
  color: 'var(--ktn-text-secondary, var(--ktn-text-primary))',
};

const longParagraphs = [
  'The strategy summary includes confirmed entries, pending executions, and risk boundaries based on your selected profile.',
  'Before placing an order, verify lot size, order type, and stop-loss value to avoid accidental high-risk exposure.',
  'Adjust your alert thresholds to receive updates whenever implied volatility or open interest shifts significantly.',
  'For overnight positions, ensure margin availability and review broker-level square-off timings.',
  'You can export all positions with mark-to-market values from this dialog once review is complete.',
  'Use tags and notes to group trades by setup quality, confidence level, and session type.',
  'A sticky footer keeps quick actions visible even when the content panel is long and scrollable.',
  'This demo intentionally includes extra text to verify scrolling and spacing behavior in the modal body.',
];

function renderStandardContent(): JSX.Element {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Deploy Portfolio Changes</DialogTitle>
        <DialogDescription>
          Review the selected changes before applying them to your active portfolio.
        </DialogDescription>
      </DialogHeader>

      <p style={mutedTextStyle}>
        This action updates allocation targets and may rebalance existing holdings.
      </p>

      <DialogFooter>
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button variant="primary" size="sm">
          Apply Changes
        </Button>
      </DialogFooter>
    </>
  );
}

export const Basic: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Basic</h3>

      <Dialog trigger="Open Dialog">
        <DialogContent>{renderStandardContent()}</DialogContent>
      </Dialog>
    </div>
  ),
};

export const NoCloseButton: Story = {
  name: 'No Close Button',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>No Close Button</h3>

      <Dialog trigger="Open without close" variant="outline">
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Terms Confirmation</DialogTitle>
            <DialogDescription>
              This dialog intentionally hides the top close button.
            </DialogDescription>
          </DialogHeader>

          <p style={mutedTextStyle}>
            Close this dialog by clicking outside, pressing Escape, or using footer actions.
          </p>

          <DialogFooter>
            <Button size="sm" variant="outline">
              Back
            </Button>
            <Button size="sm" variant="primary">
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
};

export const StickyFooter: Story = {
  name: 'Sticky Footer',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Sticky Footer</h3>

      <Dialog trigger="Open sticky footer dialog" variant="primary">
        <DialogContent scrollable maxContentHeight="24rem">
          <DialogHeader>
            <DialogTitle>Risk Checklist</DialogTitle>
            <DialogDescription>
              Scroll content while keeping actions always visible.
            </DialogDescription>
          </DialogHeader>

          {longParagraphs.map((text, index) => (
            <p key={`sticky-line-${index}`} style={mutedTextStyle}>
              {text}
            </p>
          ))}

          <DialogFooter sticky>
            <Button size="sm" variant="outline">
              Save Draft
            </Button>
            <Button size="sm" variant="primary">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
};

export const ScrollableContent: Story = {
  name: 'Scrollable Content',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Scrollable Content</h3>

      <Dialog trigger="Open scrollable dialog" variant="secondary">
        <DialogContent scrollable maxContentHeight="20rem">
          <DialogHeader>
            <DialogTitle>Scrollable Activity Feed</DialogTitle>
            <DialogDescription>
              Long content is contained in a scrollable dialog body.
            </DialogDescription>
          </DialogHeader>

          {longParagraphs.concat(longParagraphs).map((text, index) => (
            <p key={`scroll-line-${index}`} style={mutedTextStyle}>
              {text}
            </p>
          ))}

          <DialogFooter>
            <Button size="sm" variant="outline">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
};

export const DialogPlayground: Story = {
  name: 'Dialog Playground',
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    closeOnOverlayClick: true,
    closeOnEscape: true,
    defaultOpen: false,
    trigger: 'Open Playground Dialog',
    withAction: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
    },
    varient: { table: { disable: true } },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    closeOnOverlayClick: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
    trigger: { control: 'text' },
    withAction: { control: 'boolean' },
    open: { table: { disable: true } },
    onAction: { action: 'action' },
    onOpenChange: { action: 'open-change' },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const withAction = args.withAction ?? false;
    const onAction = withAction ? args.onAction : undefined;

    return (
      <Dialog
        key={`${args.variant}-${args.size}-${args.disabled}-${args.closeOnOverlayClick}-${args.closeOnEscape}-${args.defaultOpen}`}
        variant={args.variant}
        size={args.size}
        disabled={args.disabled}
        closeOnOverlayClick={args.closeOnOverlayClick}
        closeOnEscape={args.closeOnEscape}
        defaultOpen={args.defaultOpen}
        trigger={args.trigger}
        onAction={onAction}
        onOpenChange={args.onOpenChange}
      >
        <DialogContent>{renderStandardContent()}</DialogContent>
      </Dialog>
    );
  },
};

export const DialogActions: Story = {
  name: 'Dialog Actions',
  args: {
    onAction: undefined,
    onOpenChange: undefined,
  },
  argTypes: {
    onAction: {
      action: 'action',
      description:
        'Fires when open state changes from trigger, overlay click, escape key, or close button.',
    },
    onOpenChange: {
      action: 'open-change',
      description: 'Fires with the next open state whenever the dialog toggles.',
    },
  },
  render: (args) => {
    const onAction = args.onAction;
    const onOpenChange = args.onOpenChange;

    const handleAction =
      onAction == null
        ? undefined
        : (context: DialogActionContext) => {
            onAction(context);
          };

    return (
      <div style={stackStyle}>
        <h3 style={{ margin: 0 }}>Action Events</h3>

        <Dialog
          trigger="Open Action Dialog"
          variant="primary"
          onAction={handleAction}
          onOpenChange={onOpenChange}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Inspect Dialog Action Sources</DialogTitle>
              <DialogDescription>
                Open and close this dialog from different controls to see emitted action context.
              </DialogDescription>
            </DialogHeader>

            <p style={mutedTextStyle}>
              Try close button, overlay click, and Escape key to compare action sources in the
              Storybook actions panel.
            </p>

            <DialogFooter>
              <Button variant="outline" size="sm">
                Keep Reviewing
              </Button>
              <Button variant="primary" size="sm">
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
};

export const DialogScrollablePlayground: Story = {
  name: 'Scrollable Playground',
  args: {
    variant: 'secondary',
    size: 'md',
    disabled: false,
    closeOnOverlayClick: true,
    closeOnEscape: true,
    trigger: 'Open Scrollable Playground',
    withAction: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
    },
    varient: { table: { disable: true } },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    closeOnOverlayClick: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
    trigger: { control: 'text' },
    withAction: { control: 'boolean' },
    open: { table: { disable: true } },
    defaultOpen: { table: { disable: true } },
    onAction: { action: 'action' },
    onOpenChange: { action: 'open-change' },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const withAction = args.withAction ?? false;
    const onAction = withAction ? args.onAction : undefined;
    const onOpenChange = withAction ? args.onOpenChange : undefined;

    return (
      <Dialog
        key={`scrollable-${args.variant}-${args.size}-${args.disabled}`}
        variant={args.variant}
        size={args.size}
        disabled={args.disabled}
        closeOnOverlayClick={args.closeOnOverlayClick}
        closeOnEscape={args.closeOnEscape}
        trigger={args.trigger}
        onAction={onAction}
        onOpenChange={onOpenChange}
      >
        <DialogContent scrollable maxContentHeight="20rem">
          <DialogHeader>
            <DialogTitle>Scrollable Playground Content</DialogTitle>
            <DialogDescription>
              This playground keeps dialog props configurable while content remains scrollable.
            </DialogDescription>
          </DialogHeader>

          {longParagraphs.concat(longParagraphs).map((text, index) => (
            <p key={`scrollable-playground-line-${index}`} style={mutedTextStyle}>
              {text}
            </p>
          ))}

          <DialogFooter>
            <Button size="sm" variant="outline">
              Cancel
            </Button>
            <Button size="sm" variant="primary">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};

export const DialogFooterPlayground: Story = {
  name: 'Sticky Footer Playground',
  args: {
    variant: 'outline',
    size: 'md',
    disabled: false,
    closeOnOverlayClick: true,
    closeOnEscape: true,
    trigger: 'Open Sticky Footer Playground',
    withAction: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
    },
    varient: { table: { disable: true } },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    closeOnOverlayClick: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
    trigger: { control: 'text' },
    withAction: { control: 'boolean' },
    open: { table: { disable: true } },
    defaultOpen: { table: { disable: true } },
    onAction: { action: 'action' },
    onOpenChange: { action: 'open-change' },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const withAction = args.withAction ?? false;
    const onAction = withAction ? args.onAction : undefined;
    const onOpenChange = withAction ? args.onOpenChange : undefined;

    return (
      <Dialog
        key={`sticky-footer-${args.variant}-${args.size}-${args.disabled}`}
        variant={args.variant}
        size={args.size}
        disabled={args.disabled}
        closeOnOverlayClick={args.closeOnOverlayClick}
        closeOnEscape={args.closeOnEscape}
        trigger={args.trigger}
        onAction={onAction}
        onOpenChange={onOpenChange}
      >
        <DialogContent scrollable maxContentHeight="22rem">
          <DialogHeader>
            <DialogTitle>Sticky Footer Playground</DialogTitle>
            <DialogDescription>
              Footer action buttons stay pinned while content scrolls.
            </DialogDescription>
          </DialogHeader>

          {longParagraphs.concat(longParagraphs).map((text, index) => (
            <p key={`sticky-footer-playground-line-${index}`} style={mutedTextStyle}>
              {text}
            </p>
          ))}

          <DialogFooter sticky>
            <Button size="sm" variant="outline">
              Review Later
            </Button>
            <Button size="sm" variant="primary">
              Confirm Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};
